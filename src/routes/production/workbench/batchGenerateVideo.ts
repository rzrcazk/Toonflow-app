import express from "express";
import u from "@/utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { buildVideoReferenceList, getVideoSupportedDurations, normalizeGenerateVideoInput } from "@/utils/videoGenerationInput";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    scriptId: z.number(),
    trackData: z.array(
      z.object({
        uploadData: z.array(
          z.object({
            id: z.number(),
            sources: z.string(),
          }),
        ),
        trackId: z.number(),
        prompt: z.string(),
        duration: z.union([z.number(), z.string()]),
      }),
    ),
    model: z.string(),
    mode: z.union([z.string(), z.array(z.string())]),
    resolution: z.string(),
    audio: z.boolean().optional(),
  }),
  async (req, res) => {
    const { scriptId, projectId, trackData, model, resolution, audio, mode } = req.body;
    const normalizedMode = normalizeGenerateVideoInput(mode, 5).mode;
    const supportedDurations = await getVideoSupportedDurations(model);

    // 获取生成视频比例
    const ratio = await u.db("o_project").select("videoRatio").where("id", projectId).first();

    // 为每个 track 预处理数据并插入数据库，返回任务列表
    let preparedTracks;
    try {
      preparedTracks = await Promise.all(
        (trackData as { uploadData: { id: number; sources: "assets" | "storyboard" }[]; trackId: number; prompt: string; duration: unknown }[]).map(
          async (track) => ({
            ...track,
            duration: normalizeGenerateVideoInput(normalizedMode, track.duration, supportedDurations).duration,
            referenceList: await buildVideoReferenceList(track.uploadData, normalizedMode),
          }),
        ),
      );
      console.log(
        `[批量视频生成入参] model=${model} mode=${JSON.stringify(normalizedMode)} tracks=${JSON.stringify(
          preparedTracks.map((track: any) => ({
            trackId: track.trackId,
            uploadData: track.uploadData,
            refs: track.referenceList.map((ref: any, index: number) => ({
              index: index + 1,
              type: ref.type,
              sourceType: ref.sourceType,
              hasBase64: Boolean(ref.base64),
              url: ref.url,
            })),
          })),
        )}`,
      );
    } catch (error) {
      return res.status(400).send({ message: u.error(error).message });
    }

    const tasks = await Promise.all(
      preparedTracks.map(async (track) => {
        const videoPath = `/${projectId}/video/${uuidv4()}.mp4`;
        const [videoId] = await u.db("o_video").insert({
          filePath: videoPath,
          time: Date.now(),
          state: "生成中",
          scriptId,
          projectId,
          videoTrackId: track.trackId,
        });

        return { videoId, videoPath, prompt: track.prompt, duration: track.duration, referenceList: track.referenceList, trackId: track.trackId };
      }),
    );

    res.status(200).send(success(tasks.map((t) => ({ videoId: t.videoId, trackId: t.trackId }))));
    for (const { videoId, videoPath, prompt, duration, referenceList, trackId } of tasks) {
      // 所有任务全部并发后台执行，完全不阻塞任何进程
      const relatedObjects = { projectId, videoId, scriptId, type: "视频" };
      const aiVideo = u.Ai.Video(model);
      aiVideo
        .run(
          {
            prompt,
            referenceList,
            mode: normalizedMode,
            duration,
            aspectRatio: (ratio?.videoRatio as "16:9" | "9:16") || "16:9",
            resolution,
            audio,
          },
          {
            projectId,
            taskClass: "视频生成",
            describe: "根据提示词生成视频",
            relatedObjects: JSON.stringify(relatedObjects),
          },
        )
        .then(async () => await aiVideo.save(videoPath))
        .then(async () => await u.db("o_video").where("id", videoId).update({ state: "生成成功" }))
        .catch(async (error: any) => {
          const message = u.error(error).message;
          console.error(`[批量视频生成失败] videoId=${videoId} trackId=${trackId} model=${model}: ${message}`, error?.stack ?? error);
          await u
            .db("o_video")
            .where("id", videoId)
            .update({
              state: "生成失败",
              errorReason: message,
            });
        });
    }
  },
);

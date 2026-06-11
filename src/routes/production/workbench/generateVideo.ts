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
    uploadData: z.array(
      z.object({
        id: z.number(),
        sources: z.string(),
      }),
    ),
    prompt: z.string(),
    model: z.string(),
    mode: z.union([z.string(), z.array(z.string())]),
    resolution: z.string(),
    duration: z.union([z.number(), z.string()]),
    audio: z.boolean().optional(),
    trackId: z.number(),
  }),
  async (req, res) => {
    const { scriptId, projectId, prompt, uploadData, model, resolution, audio, mode, trackId } = req.body;
    const supportedDurations = await getVideoSupportedDurations(model);
    const normalized = normalizeGenerateVideoInput(mode, req.body.duration, supportedDurations);
    //获取生成视频比例
    const ratio = await u.db("o_project").select("videoRatio").where("id", projectId).first();
    const videoPath = `/${projectId}/video/${uuidv4()}.mp4`; //视频保存路径
    let referenceList;
    try {
      referenceList = await buildVideoReferenceList(uploadData, normalized.mode);
      console.log(
        `[视频生成入参] model=${model} mode=${JSON.stringify(normalized.mode)} uploadData=${JSON.stringify(uploadData)} refs=${JSON.stringify(
          referenceList.map((ref: any, index: number) => ({
            index: index + 1,
            type: ref.type,
            sourceType: ref.sourceType,
            hasBase64: Boolean(ref.base64),
            url: ref.url,
          })),
        )}`,
      );
    } catch (error) {
      return res.status(400).send({ message: u.error(error).message });
    }
    //新增
    const [videoId] = await u.db("o_video").insert({
      filePath: videoPath,
      time: Date.now(),
      state: "生成中",
      scriptId,
      projectId,
      videoTrackId: trackId,
    });
    res.status(200).send(success(videoId));
    const relatedObjects = {
      projectId,
      videoId,
      scriptId,
      type: "视频",
    };
    const aiVideo = u.Ai.Video(model);
    aiVideo
      .run(
        {
          prompt,
          referenceList,
          mode: normalized.mode,
          duration: normalized.duration,
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
        console.error(`[视频生成失败] videoId=${videoId} trackId=${trackId} model=${model}: ${message}`, error?.stack ?? error);
        await u
          .db("o_video")
          .where("id", videoId)
          .update({
            state: "生成失败",
            errorReason: message,
          });
      });
  },
);

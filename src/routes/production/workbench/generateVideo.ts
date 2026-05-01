import express from "express";
import u from "@/utils";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { ReferenceList } from "@/utils/ai";
const router = express.Router();

type Type = "imageReference" | "startImage" | "endImage" | "videoReference" | "audioReference";
interface UploadItem {
  fileType: "image" | "video" | "audio";
  type: Type;
  sources?: "assets" | "storyboard";
  id?: number;
  src?: string;
  label?: string;
  prompt?: string;
}

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
    mode: z.string(),
    resolution: z.string(),
    duration: z.number(),
    audio: z.boolean().optional(),
    trackId: z.number(),
  }),
  async (req, res) => {
    const { scriptId, projectId, prompt, uploadData, model, duration, resolution, audio, mode, trackId } = req.body;
    let modeData = [];
    if (typeof mode === "string" && mode.startsWith('["') && mode.endsWith('"]')) {
      try {
        modeData = JSON.parse(mode);
      } catch (e) {
        console.warn("[generateVideo] mode 字段解析失败，按空处理:", (e as Error).message);
      }
    }
    //获取生成视频比例
    const ratio = await u.db("o_project").select("videoRatio").where("id", projectId).first();
    const videoPath = `/${projectId}/video/${uuidv4()}.mp4`; //视频保存路径

    // 一次性查询出图片 filePath，同时生成 URL 和 base64
    // URL 给 qwen2api 等用（避免 base64 超长），base64 给 jimeng 等用（兼容旧逻辑）
    const ossInternalUrl = process.env.OSS_INTERNAL_URL || `http://toonflow-app:10588`;
    const imagePaths: string[] = [];
    await Promise.all(
      uploadData.map(async (item: UploadItem) => {
        let filePath = "";
        if (item.sources === "storyboard") {
          const record = await u.db("o_storyboard").where("id", item.id).select("filePath").first();
          filePath = record?.filePath || "";
        } else if (item.sources === "assets") {
          const record = await u
            .db("o_assets")
            .where("o_assets.id", item.id)
            .leftJoin("o_image", "o_assets.imageId", "o_image.id")
            .select("o_image.filePath", "o_image.type")
            .first();
          filePath = record?.filePath || "";
        }
        imagePaths.push(filePath);
      }),
    );

    const validPaths = imagePaths.filter(Boolean);
    const imageUrls = validPaths.map((p) => `${ossInternalUrl}/oss/${p}`);
    const base64List: (string | null)[] = await Promise.all(
      validPaths.map(async (p) => await u.oss.getImageBase64(p)),
    );
    console.log("[generateVideo DEBUG] imagePaths:", JSON.stringify(imagePaths));
    console.log("[generateVideo DEBUG] imageUrls:", JSON.stringify(imageUrls));
    console.log("[generateVideo DEBUG] base64长度:", base64List.map(b => b ? `${b.length} chars` : null));

    //新增
    const result = await u.db("o_video").insert({
      videoPath: videoPath,
      state: "生成中",
      scriptId,
      projectId,
      videoTrackId: trackId,
    }).returning('id');
    const videoId = result[0]?.id ?? result[0];
    res.status(200).send(success(videoId));
    (async () => {
      try {
        const relatedObjects = {
          projectId,
          videoId,
          scriptId,
          type: "视频",
        };
        const aiVideo = u.Ai.Video(model);
        await aiVideo.run(
          {
            prompt,
            referenceList: validPaths.map((p, i) => ({
              type: "image" as const,
              sourceType: "url" as const,
              url: imageUrls[i],
              base64: base64List[i] || "", // 兼容依赖 base64 的 vendor（如 jimeng）
            })),
            mode: modeData.length > 0 ? modeData : mode,
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
        );
        await aiVideo.save(videoPath);
        await u.db("o_video").where("id", videoId).update({ state: "生成成功" });
      } catch (error: any) {
        await u
          .db("o_video")
          .where("id", videoId)
          .update({
            state: "生成失败",
            errorReason: u.error(error).message,
          });
      }
    })();
  },
);

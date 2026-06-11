import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { buildVideoUploadPath, readVideoBase64Upload } from "@/utils/videoWorkbench";

const router = express.Router();

function toValidNumber(value: unknown, label: string): number {
  const num = Number(value);
  if (!Number.isFinite(num)) throw new Error(`${label} 必须是有效数字`);
  return num;
}

export default router.post(
  "/",
  validateFields({
    projectId: z.union([z.number(), z.string()]),
    scriptId: z.number(),
    trackId: z.number(),
    name: z.string().optional(),
    base64Data: z.string(),
  }),
  async (req, res) => {
    try {
      const projectId = toValidNumber(req.body.projectId, "projectId");
      const scriptId = toValidNumber(req.body.scriptId, "scriptId");
      const trackId = toValidNumber(req.body.trackId, "trackId");

      const project = await u.db("o_project").where("id", projectId).first();
      if (!project) return res.status(400).send({ message: "projectId 无效，未找到项目" });

      const script = await u.db("o_script").where({ id: scriptId, projectId }).first();
      if (!script) return res.status(400).send({ message: "scriptId 无效，未找到该项目下的剧本" });

      const track = await u.db("o_videoTrack").where({ id: trackId, projectId, scriptId }).first();
      if (!track) return res.status(400).send({ message: "trackId 无效，未找到该剧本下的视频轨道" });

      const upload = readVideoBase64Upload(req.body.base64Data);
      const videoPath = buildVideoUploadPath(projectId, upload.ext);

      await u.oss.writeFile(videoPath, upload.buffer);
      const [videoId] = await u.db("o_video").insert({
        filePath: videoPath,
        time: Date.now(),
        state: "已完成",
        scriptId,
        projectId,
        videoTrackId: trackId,
      });

      res.status(200).send(
        success({
          id: videoId,
          src: await u.oss.getFileUrl(videoPath),
          state: "已完成",
          duration: null,
        }),
      );
    } catch (error) {
      res.status(400).send({ message: u.error(error).message });
    }
  },
);

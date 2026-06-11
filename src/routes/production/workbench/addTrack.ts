import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { normalizeVideoDuration } from "@/utils/videoWorkbench";
const router = express.Router();
export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    scriptId: z.number(),
    duration: z.union([z.number(), z.string()]).optional(),
  }),
  async (req, res) => {
    const { projectId, scriptId, duration } = req.body;
    const trackId = Date.now();
    await u.db("o_videoTrack").insert({
      id: trackId,
      projectId,
      scriptId,
      duration: normalizeVideoDuration(duration),
    });
    res.status(200).send(success(trackId));
  },
);

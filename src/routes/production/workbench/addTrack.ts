import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();
export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    scriptId: z.number(),
    duration: z.number().optional(),
  }),
  async (req, res) => {
    const { projectId, scriptId, duration } = req.body;
    const trackResult = await u.db("o_videoTrack").insert({
      projectId,
      scriptId,
      duration,
    }).returning("id");
    const trackId = trackResult[0]?.id ?? trackResult[0];
    res.status(200).send(success(trackId));
  },
);

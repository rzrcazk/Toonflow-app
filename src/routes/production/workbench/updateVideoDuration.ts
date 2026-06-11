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
        id: z.number(),
        duration: z.union([z.number(), z.string()]).optional(),
    }),
    async (req, res) => {
        const { id, duration } = req.body;
        await u.db("o_videoTrack").where("id", id).update({
            duration: normalizeVideoDuration(duration),
        });
        res.status(200).send(success("更新成功"));
    },
);

import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    ids: z.array(z.number()),
  }),
  async (req, res) => {
    const { ids } = req.body;
    // extractState: 0=待提取，1=完成，2=生成中，-1=失败
    const data = await u.db("o_script").whereIn("id", ids).whereNot("extractState", 2).select("id", "extractState", "errorReason");
    res.status(200).send(success(data));
  },
);

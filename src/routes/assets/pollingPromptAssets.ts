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
    const data = await u.db("o_assets").whereIn("id", ids).whereNot("promptState", "生成中").select("*");
    // 将 created_at 转换为时间戳数字格式，并改名为 createTime
    const result = data.map((item) => ({
      ...item,
      createTime: item.created_at ? new Date(item.created_at).getTime() : null,
    }));
    res.status(200).send(success(result));
  },
);

import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { id } from "zod/locales";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    id: z.number(),
    url: z.string(),
    flowId: z.number(),
  }),
  async (req, res) => {
    const { id, url, flowId } = req.body;
    // 查询 assets 获取 projectId
    const asset = await u.db("o_assets").where("id", id).select("projectId").first();
    const projectId = asset?.projectId;
    const result = await u.db("o_image").insert({
      projectId,
      filePath: u.replaceUrl(url),
      state: "已完成",
      assetsId: id,
    }).returning('id');
    const imageId = result[0]?.id ?? result[0];
    await u.db("o_assets").where({ id }).update({ flowId, imageId });
    res.status(200).send(success({ message: "更新提示词成功" }));
  },
);

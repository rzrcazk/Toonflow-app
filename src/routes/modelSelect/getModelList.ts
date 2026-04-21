import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    type: z.enum(["text", "image", "video", "all"]),
  }),
  async (req, res) => {
    const { type } = req.body;
    const dataList = await u.db("o_vendorConfig").select("id").where("enable", 1);
    if (!dataList || dataList.length === 0) {
      return res.status(404).send({ error: "模型未找到" });
    }
    const modelList = await Promise.all(dataList.map((i) => u.vendor.getModelList(i.id!)));
    const result = await Promise.all(
      dataList.map(async (data, index) => {
        const vendorData = await u.vendor.getVendor(data.id!);
        const models = modelList[index];
        // 当 type=video 时返回所有类型（因为生成视频提示词需要文本 LLM，生成视频需要视频模型）
        // 用户自己根据需求选择合适的模型
        const filtered =
          type === "all" || type === "video"
            ? models
            : models.filter((item: { type: string }) => item.type === type);
        return filtered.map((item: { name: string; modelName: string; type: string }) => ({
          id: data.id,
          label: item.name,
          value: item.modelName,
          type: item.type,
          name: vendorData.name,
        }));
      }),
    );
    res.status(200).send(success(result.flat()));
  },
);

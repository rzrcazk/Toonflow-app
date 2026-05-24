import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

// 获取用户
export default router.post(
  "/",
  validateFields({
    messagesPerSummary: z.number(),
    shortTermLimit: z.number(),
    summaryMaxLength: z.number(),
    summaryLimit: z.number(),
    ragLimit: z.number(),
    deepRetrieveSummaryLimit: z.number(),
    embeddingProvider: z.enum(["local", "openai"]).optional(),
    embeddingModel: z.string().optional(),
    embeddingDimensions: z.number().optional(),
    modelOnnxFile: z.array(z.string()),
    modelDtype: z.string(),
  }),
  async (req, res) => {
    const {
      messagesPerSummary,
      shortTermLimit,
      summaryMaxLength,
      summaryLimit,
      ragLimit,
      deepRetrieveSummaryLimit,
      embeddingProvider,
      embeddingModel,
      embeddingDimensions,
      modelOnnxFile,
      modelDtype,
    } = req.body;

    const upsert = async (key: string, value: string | number) => {
      const exists = await u.db("o_setting").where("key", key).first();
      if (exists) {
        await u.db("o_setting").where("key", key).update({ value });
      } else {
        await u.db("o_setting").insert({ key, value });
      }
    };

    await upsert("messagesPerSummary", messagesPerSummary);
    await upsert("shortTermLimit", shortTermLimit);
    await upsert("summaryMaxLength", summaryMaxLength);
    await upsert("summaryLimit", summaryLimit);
    await upsert("ragLimit", ragLimit);
    await upsert("deepRetrieveSummaryLimit", deepRetrieveSummaryLimit);
    if (embeddingProvider) await upsert("embeddingProvider", embeddingProvider);
    if (embeddingModel) await upsert("embeddingModel", embeddingModel);
    if (embeddingDimensions !== undefined) await upsert("embeddingDimensions", String(embeddingDimensions));
    await upsert("modelOnnxFile", JSON.stringify(modelOnnxFile));
    await upsert("modelDtype", modelDtype);

    res.status(200).send(success("保存设置成功"));
  },
);

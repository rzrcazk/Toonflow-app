import express from "express";
import { error, success } from "@/lib/responseFormat";
import u from "@/utils";
const router = express.Router();

export default router.get("/", async (req, res) => {
  const settingData = await u
    .db("o_setting")
    .whereIn("key", [
      "messagesPerSummary",
      "shortTermLimit",
      "summaryMaxLength",
      "summaryLimit",
      "ragLimit",
      "deepRetrieveSummaryLimit",
      "embeddingProvider",
      "embeddingModel",
      "embeddingDimensions",
      "modelOnnxFile",
      "modelDtype",
    ]);

  if (!settingData) return res.status(400).send(error(`获取记忆配置失败`));
  const memoryObj: Record<string, number | string | string[]> = {};

  settingData.forEach((i: { key?: string | null; value?: string | null }) => {
    if (i.key && i.value) {
      let value: number | string | string[] = i.value;
      if (i.key == "modelOnnxFile") {
        value = JSON.parse(i.value);
      } else if (!["modelDtype", "embeddingProvider", "embeddingModel"].includes(i.key)) {
        value = Number(value);
      }
      memoryObj[i.key] = value;
    }
  });

  res.status(200).send(success({ ...memoryObj }));
});

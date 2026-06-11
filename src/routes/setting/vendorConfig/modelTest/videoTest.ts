import express from "express";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import u from "@/utils";
import { z } from "zod";
import { persistModelTestReferences } from "@/utils/modelTestReference";
const router = express.Router();

// 检查语言模型
export default router.post(
  "/",
  validateFields({
    modelName: z.string(),
    id: z.string(),
    mode: z.string(),
    prompt: z.string(),
    videos: z.array(
      z.object({
        type: z.string(),
        base64: z.string(),
      }),
    ),
    audios: z.array(
      z.object({
        type: z.string(),
        base64: z.string(),
      }),
    ),
    images: z.array(
      z.object({
        type: z.string(),
        base64: z.string(),
      }),
    ),
  }),
  async (req, res) => {
    const { modelName, id, mode, prompt, images, videos, audios } = req.body;

    try {
      const vendorConfigData = await u.db("o_vendorConfig").where("id", id).first();

      if (!vendorConfigData) return res.status(500).send(error("未找到该供应商配置"));
      if (!vendorConfigData.models) return res.status(500).send(error("未找到模型列表"));
      const modelList = await u.vendor.getModelList(vendorConfigData.id!);

      const selectedModel = modelList.find((i: any) => i.modelName == modelName);
      if (!selectedModel) return res.status(500).send(error("未找到该模型"));

      let modeData = [];
      if (Array.isArray(mode)) {
      } else if (typeof mode === "string" && mode.startsWith('["') && mode.endsWith('"]')) {
        try {
          modeData = JSON.parse(mode);
        } catch (e) {}
      }
      const referenceList = [
        ...(await persistModelTestReferences(images, "image", u.oss)),
        ...(await persistModelTestReferences(videos, "video", u.oss)),
        ...(await persistModelTestReferences(audios, "audio", u.oss)),
      ];
      const reqFn = await u.Ai.Video(`${id}:${modelName}`).run({
        duration: selectedModel.durationResolutionMap[0].duration[0],
        resolution: selectedModel.durationResolutionMap[0].resolution[0],
        aspectRatio: "16:9",
        prompt: prompt,
        referenceList,
        audio: typeof selectedModel.audio == "boolean" ? selectedModel.audio : true,
        mode: modeData.length > 0 ? modeData : mode,
      });
      await reqFn.save("test.mp4");
      const resultUrl = await u.oss.getFileUrl("test.mp4");
      res.status(200).send(success(resultUrl));
    } catch (err) {
      console.error(err);
      const msg = u.error(err).message;
      console.error(msg);
      res.status(500).send(error(msg));
    }
  },
);

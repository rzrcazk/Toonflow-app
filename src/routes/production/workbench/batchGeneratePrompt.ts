import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { info } from "node:console";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    trackData: z.array(
      z.object({
        trackId: z.number(),
        info: z.array(
          z.object({
            id: z.number(),
            sources: z.string(),
          }),
        ),
      }),
    ),
    model: z.string(),
  }),
  async (req, res) => {
    const { trackId, projectId, info, model } = req.body;
    //查询参数
    const images = await Promise.all(
      info.map(async (item: { id: number; sources: string }) => {
        if (item.sources === "storyboard") {
          // 查询分镜主信息
          const storyboard = await u
            .db("o_storyboard")
            .where("o_storyboard.id", item.id)
            .select("videoDesc", "prompt", "track", "duration", "shouldGenerateImage")
            .first();
          // 查询分镜关联的资产ID
          const assetRows = await u
            .db("o_assets2Storyboard")
            .leftJoin("o_assets", "o_assets2Storyboard.assetId", "o_assets.id")
            .leftJoin("o_image", "o_image.id", "o_assets.imageId")
            .where("storyboardId", item.id)
            .orderBy("o_assets2Storyboard.rowid")
            .select("assetId", "o_assets.id", "o_assets.type", "o_assets.name", "o_assets.describe", "o_assets.prompt", "o_image.filePath");
          const associateAssetsIds = assetRows.map((row: any) => row.assetId);
          return {
            ...storyboard,
            associateAssetsIds,
            associateAssets: assetRows.map((row: any) => ({
              id: row.id,
              type: row.type,
              name: row.name,
              describe: row.describe,
              prompt: row.prompt,
              filePath: row.filePath,
            })),
            _type: "storyboard", // 标记类型，便于后续区分
          };
        }
        if (item.sources === "assets") {
          // 查询素材
          const assetsData = await u
            .db("o_assets")
            .leftJoin("o_image", "o_image.id", "o_assets.imageId")
            .where("o_assets.id", item.id)
            .select("o_assets.id", "o_assets.type", "o_assets.name", "o_assets.describe", "o_assets.prompt", "o_image.filePath")
            .first();
          return {
            ...assetsData,
            _type: "assets", // 标记类型
          };
        }
      }),
    );

    // 拆分 assets 和 storyboard
    const assets: any[] = [];
    const storyboard: any[] = [];
    for (const item of images) {
      if (!item) continue; // 忽略空
      if (item._type === "assets")
        assets.push({
          id: item.id,
          type: item.type,
          name: item.name,
          describe: item.describe,
          prompt: item.prompt,
          filePath: item.filePath,
        });
      if (item._type === "storyboard")
        storyboard.push({
          videoDesc: item.videoDesc,
          prompt: item.prompt,
          track: item.track,
          duration: item.duration,
          associateAssetsIds: item.associateAssetsIds,
          associateAssets: item.associateAssets,
          shouldGenerateImage: item.shouldGenerateImage,
        });
    }
    const seenAssetIds = new Set(assets.map((item) => item.id));
    storyboard
      .flatMap((item) => item.associateAssets ?? [])
      .forEach((item) => {
        if (!item?.id || seenAssetIds.has(item.id)) return;
        seenAssetIds.add(item.id);
        assets.push(item);
      });

    const [id, modelData] = model.split(/:(.+)/);
    const projectData = await u.db("o_project").select("*").where({ id: projectId }).first();
    const videoPrompt = await u.db("o_prompt").where("type", "videoPromptGeneration").first();
    let videoPromptGeneration = "" as string | undefined;
    if (videoPrompt && videoPrompt.useData) {
      videoPromptGeneration = videoPrompt.useData;
    } else {
      videoPromptGeneration = videoPrompt?.data ?? undefined;
    }
    const artStyle = projectData?.artStyle || "无";
    const visualManual = u.getArtPrompt(artStyle, "art_skills", "art_storyboard_video");
    const identityRule = `\n\n【强制角色身份规则】资产信息已提供 describe/prompt 时，必须用资产描述提取角色身份锚点。多角色镜头不要只写角色名，必须写清每个主要角色的外观锚点、服装/体型、固定站位、道具职责和说话状态。若同镜出现两个及以上角色，提示词中必须加入“身份不可互换”约束，明确主要角色不得交换体型、服装、位置、道具或动作；群像/杂役只作为背景围观，不得替代主要角色。动作段提到角色时，尽量使用“短身份锚点 + 角色名”，例如“宽脸壮实的王师兄”“高瘦手持生死状的周师兄”。`;
    const content = `
          **模型名称**：${modelData},
          **资产信息**（角色、场景、道具、音频):${assets
            .map((i) => {
              const describe = i.describe ? `, describe:${String(i.describe).replace(/\]/g, "）")}` : "";
              const prompt = i.prompt ? `, prompt:${String(i.prompt).replace(/\]/g, "）")}` : "";
              return `[${i.id},${i.type},${i.name}${describe}${prompt}]`;
            })
            .join("，")},
          **分镜信息**：${storyboard.map(
            (i) => `<storyboardItem
  videoDesc='${i.videoDesc}'
  duration='${i.duration}'
></storyboardItem>`,
          )},
          ${identityRule}
          `;

    try {
      const { text } = await u.Ai.Text("universalAi").invoke({
        system: videoPromptGeneration,
        messages: [
          {
            role: "assistant",
            content: `${visualManual}`,
          },
          {
            role: "user",
            content: content,
          },
        ],
      });
      await u.db("o_videoTrack").where({ id: trackId }).update({
        prompt: text,
      });
      res.status(200).send(success(text));
    } catch (e) {
      res.status(400).send(error(u.error(e).message));
    }
  },
);

import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import fs from "fs/promises";
import path from "path";
const router = express.Router();

const isSeedance2Model = (modelName: string | undefined) => {
  const normalized = String(modelName || "").toLowerCase();
  return /seedance|jimeng|即梦/.test(normalized) && /2(?:[.\-_]?0)?/.test(normalized);
};

const isReferenceMode = (mode: string | undefined) => {
  if (!mode) return false;
  if (mode.includes("Reference:")) return true;
  if (mode.startsWith("[") && mode.endsWith("]")) {
    try {
      const parsed = JSON.parse(mode);
      return Array.isArray(parsed) && parsed.some((item) => typeof item === "string" && item.includes("Reference:"));
    } catch {
      return false;
    }
  }
  return false;
};

const isQwen36SingleImageModel = (vendorId: string | undefined, modelName: string | undefined, mode: string | undefined) =>
  vendorId === "qwen2api" && modelName === "qwen3.6-plus" && mode === "singleImage";

export default router.post(
  "/",
  validateFields({
    trackId: z.number(),
    projectId: z.number(),
    info: z.array(
      z.object({
        id: z.number(),
        sources: z.string(),
      }),
    ),
    model: z.string(),
    mode: z.string(),
  }),
  async (req, res) => {
    const { trackId, projectId, info, model, mode } = req.body;

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
    const assetsNotAudioIds = assets.filter((i) => i.type == "audio").map((i) => i.id);

    const assets2Audio = await u
      .db("o_assets")
      .whereIn("o_assets.id", assetsNotAudioIds)
      .join("o_assetsRole2Audio", "o_assetsRole2Audio.assetsAudioId", "o_assets.assetsId")
      .select("o_assets.assetsId", "o_assets.id", "o_assetsRole2Audio.assetsAudioId", "o_assetsRole2Audio.assetsRoleId");

    const assetsAudioRecord: Record<number, number> = {};
    assets2Audio.forEach((i) => {
      assetsAudioRecord[i.assetsRoleId!] = i.id!;
    });

    const [id, modelData] = model.split(/:(.+)/);
    const seedance2Model = isSeedance2Model(modelData);
    const projectData = await u.db("o_project").select("*").where({ id: projectId }).first();
    const videoPrompt = await u.db("o_prompt").where("type", "videoPromptGeneration").first();
    let videoPromptGeneration = "" as string | undefined;

    const modelPromptData = await u.db("o_modelPrompt").where("vendorId", id).where("model", modelData).first();
    //查询到 有绑定对应视频提示词
    if (modelPromptData) {
      const modelPromptRoot = u.getPath(["modelPrompt"]);
      try {
        const fullPath = path.join(modelPromptRoot, modelPromptData?.path!);
        const content = await fs.readFile(fullPath, "utf-8");
        videoPromptGeneration = content ?? "";
      } catch {}
    }

    // 未查询到绑定，根据模型名称 + mode 自动匹配 modelPrompt/video/ 下的文件
    if (!videoPromptGeneration) {
      const modelPromptRoot = u.getPath(["modelPrompt"]);
      const videoPromptDir = path.join(modelPromptRoot, "video");
      const modelLower = (modelData ?? "").toLowerCase();

      let fileName: string | null = null;

      if (modelLower.includes("wan") && modelLower.includes("2.6")) {
        // wan2.6 系列 => 单图首尾帧模式
        fileName = "wan2.6Single-imageFirstFrameMode.md";
      } else if (isQwen36SingleImageModel(id, modelData, mode)) {
        // Qwen2API qwen3.6-plus 单图生视频 => 走首帧/单图视频提示词模板，避免回退到旧英文五段式模板
        fileName = "universalFirstAndLastFrameMode.md";
      } else if (seedance2Model && isReferenceMode(mode)) {
        // seedance 2.0 / 2-0 多参考模式才使用 @参考N 模板
        fileName = "seedance2Multi-parameterMode.md";
      } else if (mode === "startEndRequired" || mode === "endFrameOptional" || mode === "startFrameOptional") {
        // body.mode 为首尾帧相关 => 通用首尾帧模式
        fileName = "universalFirstAndLastFrameMode.md";
      } else if (typeof mode === "string" && mode.startsWith('["') && mode.endsWith('"]')) {
        // 其他 => 通用多参模式
        fileName = "universalMulti-parameterMode.md";
      }
      if (fileName) {
        try {
          const fullPath = path.join(videoPromptDir, fileName);
          videoPromptGeneration = await fs.readFile(fullPath, "utf-8");
        } catch {
          // 文件不存在则忽略，继续用备选
        }
      }
    }

    //备选
    if (!videoPromptGeneration) {
      if (videoPrompt && videoPrompt.useData) {
        videoPromptGeneration = videoPrompt.useData;
      } else {
        videoPromptGeneration = videoPrompt?.data ?? undefined;
      }
    }

    const artStyle = projectData?.artStyle || "无";
    const languageRule = seedance2Model
      ? "\n\n【强制语言规则】当前模型是 Seedance 2.0。最终输出必须是中文视频提示词；不要输出英文的 [Visual]/[Motion]/[Camera]/[Audio]/[Narrative] 结构；可使用中文段落或中文结构化标题；台词必须保持原文，不翻译。"
      : "\n\n【默认语言规则】最终输出默认使用中文视频提示词；台词必须保持原文，不翻译；只有模型专用术语或引用标记可保留英文。";
    const identityRule = `\n\n【强制角色身份规则】资产信息已提供 describe/prompt 时，必须用资产描述提取角色身份锚点。多角色镜头不要只写角色名，必须写清每个主要角色的外观锚点、服装/体型、固定站位、道具职责和说话状态。若同镜出现两个及以上角色，提示词中必须加入“身份不可互换”约束，明确主要角色不得交换体型、服装、位置、道具或动作；群像/杂役只作为背景围观，不得替代主要角色。动作段提到角色时，尽量使用“短身份锚点 + 角色名”，例如“宽脸壮实的王师兄”“高瘦手持生死状的周师兄”。`;

    const visualManual = u.getArtPrompt(artStyle, "art_skills", "art_storyboard_video");
    const content = `
          **模型名称**：${modelData},

          **资产信息**（角色、场景、道具、音频):${assets
            .map((i) => {
              const describe = i.describe ? `, describe:${String(i.describe).replace(/\]/g, "）")}` : "";
              const prompt = i.prompt ? `, prompt:${String(i.prompt).replace(/\]/g, "）")}` : "";
              const audio = assetsAudioRecord[i.id] ? `, audio:${assetsAudioRecord[i.id]}` : "";
              return `[${i.id},${i.type},${i.name}${describe}${prompt}${audio}]`;
            })
            .join("，")},
          **分镜信息**：${storyboard.map(
            (i) => `<storyboardItem
  videoDesc='${i.videoDesc}'
  duration='${i.duration}'
></storyboardItem>`,
          )},
          ${languageRule}
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

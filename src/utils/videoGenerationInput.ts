import u from "@/utils";
import { ReferenceList } from "@/utils/ai";
import {
  assertReferenceTypesSupported,
  detectMediaType,
  normalizeModeForAi,
  normalizeVideoDuration,
  VideoReferenceType,
} from "@/utils/videoWorkbench";
import { normalizeSupportedDurations } from "@/utils/storyboardTrackGrouping";

interface UploadItem {
  sources?: "assets" | "storyboard";
  id?: number;
}

interface ResolvedReference {
  path: string;
  type: VideoReferenceType;
}

export function createVideoReferenceItem(type: VideoReferenceType, base64: string, url: string): ReferenceList {
  return {
    type,
    sourceType: "base64",
    base64,
    url,
  } as ReferenceList;
}

export async function buildVideoReferenceList(uploadData: UploadItem[], mode: unknown): Promise<ReferenceList[]> {
  const refs = await Promise.all(
    uploadData.map(async (item): Promise<ResolvedReference> => {
      if (item.sources === "storyboard") {
        const storyboard = await u.db("o_storyboard").where("id", item.id).select("filePath").first();
        if (!storyboard?.filePath) throw new Error(`未找到分镜素材 id=${item.id}`);
        return { path: storyboard.filePath, type: "image" };
      }

      if (item.sources === "assets") {
        const asset = await u
          .db("o_assets")
          .where("o_assets.id", item.id)
          .leftJoin("o_image", "o_assets.imageId", "o_image.id")
          .select("o_image.filePath", "o_image.type")
          .first();
        if (!asset?.filePath) throw new Error(`未找到资产素材 id=${item.id}`);
        const mediaType = detectMediaType(asset.filePath, asset.type);
        if (!mediaType) throw new Error(`无法识别资产素材类型 id=${item.id}`);
        return { path: asset.filePath, type: mediaType };
      }

      throw new Error(`不支持的素材来源 ${item.sources ?? ""}`);
    }),
  );

  assertReferenceTypesSupported(mode, refs.map((item) => item.type));

  return Promise.all(
    refs.map(async (item) =>
      createVideoReferenceItem(item.type, await u.oss.getImageBase64(item.path), await u.oss.getFileUrl(item.path)),
    ),
  );
}

export function normalizeGenerateVideoInput(mode: unknown, duration: unknown, supportedDurations?: number[]) {
  return {
    mode: normalizeModeForAi(mode),
    duration: normalizeVideoDuration(duration, supportedDurations),
  };
}

export async function getVideoSupportedDurations(modelKey: string): Promise<number[]> {
  const [vendorId, modelName] = modelKey.split(/:(.+)/);
  if (!vendorId || !modelName) return normalizeSupportedDurations(null);

  const modelList = await u.vendor.getModelList(vendorId);
  const videoModel = modelList.find((model: any) => model.modelName === modelName);
  return normalizeSupportedDurations(videoModel?.durationResolutionMap);
}

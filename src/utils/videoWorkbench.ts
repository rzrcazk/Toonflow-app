import { v4 as uuidv4 } from "uuid";

export type VideoReferenceType = "image" | "video" | "audio";
type ReferenceModeToken = `videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`;
export type VideoModeValue =
  | "singleImage"
  | "startEndRequired"
  | "endFrameOptional"
  | "startFrameOptional"
  | "text"
  | ReferenceModeToken
  | ReferenceModeToken[];
export type AiVideoModeValue = Exclude<VideoModeValue, ReferenceModeToken>;

const VIDEO_DURATION_MIN = 2;
const VIDEO_DURATION_MAX = 15;
const VIDEO_DURATION_DEFAULT = 5;

const videoMimeExt: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
};

const extensionMediaType: Record<string, VideoReferenceType> = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  bmp: "image",
  svg: "image",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  aac: "audio",
  flac: "audio",
  m4a: "audio",
  mp4: "video",
  webm: "video",
  mov: "video",
  avi: "video",
  mkv: "video",
};

function isReferenceModeToken(value: VideoModeValue): value is ReferenceModeToken {
  return typeof value === "string" && value.includes("Reference:");
}

export function normalizeVideoDuration(value: unknown, supportedDurations?: number[]): number {
  const supported = normalizeSupportedDurationList(supportedDurations);
  const num = Number(value);
  if (supported.length) {
    const fallback = supported.find((duration) => duration >= VIDEO_DURATION_DEFAULT) ?? supported[supported.length - 1];
    if (!Number.isFinite(num)) return fallback;
    return supported.find((duration) => duration >= num) ?? supported[supported.length - 1];
  }
  if (!Number.isFinite(num)) return VIDEO_DURATION_DEFAULT;
  return Math.max(VIDEO_DURATION_MIN, Math.min(VIDEO_DURATION_MAX, num));
}

function normalizeSupportedDurationList(supportedDurations?: number[]): number[] {
  if (!supportedDurations?.length) return [];
  return [...new Set(supportedDurations.map(Number).filter((value) => Number.isFinite(value) && value > 0))].sort((a, b) => a - b);
}

export function parseVideoMode(mode: unknown): VideoModeValue | VideoModeValue[] {
  if (Array.isArray(mode)) return mode as VideoModeValue[];
  if (typeof mode !== "string") return "text";
  const trimmed = mode.trim();
  if (!trimmed) return "text";
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed as VideoModeValue[];
    } catch {}
  }
  return trimmed as VideoModeValue;
}

export function normalizeModeForAi(mode: unknown): AiVideoModeValue[] {
  const parsed = parseVideoMode(mode);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const referenceTokens = items.filter(isReferenceModeToken);
  const otherModes = items.filter((item): item is AiVideoModeValue => !isReferenceModeToken(item));
  return referenceTokens.length > 0 ? [...otherModes, referenceTokens] : otherModes;
}

export function detectMediaType(filePath?: string | null, storedType?: string | null): VideoReferenceType | null {
  const normalizedType = String(storedType ?? "").toLowerCase();
  if (normalizedType === "image" || normalizedType === "audio" || normalizedType === "video") return normalizedType;
  const ext = String(filePath ?? "")
    .split("?")[0]
    .split(".")
    .pop()
    ?.toLowerCase();
  return ext ? extensionMediaType[ext] ?? null : null;
}

export function getSupportedReferenceTypes(mode: unknown): Set<VideoReferenceType> {
  const normalized = normalizeModeForAi(mode);
  const supported = new Set<VideoReferenceType>();

  for (const item of normalized) {
    if (Array.isArray(item)) {
      for (const ref of item) {
        if (ref.startsWith("imageReference:")) supported.add("image");
        if (ref.startsWith("videoReference:")) supported.add("video");
        if (ref.startsWith("audioReference:")) supported.add("audio");
      }
      continue;
    }

    if (item.startsWith("imageReference:")) supported.add("image");
    if (item.startsWith("videoReference:")) supported.add("video");
    if (item.startsWith("audioReference:")) supported.add("audio");
    if (["singleImage", "startEndRequired", "endFrameOptional", "startFrameOptional"].includes(item)) {
      supported.add("image");
    }
  }

  return supported;
}

export function assertReferenceTypesSupported(mode: unknown, types: VideoReferenceType[]) {
  const supported = getSupportedReferenceTypes(mode);
  const unsupported = [...new Set(types)].filter((type) => !supported.has(type));
  if (unsupported.length > 0) {
    throw new Error(`当前视频模型模式不支持 ${unsupported.join(", ")} 参考素材`);
  }
}

export function readVideoBase64Upload(base64Data: string): { buffer: Buffer; ext: string; mime: string } {
  const match = base64Data.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("无效的视频 base64 数据");
  const mime = match[1].toLowerCase();
  const ext = videoMimeExt[mime];
  if (!ext) throw new Error("仅支持 mp4、webm、mov、avi、mkv 视频文件");
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0) throw new Error("视频文件内容为空");
  return { buffer, ext, mime };
}

export function buildVideoUploadPath(projectId: number | string, ext: string): string {
  return `/${projectId}/video/${uuidv4()}.${ext}`;
}

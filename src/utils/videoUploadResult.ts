import { v4 as uuidv4 } from "uuid";

const videoMimeExt: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
};

export function getVideoExtFromBase64(base64Data: string): string {
  const mime = base64Data.match(/^data:([^;]+);base64,/)?.[1]?.toLowerCase() ?? "";
  return videoMimeExt[mime] ?? "mp4";
}

export function readBase64Payload(base64Data: string): string {
  const payload = base64Data.match(/^data:[^;]+;base64,([A-Za-z0-9+/=]+)$/)?.[1];
  if (!payload) throw new Error("无效的视频 base64 数据");
  return payload;
}

export function buildVideoUploadPath(projectId: number, base64Data: string): string {
  return `/${projectId}/video/${uuidv4()}.${getVideoExtFromBase64(base64Data)}`;
}

import { v4 as uuidv4 } from "uuid";

const videoMimeExt: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
};

export function readVideoBase64Upload(base64Data: string): { buffer: Buffer; ext: string; mime: string } {
  const match = base64Data.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("无效的视频 base64 数据");
  const mime = match[1].toLowerCase();
  const ext = videoMimeExt[mime];
  if (!ext) throw new Error("仅支持 mp4、webm、mov、avi、mkv 视频文件");
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length) throw new Error("视频文件内容为空");
  return { buffer, ext, mime };
}

export function buildVideoUploadPath(projectId: number | string, ext: string): string {
  return `/${projectId}/video/${uuidv4()}.${ext}`;
}

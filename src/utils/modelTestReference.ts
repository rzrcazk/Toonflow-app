import { v4 as uuidv4 } from "uuid";
import { ReferenceList } from "@/utils/ai";

type ModelTestReferenceType = "image" | "video" | "audio";

interface IncomingReference {
  type: string;
  base64: string;
}

interface OssLike {
  writeFile(path: string, data: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}

const extByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
};

function getExtFromDataUrl(dataUrl: string, fallbackType: ModelTestReferenceType) {
  const mime = dataUrl.match(/^data:([^;]+);base64,/)?.[1]?.toLowerCase();
  if (mime && extByMime[mime]) return extByMime[mime];
  if (fallbackType === "image") return "png";
  if (fallbackType === "audio") return "mp3";
  return "mp4";
}

export async function persistModelTestReferences(
  items: IncomingReference[],
  fallbackType: ModelTestReferenceType,
  oss: OssLike,
  makeId: () => string = uuidv4,
): Promise<ReferenceList[]> {
  return Promise.all(
    items.map(async (item) => {
      const ext = getExtFromDataUrl(item.base64, fallbackType);
      const filePath = `model-test/${fallbackType}/${makeId()}.${ext}`;
      await oss.writeFile(filePath, item.base64);

      return {
        type: item.type as ModelTestReferenceType,
        sourceType: "base64",
        base64: item.base64,
        url: await oss.getFileUrl(filePath),
      } as ReferenceList;
    }),
  );
}

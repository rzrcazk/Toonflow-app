import type { ReferenceList } from "@/utils/ai";

export function buildImageTestInput(prompt: string, imageBase64?: string) {
  const input: {
    prompt: string;
    referenceList?: Extract<ReferenceList, { type: "image" }>[];
    size: "1K";
    aspectRatio: "16:9";
  } = {
    prompt,
    size: "1K",
    aspectRatio: "16:9",
  };

  if (imageBase64?.trim()) {
    input.referenceList = [{ type: "image", base64: imageBase64 }];
  }

  return input;
}

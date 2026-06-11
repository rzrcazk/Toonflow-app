export const DEFAULT_IMAGE_MODEL = "openai:gpt-image-2";

export function isLegacyJimengImageModel(model?: string | null): boolean {
  const normalized = String(model ?? "").trim().toLowerCase();
  if (!normalized) return false;
  return normalized.startsWith("jimeng:") || normalized.includes("即梦");
}

export function resolveDefaultImageModel(model?: string | null): `${string}:${string}` {
  const normalized = String(model ?? "").trim();
  if (!normalized || isLegacyJimengImageModel(normalized)) return DEFAULT_IMAGE_MODEL;
  return normalized as `${string}:${string}`;
}

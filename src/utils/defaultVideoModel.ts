export const DEFAULT_VIDEO_MODEL = "jimeng:jimeng-video-seedance-2.0-fast-vip";
export const DEFAULT_VIDEO_MODE = "endFrameOptional";

export function isLegacyJimengSeedanceVipModel(model?: string | null): boolean {
  return String(model ?? "").trim().toLowerCase() === "jimeng:jimeng-video-seedance-2.0-vip";
}

export function resolveDefaultVideoModel(model?: string | null): `${string}:${string}` {
  const normalized = String(model ?? "").trim();
  if (!normalized) return DEFAULT_VIDEO_MODEL;
  return normalized as `${string}:${string}`;
}

export function resolveDefaultVideoMode(mode?: string | null): string {
  const normalized = String(mode ?? "").trim();
  return normalized || DEFAULT_VIDEO_MODE;
}

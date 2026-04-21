// 艺术风格映射
const artStyleMap: Record<string, string> = {
  "3D_anime_render": "3D 动画渲染",
  "3D_chinese_traditional": "3D 国风传统",
  "3D_clay_stopmotion": "3D 黏土定格动画",
  "2D_90s_japanese_anime": "2D 日式 90 年代动画",
  "2D_chinese_guofeng": "2D 中国国风",
  "2D_flat_design": "2D 扁平设计",
  "2D_mature_urban_romance": "2D 成熟都市浪漫",
  "realpeople_ancient_chinese": "真人古风",
  "realpeople_urban_modern": "真人都市现代",
};

/**
 * 格式化时间戳
 * @param timestamp - 时间戳（支持秒级或毫秒级）
 * @returns 格式化后的时间字符串
 */
export function formatTime(timestamp: number | bigint | string | null | undefined): string {
  if (!timestamp) return "";
  const ms = BigInt(timestamp);
  // 判断是秒级还是毫秒级时间戳
  const isMsTimestamp = ms > 100000000000n; // 大于 1000 亿 说明是毫秒级
  const date = new Date(isMsTimestamp ? Number(ms) : Number(ms) * 1000);
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

/**
 * 获取艺术风格中文名称
 * @param artStyle - 艺术风格英文标识
 * @returns 中文风格名称，如果没有映射则返回原值
 */
export function getArtStyleName(artStyle: string | null | undefined): string {
  if (!artStyle) return "无";
  return artStyleMap[artStyle] || artStyle;
}

/**
 * 格式化项目数据
 * @param item - 项目原始数据
 * @returns 格式化后的项目数据
 */
export function formatProjectData<T extends { createTime?: unknown; artStyle?: unknown }>(item: T): Omit<T, "createTime" | "artStyle"> & { createTime: string; artStyle: string } {
  return {
    ...item,
    createTime: formatTime(item.createTime),
    artStyle: getArtStyleName(item.artStyle as string),
  } as Omit<T, "createTime" | "artStyle"> & { createTime: string; artStyle: string };
}

/**
 * 批量格式化项目列表
 * @param list - 项目原始列表
 * @returns 格式化后的项目列表
 */
export function formatProjectList<T extends { createTime?: unknown; artStyle?: unknown }>(list: T[]): (Omit<T, "createTime" | "artStyle"> & { createTime: string; artStyle: string })[] {
  return list.map((item) => formatProjectData(item));
}

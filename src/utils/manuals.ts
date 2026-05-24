import fs from "fs";
import path from "path";

export type ManualField = {
  label: string;
  value: string;
  subDir?: string;
};

export const ART_MANUAL_FIELDS: ManualField[] = [
  { label: "README", value: "README" },
  { label: "前缀", value: "prefix" },
  { label: "角色", value: "art_character", subDir: "art_prompt" },
  { label: "角色衍生", value: "art_character_derivative", subDir: "art_prompt" },
  { label: "道具", value: "art_prop", subDir: "art_prompt" },
  { label: "道具衍生", value: "art_prop_derivative", subDir: "art_prompt" },
  { label: "场景", value: "art_scene", subDir: "art_prompt" },
  { label: "场景衍生", value: "art_scene_derivative", subDir: "art_prompt" },
  { label: "分镜", value: "director_storyboard", subDir: "director_skills" },
  { label: "分镜视频", value: "art_storyboard_video", subDir: "art_prompt" },
  { label: "技法-导演规划", value: "director_planning_style", subDir: "director_skills" },
  { label: "技法-分镜表设计", value: "director_storyboard_table_style", subDir: "director_skills" },
];

export const DIRECTOR_MANUAL_FIELDS: ManualField[] = [
  { label: "README", value: "README" },
  { label: "导演规划", value: "director_planning_narrative", subDir: "director_skills" },
  { label: "分镜表", value: "director_storyboard_table_narrative", subDir: "director_skills" },
];

export function validateManualDirName(name: string): string | null {
  if (!name.trim()) return "名称不能为空";
  if (name.includes("/") || name.includes("\\") || name === "." || name === ".." || /^\d+$/.test(name)) {
    return "名称不能包含路径分隔符或为纯数字";
  }
  return null;
}

export function getManualFieldPath(rootDir: string, field: ManualField): string {
  const fileName = `${field.value}.md`;
  if (!field.subDir) return path.join(rootDir, fileName);

  const preferredPath = path.join(rootDir, field.subDir, fileName);
  if (field.subDir !== "director_skills") return preferredPath;

  const legacyPath = path.join(rootDir, "driector_skills", fileName);
  return fs.existsSync(preferredPath) || !fs.existsSync(legacyPath) ? preferredPath : legacyPath;
}

export function getManualSubDir(rootDir: string, preferredName = "director_skills"): string {
  const preferredPath = path.join(rootDir, preferredName);
  if (fs.existsSync(preferredPath)) return preferredPath;

  const legacyPath = path.join(rootDir, "driector_skills");
  if (fs.existsSync(legacyPath)) return legacyPath;

  return preferredPath;
}

export function normalizeReadmeForSave(name: string, data: string): string {
  const lines = data.replace(/^\uFEFF/, "").split(/\r?\n/);
  while (lines.length && lines[0].trim() === "") lines.shift();
  if (lines.length && lines[0].replace(/^#+\s*/, "").trim() === name.trim()) {
    lines.shift();
  }
  return `${name.trim()}\n${lines.join("\n").replace(/^\n+/, "")}`;
}

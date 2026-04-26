import path from "path";
import fs from "fs";
import u from "@/utils";

export interface ScriptResult {
  full: string;
  segmented: string;
  wordCount: number;
}

export async function generateScript(animalName: string): Promise<ScriptResult> {
  const skillPath = path.join(u.getPath("skills"), "animal_skills", "script.md");
  const refPath = path.join(u.getPath("skills"), "animal_skills", "references", "02_core_reference.md");

  const skillContent = await fs.promises.readFile(skillPath, "utf-8");
  const refContent = await fs.promises.readFile(refPath, "utf-8");

  const systemPrompt = `${skillContent}\n\n## 参考资料\n\n${refContent}`;

  const result = await u.Ai.Text("animalVideoAgent:scriptAgent").invoke({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `请为动物「${animalName}」生成完整的动物科普短视频文案。\n\n要求：\n1. 总字数700-900字（含标点）\n2. 给动物起一个昵称\n3. 输出【完整版】和【分段版】两个版本\n4. 分段版中每个分镜标记格式：---[镜头X | Xs | X字]---`,
      },
    ],
  });

  const text = result.text;
  const wordCount = text.replace(/\s/g, "").length;

  const fullMatch = text.match(/【完整版】\s*([\s\S]*?)(?=【分段版】|$)/);
  const segMatch = text.match(/【分段版】\s*([\s\S]*?)$/);

  return {
    full: fullMatch ? fullMatch[1].trim() : text,
    segmented: segMatch ? segMatch[1].trim() : text,
    wordCount,
  };
}

import assert from "node:assert/strict";
import { SCRIPT_ASSET_EXTRACTION_PROMPT } from "./scriptAssetExtractionPrompt";

const requiredPhrases = [
  "穿越 + 轻喜剧 + 修仙",
  "脸型、眉眼比例、体态轮廓、服装剪影、主色调",
  "圆脸杂役",
  "宽脸横肉",
  "装腔作势、外强中干",
  "反差喜剧",
  "狼狈但不惨",
  "探头探脑",
  "剧情功能",
  "反转笑点",
];

for (const phrase of requiredPhrases) {
  assert.ok(SCRIPT_ASSET_EXTRACTION_PROMPT.includes(phrase), `missing required phrase: ${phrase}`);
}

assert.ok(!SCRIPT_ASSET_EXTRACTION_PROMPT.includes("dark cave interior"), "generic fantasy examples should not dominate the prompt");

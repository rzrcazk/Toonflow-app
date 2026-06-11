type ImagePromptHygieneOptions = {
  model?: string | null;
  assetType?: string | null;
};

type VideoPromptHygieneOptions = {
  model?: string | null;
};

const jimengRiskyReplacements: Array<[RegExp, string]> = [
  [/被抓握磨亮的?/g, "自然磨亮的"],
  [/抓握磨亮/g, "自然磨亮"],
  [/床单受压形成的深浅褶皱/g, "床单自然垂褶与压皱"],
  [/受压形成的深浅褶皱/g, "自然垂褶与压皱"],
  [/衣物滑落/g, "衣物自然搭放"],
  [/滑落在/g, "搭在"],
  [/动作痕迹/g, "生活痕迹"],
  [/人体剪影或人体轮廓/g, "人物轮廓"],
  [/人体剪影/g, "人物轮廓"],
  [/人体轮廓/g, "人物轮廓"],
];

const noisyJimengPhrases = [
  "natural lens vignette",
  "subtle chromatic aberration",
  "scene derivative design sheet",
  "scene design sheet",
];

function shouldApplyJimengHygiene(model?: string | null): boolean {
  return Boolean(model && /jimeng|即梦|seedream|seedance/i.test(model));
}

function normalizePromptSeparators(prompt: string): string {
  return prompt
    .replace(/\r\n/g, "\n")
    .replace(/[，、；;]\s*/g, ", ")
    .replace(/\n+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,+/g, ",")
    .trim();
}

function dedupeCommaSegments(prompt: string): string {
  const seen = new Set<string>();
  const segments = prompt
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  return segments
    .filter((segment) => {
      const key = segment.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
}

export function sanitizeImagePrompt(prompt: string, options: ImagePromptHygieneOptions = {}): string {
  if (!shouldApplyJimengHygiene(options.model)) return prompt;

  let next = prompt;

  for (const [pattern, replacement] of jimengRiskyReplacements) {
    next = next.replace(pattern, replacement);
  }

  for (const phrase of noisyJimengPhrases) {
    next = next.replace(new RegExp(phrase, "gi"), "");
  }

  next = next
    .replace(/\bno people\b\s*,?\s*\bno characters\b\s*,?\s*\bno human figures\b/gi, "空置场景，无人物")
    .replace(/\bno characters\b\s*,?\s*/gi, "")
    .replace(/\bno human figures\b\s*,?\s*/gi, "")
    .replace(/\bno people\b/gi, "无人物")
    .replace(/严禁出现任何人物、人影、人物轮廓/g, "空置场景，无人物")
    .replace(/不出现任何人物、人影、人物剪影或人物轮廓/g, "空置场景，无人物")
    .replace(/不出现任何人物、人影、人物轮廓/g, "空置场景，无人物")
    .replace(/画面中无任何人物/g, "空置场景，无人物")
    .replace(/图中不要有任何文字/g, "无文字、水印")
    .replace(/PBR材质\s*\+\s*高精度建模/g, "PBR材质，高精度建模");

  if (options.assetType === "scene") {
    next = next.replace(/空置场景，无人物(?:\s*,\s*空置场景，无人物)+/g, "空置场景，无人物");
  }

  return dedupeCommaSegments(normalizePromptSeparators(next))
    .replace(/无文字,\s*水印/g, "无文字无水印")
    .replace(/无人物轮廓/g, "无人物")
    .replace(/但无人物/g, "，无人物");
}

const videoRiskyReplacements: Array<[RegExp, string]> = [
  [/生死状/g, "对决文书"],
  [/生死文书/g, "对决文书"],
  [/生死台/g, "对决台"],
  [/染血白衣/g, "红痕白衣"],
  [/血衣/g, "红痕白衣"],
  [/追缉印/g, "青云暗记"],
  [/追缉/g, "标记"],
  [/执法堂/g, "宗门巡查人员"],
  [/打死/g, "打败"],
  [/死得更快/g, "更快露出破绽"],
  [/跑了，死更快/g, "跑了，更危险"],
  [/跑了, 死更快/g, "跑了，更危险"],
  [/你横竖都死/g, "你逃不过这场对决"],
  [/可不跑会死/g, "可不跑会出事"],
  [/不跑会死/g, "不跑会出事"],
  [/会死/g, "会出事"],
  [/必死/g, "难以脱身"],
  [/死局/g, "困局"],
  [/死状/g, "对决文书"],
  [/死/g, "危险"],
  [/胸口伤口/g, "胸口衣襟"],
  [/伤口/g, "衣襟红痕"],
  [/重伤/g, "虚弱状态"],
  [/伤重/g, "虚弱状态"],
  [/微伤/g, "狼狈状态"],
  [/受伤/g, "狼狈"],
  [/伤势/g, "状态"],
  [/牵动胸口/g, "动作一顿"],
  [/伤/g, "状态"],
  [/血唇/g, "泛白嘴唇"],
  [/沾血/g, "带朱红痕迹"],
  [/渗血/g, "露出朱红痕迹"],
  [/血/g, "朱红痕迹"],
  [/踹开/g, "撞开"],
  [/踹中/g, "逼退"],
  [/踹倒/g, "逼退"],
  [/踹人/g, "强势逼退"],
  [/被踹/g, "被逼退"],
  [/抬脚踹/g, "迈步逼退"],
  [/踹/g, "逼退"],
  [/施暴者/g, "强势阻拦者"],
  [/威胁/g, "施压"],
  [/阴谋/g, "设局"],
  [/陷阱/g, "设局"],
  [/诱逃/g, "诱导离开"],
  [/逼迫/g, "施压"],
  [/逼签/g, "催签"],
  [/逼人/g, "催人"],
];

export function sanitizeVideoPrompt(prompt: string, options: VideoPromptHygieneOptions = {}): string {
  if (!shouldApplyJimengHygiene(options.model)) return prompt;

  let next = prompt;
  for (const [pattern, replacement] of videoRiskyReplacements) {
    next = next.replace(pattern, replacement);
  }

  return next
    .replace(/少量朱红痕迹式/g, "少量朱红印泥式")
    .replace(/朱红痕迹痕迹/g, "朱红痕迹")
    .replace(/状态状态/g, "状态")
    .replace(/危险危险/g, "危险")
    .replace(/对决文书文书/g, "对决文书");
}

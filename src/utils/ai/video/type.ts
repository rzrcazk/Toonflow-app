interface VideoConfig {
  duration: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  resolution: "480p" | "720p" | "1080p" | "2K" | "4K";
  aspectRatio: "16:9" | "9:16";
  prompt: string;
  savePath: string;
  imageBase64?: string[];
  audio?: boolean;
  /** 分镜人物对话（格式如「角色名：台词」），供支持按角色音色的厂商使用 */
  dialogue?: string;
  /** 角色名 -> 音色ID 映射，供支持按角色音色的厂商使用 */
  characterVoiceMap?: Record<string, string>;
  /** 第三方视角叙述文本，供支持旁白/解说的厂商使用 */
  narration?: string;
}

interface AIConfig {
  model?: string;
  apiKey?: string;
  baseURL?: string;
  manufacturer?: string;
}

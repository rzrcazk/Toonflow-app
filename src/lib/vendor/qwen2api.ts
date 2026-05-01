/**
 * Toonflow AI 供应商模板 - 通义千问 (Qwen2API)
 * @version 2.0
 */

// ============================================================
// 类型定义
// ============================================================

type VideoMode =
  | "singleImage"
  | "startEndRequired"
  | "endFrameOptional"
  | "startFrameOptional"
  | "text"
  | (`videoReference:${number}` | `imageReference:${number}` | `audioReference:${number}`)[];

interface TextModel {
  name: string;
  modelName: string;
  type: "text";
  think: boolean;
}

interface ImageModel {
  name: string;
  modelName: string;
  type: "image";
  mode: ("text" | "singleImage" | "multiReference")[];
  associationSkills?: string;
}

interface VideoModel {
  name: string;
  modelName: string;
  type: "video";
  mode: VideoMode[];
  associationSkills?: string;
  audio: "optional" | false | true;
  durationResolutionMap: { duration: number[]; resolution: string[] }[];
}

interface TTSModel {
  name: string;
  modelName: string;
  type: "tts";
  voices: { title: string; voice: string }[];
}

interface VendorConfig {
  id: string;
  version: string;
  name: string;
  author: string;
  description?: string;
  icon?: string;
  inputs: { key: string; label: string; type: "text" | "password" | "url"; required: boolean; placeholder?: string }[];
  inputValues: Record<string, string>;
  models: (TextModel | ImageModel | VideoModel | TTSModel)[];
}

type ReferenceList =
  | { type: "image"; sourceType: "base64"; base64: string }
  | { type: "audio"; sourceType: "base64"; base64: string }
  | { type: "video"; sourceType: "base64"; base64: string };

interface ImageConfig {
  prompt: string;
  referenceList?: Extract<ReferenceList, { type: "image" }>[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

interface VideoConfig {
  duration: number;
  resolution: string;
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:3" | "3:4";
  prompt: string;
  referenceList?: ReferenceList[];
  audio?: boolean;
  mode: VideoMode[];
}

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
  referenceList?: Extract<ReferenceList, { type: "audio" }>[];
}

interface PollResult {
  completed: boolean;
  data?: string;
  error?: string;
}

// ============================================================
// 全局声明
// ============================================================

declare const axios: any;
declare const logger: (msg: string) => void;
declare const jsonwebtoken: any;
declare const zipImage: (base64: string, size: number) => Promise<string>;
declare const zipImageResolution: (base64: string, w: number, h: number) => Promise<string>;
declare const mergeImages: (base64Arr: string[], maxSize?: string) => Promise<string>;
declare const urlToBase64: (url: string) => Promise<string>;
declare const pollTask: (fn: () => Promise<PollResult>, interval?: number, timeout?: number) => Promise<PollResult>;
declare const createOpenAI: any;
declare const createDeepSeek: any;
declare const createZhipu: any;
declare const createQwen: any;
declare const createAnthropic: any;
declare const createOpenAICompatible: any;
declare const createXai: any;
declare const createMinimax: any;
declare const createGoogleGenerativeAI: any;
declare const exports: {
  vendor: VendorConfig;
  textRequest: (m: TextModel, t: boolean, tl: 0 | 1 | 2 | 3) => any;
  imageRequest: (c: ImageConfig, m: ImageModel) => Promise<string>;
  videoRequest: (c: VideoConfig, m: VideoModel) => Promise<string>;
  ttsRequest: (c: TTSConfig, m: TTSModel) => Promise<string>;
  checkForUpdates?: () => Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }>;
  updateVendor?: () => Promise<string>;
};

// ============================================================
// 供应商配置
// ============================================================

const vendor: VendorConfig = {
  id: "qwen2api",
  version: "2.0",
  author: "Toonflow",
  name: "通义千问 (Qwen2API)",
  description: "通义千问 AI 平台适配，支持 qwen3.6-plus 图片生成和视频生成（文生视频、图生视频）能力\n\n需要自行部署 [Qwen2API](https://github.com/Rfym21/Qwen2API) 代理服务，并填入该服务配置的 API Key（如 sk-xxxxxxxx），而非 [chat.qwen.ai](http://chat.qwen.ai) 的 SessionID",
  inputs: [
    { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "请输入 Qwen2API 服务的 API Key (如 sk-xxxxxxxx)" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：http://qwen2api:7860" },
  ],
  inputValues: { apiKey: "sk-35b522b4373daf053493e281c5f2e9c61e97b1b9678cb5dd", baseUrl: "http://qwen2api:7860" },
  models: [
    // 图片模型
    {
      name: "qwen3.6-plus",
      modelName: "qwen3.6-plus",
      type: "image",
      mode: ["text", "singleImage"],
    },
    // 视频模型
    {
      name: "qwen3.6-plus",
      modelName: "qwen3.6-plus",
      type: "video",
      mode: ["text", "singleImage"],
      audio: false,
      durationResolutionMap: [
        { duration: [5], resolution: ["720p"] },
      ],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getBaseUrl = (): string => {
  return vendor.inputValues.baseUrl.replace(/\/$/, "");
};

const getHeaders = (): Record<string, string> => {
  const apiKey = vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");
  const token = vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
  const baseUrl = getBaseUrl();
  return createOpenAI({ baseURL: `${baseUrl}/v1`, apiKey: token }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");

  const baseUrl = getBaseUrl();
  const headers = getHeaders();
  const hasRefs = config.referenceList && config.referenceList.length > 0;

  logger(`开始提交 Qwen2API 图片生成任务，模型：${model.modelName}`);

  try {
    let resp: any;

    if (hasRefs) {
      // 图生图：通过聊天接口的多模态消息实现
      const messageContent = [
        { type: "text", text: config.prompt },
        ...config.referenceList!.map((ref) => ({
          type: "image_url",
          image_url: { url: ref.base64.startsWith("data:") ? ref.base64 : `data:image/png;base64,${ref.base64}` },
        })),
      ];

      resp = await axios.post(`${baseUrl}/v1/chat/completions`, {
        model: model.modelName,
        messages: [{ role: "user", content: messageContent }],
        stream: false,
      }, { headers });

      const content = resp.data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("未获取到图片生成结果");

      const imgMatch = content.match(/!\[(?:image)?\]\((https?:\/\/[^)]+)\)/) || content.match(/(https?:\/\/\S+\.(?:png|jpg|jpeg|webp))/i);
      if (!imgMatch) throw new Error(`无法从响应中提取图片 URL，响应：${content}`);

      logger(`图片生成完成，开始转换 Base64`);
      return await urlToBase64(imgMatch[1]);
    } else {
      // 文生图：使用 OpenAI 兼容的图片生成端点
      resp = await axios.post(`${baseUrl}/v1/images/generations`, {
        prompt: config.prompt,
        model: model.modelName,
        n: 1,
      }, { headers });

      const imageUrl = resp.data?.data?.[0]?.url;
      if (!imageUrl) throw new Error("未获取到图片生成结果");

      logger(`图片生成完成，开始转换 Base64`);
      return await urlToBase64(imageUrl);
    }
  } catch (error) {
    logger(`Qwen2API 图片生成失败：${error.message}`);
    throw new Error(`Qwen2API 图片生成失败：${error.message}`);
  }
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");

  const baseUrl = getBaseUrl();
  const headers = getHeaders();

  const reqBody: any = {
    prompt: config.prompt,
    model: model.modelName,
    size: config.aspectRatio,
    stream: false,
  };

  // 图生视频：添加 image_url 字段
  const imageRefs = config.referenceList?.filter((r) => r.type === "image") || [];
  let firstRef = imageRefs[0];
  if (imageRefs.length > 0) {
    // 优先使用 URL（避免 base64 data URL 超长），fallback 到 base64
    if ((firstRef as any).url) {
      reqBody.image_url = (firstRef as any).url;
    } else {
      reqBody.image_url = firstRef.base64.startsWith("data:") ? firstRef.base64 : `data:image/png;base64,${firstRef.base64}`;
    }
  }

  // ============ 完整调试日志 ============
  logger("========== [Qwen2API VideoRequest DEBUG] ==========");
  logger(`POST URL: ${baseUrl}/v1/videos`);
  logger(`HEADERS: ${JSON.stringify(headers)}`);

  // 截断 base64 避免刷屏
  const truncatedBody = JSON.stringify(reqBody, (k, v) => {
    if (k === "image_url" && typeof v === "string" && v.length > 80) {
      return v.substring(0, 4) + "...(内容太长)..." + v.slice(-5);
    }
    return v;
  }, 2);
  logger(`REQUEST BODY:\n${truncatedBody}`);

  if (firstRef) {
    logger(`firstRef.url: ${(firstRef as any).url || 'N/A (说明没收到 URL，走的是 base64 路径)'}`);
    const b64 = firstRef.base64 || "";
    if (b64.length > 50) {
      logger(`firstRef.base64: ${b64.substring(0, 4)}...(内容太长)...${b64.slice(-5)} (${b64.length} chars)`);
    } else {
      logger(`firstRef.base64: ${b64}`);
    }
  } else {
    logger(`firstRef: undefined (无参考图片)`);
  }
  logger("========================================");

  try {
    const resp = await axios.post(`${baseUrl}/v1/videos`, reqBody, { headers });
    logger(`========== [Qwen2API Response DEBUG] ==========`);
    logger(`STATUS: ${resp.status}`);
    logger(`RESPONSE DATA: ${JSON.stringify(resp.data, null, 2)}`);
    logger("========================================");

    const videoUrl = resp.data?.data?.[0]?.url;
    if (!videoUrl) throw new Error("未获取到视频生成结果");

    logger(`视频生成完成，开始转换 Base64`);
    return await urlToBase64(videoUrl);
  } catch (error) {
    logger(`Qwen2API 视频生成失败：${error.message}`);
    throw new Error(`Qwen2API 视频生成失败：${error.message}`);
  }
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: "2.0", notice: "" };
};

const updateVendor = async (): Promise<string> => {
  return "";
};

// ============================================================
// 导出
// ============================================================

exports.vendor = vendor;
exports.textRequest = textRequest;
exports.imageRequest = imageRequest;
exports.videoRequest = videoRequest;
exports.ttsRequest = ttsRequest;
exports.checkForUpdates = checkForUpdates;
exports.updateVendor = updateVendor;

// 这行代码用于确保当前文件被识别为模块，避免全局变量冲突
export { };

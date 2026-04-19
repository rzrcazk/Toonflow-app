/**
 * Toonflow AI 供应商模板 - 通义千问视频生成 (Qwen2API-Video)
 * @version 1.0
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
  aspectRatio: "16:9" | "9:16";
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
  id: "qwen2api-video",
  version: "1.1",
  author: "Toonflow",
  name: "通义千问视频生成 (Qwen2API-Video)",
  description: "通义千问 AI 平台视频生成专用适配，支持 Qwen3.6-Plus-Video 模型\n\n需要自行部署 [Qwen2API](https://github.com/Rfym21/Qwen2API) 代理服务，并填入该服务配置的 API Key（如 sk-xxxxxxxx），而非 chat.qwen.ai 的 SessionID",
  inputs: [
    { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "请输入 Qwen2API 服务的 API Key (如 sk-xxxxxxxx)" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：http://qwen2api:3000" },
  ],
  inputValues: { apiKey: "", baseUrl: "http://qwen2api:3000" },
  models: [
    // 视频模型
    {
      name: "Qwen3.6-Plus-Video",
      modelName: "Qwen3.6-Plus-video",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired"],
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

const getHeaders = () => {
  const token = vendor.inputValues.apiKey;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");
  const token = vendor.inputValues.apiKey;
  const baseUrl = vendor.inputValues.baseUrl;
  return createOpenAI({ baseURL: `${baseUrl}/cli/v1`, apiKey: token }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  throw new Error("此供应商模板仅支持视频生成，不支持图片生成");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");

  const baseUrl = vendor.inputValues.baseUrl;
  const headers = getHeaders();

  const imageRefs = config.referenceList?.filter((r) => r.type === "image") || [];
  let messageContent: any;

  if (imageRefs.length > 0) {
    const refImages = config.mode.includes("startEndRequired")
      ? imageRefs.slice(0, 2)
      : imageRefs.slice(0, 1);
    messageContent = [
      { type: "text", text: config.prompt },
      ...refImages.map((ref) => ({
        type: "image_url",
        image_url: { url: ref.base64 },
      })),
    ];
  } else {
    messageContent = config.prompt;
  }

  const reqBody = {
    model: model.modelName,
    messages: [{ role: "user", content: messageContent }],
    size: config.aspectRatio,
    stream: false,
  };

  logger(`开始提交 Qwen2API-Video 视频生成任务，模型：${model.modelName}，比例：${config.aspectRatio}`);

  try {
    const resp = await axios.post(`${baseUrl}/v1/chat/completions`, reqBody, { headers });

    const content = resp.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("未获取到视频生成结果");

    const urlMatch = content.match(/(https?:\/\/\S+\.mp4[^\s)"'\]]*)/i) || content.match(/(https?:\/\/\S+)/);
    if (!urlMatch) throw new Error(`无法从响应中提取视频 URL，响应：${content}`);

    logger(`视频生成完成，开始转换 Base64`);
    return await urlToBase64(urlMatch[1]);
  } catch (error) {
    logger(`Qwen2API-Video 视频生成失败：${error.message}`);
    throw new Error(`Qwen2API-Video 视频生成失败：${error.message}`);
  }
};

const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};

const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: "1.0", notice: "" };
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
export {};

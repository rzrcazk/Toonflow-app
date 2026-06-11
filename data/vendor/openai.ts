/**
 * Toonflow AI供应商模板
 * @version 2.2
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
  | { type: "image"; sourceType?: "base64"; base64: string; url?: string }
  | { type: "audio"; sourceType?: "base64"; base64: string; url?: string }
  | { type: "video"; sourceType?: "base64"; base64: string; url?: string }
  | { type: "image"; sourceType: "url"; url: string }
  | { type: "audio"; sourceType: "url"; url: string }
  | { type: "video"; sourceType: "url"; url: string };
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
  id: "openai",
  version: "2.2",
  author: "Toonflow",
  name: "OpenAI标准接口",
  description: "OpenAI标准格式接口，可修改请求地址并手动添加模型。",
  icon: "",
  inputs: [
    { key: "apiKey", label: "API密钥", type: "password", required: true },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "以v1结束，示例：https://api.openai.com/v1" },
  ],
  inputValues: {
    apiKey: "",
    baseUrl: "https://api.openai.com/v1",
  },
  models: [
    { name: "GPT-5.5", modelName: "gpt-5.5", type: "text", think: true },
    { name: "GPT-image-2", modelName: "gpt-image-2", type: "image", mode: ["text", "singleImage", "multiReference"] },
  ],
};
// ============================================================
// 辅助工具
// ============================================================
const getBaseUrl = () => vendor.inputValues.baseUrl.replace(/\/+$/, "");
const getHeaders = () => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少API Key");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "")}`,
  };
};
const resolveOpenAIImageSize = (config: ImageConfig): string => {
  if (config.aspectRatio === "1:1") return "1024x1024";
  const [w, h] = String(config.aspectRatio || "").split(":").map(Number);
  if (Number.isFinite(w) && Number.isFinite(h)) {
    if (w > h) return "1536x1024";
    if (h > w) return "1024x1536";
  }
  return "auto";
};
const normalizeImageUrl = (image: Extract<ReferenceList, { type: "image" }>): string => {
  const value = image.sourceType === "url" ? image.url : image.base64 || image.url || "";
  if (/^(data:image\/|https?:\/\/)/i.test(value)) return value;
  return `data:image/png;base64,${value}`;
};
const extractImageResult = async (data: any): Promise<string> => {
  if (data?.error) {
    throw new Error(`图片生成失败：${data.error.message || data.error.code || JSON.stringify(data.error)}`);
  }
  const list = Array.isArray(data?.data) ? data.data : [];
  for (const item of list) {
    if (item?.b64_json) return item.b64_json;
    if (item?.url) return await urlToBase64(item.url);
    if (item?.error) throw new Error(`图片生成失败：${item.error.message || item.error.code || JSON.stringify(item.error)}`);
  }
  throw new Error("图片生成失败：未返回有效结果");
};
const extractErrorMessage = (data: any): string => {
  return data?.error?.message || data?.message || data?.error?.code || JSON.stringify(data || {});
};
// ============================================================
// 适配器函数
// ============================================================
const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少API Key");
  const apiKey = vendor.inputValues.apiKey.replace(/^Bearer\s+/i, "");
  return createOpenAI({ baseURL: vendor.inputValues.baseUrl, apiKey }).chat(model.modelName);
};
const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  const headers = getHeaders();
  const baseUrl = getBaseUrl();
  const imageRefs = (config.referenceList || []).filter((ref) => ref.type === "image");
  const body: any = {
    model: model.modelName,
    prompt: config.prompt || "",
    size: resolveOpenAIImageSize(config),
    response_format: "b64_json",
  };

  const endpoint = imageRefs.length > 0 ? "/images/edits" : "/images/generations";
  if (imageRefs.length > 0) {
    body.images = imageRefs.map((ref) => ({ image_url: normalizeImageUrl(ref) }));
  }

  logger(`[OpenAI 图片] 请求模型: ${model.modelName}, endpoint=${endpoint}, refs=${imageRefs.length}`);
  const response = await axios.post(`${baseUrl}${endpoint}`, body, { headers, validateStatus: () => true });
  if (response.status && (response.status < 200 || response.status >= 300)) {
    throw new Error(`图片生成请求失败，状态码: ${response.status}，错误信息: ${extractErrorMessage(response.data)}`);
  }
  return await extractImageResult(response.data);
};
const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  return "";
};
const ttsRequest = async (config: TTSConfig, model: TTSModel): Promise<string> => {
  return "";
};
const checkForUpdates = async (): Promise<{ hasUpdate: boolean; latestVersion: string; notice: string }> => {
  return { hasUpdate: false, latestVersion: "2.2", notice: "" };
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
export {};

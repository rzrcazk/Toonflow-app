/**
 * Toonflow AI 供应商模板 - 阿里云编程计划 (Aliyun Coding Plan)
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

interface ImageConfig {
  prompt: string;
  referenceList?: Extract<{ type: "image"; sourceType: "base64"; base64: string }, { type: "image" }>[];
  size: "1K" | "2K" | "4K";
  aspectRatio: `${number}:${number}`;
}

interface VideoConfig {
  duration: number;
  resolution: string;
  aspectRatio: "16:9" | "9:16";
  prompt: string;
  referenceList?: { type: "image" | "audio" | "video"; sourceType: "base64"; base64: string }[];
  audio?: boolean;
  mode: VideoMode[];
}

interface TTSConfig {
  text: string;
  voice: string;
  speechRate: number;
  pitchRate: number;
  volume: number;
  referenceList?: Extract<{ type: "audio"; sourceType: "base64"; base64: string }, { type: "audio" }>[];
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
declare const pollTask: (fn: () => Promise<{ completed: boolean; data?: string; error?: string }>, interval?: number, timeout?: number) => Promise<{ completed: boolean; data?: string; error?: string }>;
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
  id: "aliyun-coding-plan",
  version: "1.0",
  author: "Toonflow",
  name: "阿里云编程计划 (Aliyun Coding Plan)",
  description: "阿里云 DashScope 编程计划适配，支持 Kimi K2.5、Qwen3.6-Plus、GLM-5 等大语言模型\n\n接口与 OpenAI 完全兼容，Base URL: https://coding.dashscope.aliyuncs.com/v1",
  inputs: [
    { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "请输入 DashScope API Key (如 sk-sp-xxxxxxxx)" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：https://coding.dashscope.aliyuncs.com" },
  ],
  inputValues: { apiKey: "sk-sp-ddd8f32f19034efca9e94c7b7d3e54a5", baseUrl: "https://coding.dashscope.aliyuncs.com" },
  models: [
    {
      name: "Kimi K2.5",
      modelName: "kimi-k2.5",
      type: "text",
      think: false,
    },
    {
      name: "Qwen3.6-Plus",
      modelName: "qwen3.6-plus",
      type: "text",
      think: false,
    },
    {
      name: "GLM-5",
      modelName: "glm-5",
      type: "text",
      think: false,
    },
  ],
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.apiKey) throw new Error("缺少 API Key");
  const token = vendor.inputValues.apiKey;
  const baseUrl = vendor.inputValues.baseUrl;
  return createOpenAICompatible({ baseURL: `${baseUrl}/v1`, apiKey: token }).chat(model.modelName);
};

const imageRequest = async (_config: ImageConfig, _model: ImageModel): Promise<string> => {
  throw new Error("阿里云编程计划不支持图像生成");
};

const videoRequest = async (_config: VideoConfig, _model: VideoModel): Promise<string> => {
  throw new Error("阿里云编程计划不支持视频生成");
};

const ttsRequest = async (_config: TTSConfig, _model: TTSModel): Promise<string> => {
  throw new Error("阿里云编程计划不支持语音合成");
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
export { };

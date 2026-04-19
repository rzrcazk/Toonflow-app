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
  aspectRatios?: string[]; // 支持的宽高比选项，如 ["16:9", "9:16"]
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
  aspectRatio: string; // 动态值，如 "16:9" 或 "9:16"
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

// ============================================================
// 全局声明
// ============================================================

declare const axios: any;
declare const logger: (msg: string) => void;
declare const urlToBase64: (url: string) => Promise<string>;
declare const createOpenAI: any;
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
  version: "1.0",
  author: "Toonflow",
  name: "通义千问视频生成 (Qwen2API-Video)",
  description: "通义千问 AI 平台视频生成专用适配，支持 Qwen3.6-Plus-Video 模型\n\n需要在 [Qwen2API](https://chat.qwen.ai) 获取 SessionID 或 API Key",
  inputs: [
    { key: "token", label: "SessionID/Token", type: "password", required: true, placeholder: "请输入 Qwen2API 的 SessionID 或 Token" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：http://qwen2api:3000" },
  ],
  inputValues: { token: "", baseUrl: "http://qwen2api:3000" },
  models: [
    // 视频模型
    {
      name: "Qwen3.6-Plus-Video",
      modelName: "qwen3.6-plus-video",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired"],
      audio: false,
      aspectRatios: ["16:9", "9:16"],
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
  const token = vendor.inputValues.token;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (_model: TextModel, _think: boolean, _thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.token) throw new Error("缺少 SessionID/Token");
  const token = vendor.inputValues.token;
  const baseUrl = vendor.inputValues.baseUrl;
  return createOpenAI({ baseURL: `${baseUrl}/v1`, apiKey: token }).chat(_model.modelName);
};

const imageRequest = async (_config: ImageConfig, _model: ImageModel): Promise<string> => {
  throw new Error("此供应商模板仅支持视频生成，不支持图片生成");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if (!vendor.inputValues.token) throw new Error("缺少 SessionID/Token");

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

  logger(`[Qwen2API-Video] 开始提交视频生成任务，模型：${model.modelName}，宽高比：${config.aspectRatio}`);
  logger(`[Qwen2API-Video] 请求 URL: ${baseUrl}/v1/chat/completions`);
  logger(`[Qwen2API-Video] 请求 Body: ${JSON.stringify(reqBody, null, 2)}`);

  try {
    const resp = await axios.post(`${baseUrl}/v1/chat/completions`, reqBody, { headers });

    logger(`[Qwen2API-Video] 响应状态码：${resp.status}`);
    logger(`[Qwen2API-Video] 响应数据：${JSON.stringify(resp.data, null, 2)}`);

    const content = resp.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("未获取到视频生成结果");

    logger(`[Qwen2API-Video] 响应 content: ${content}`);

    const urlMatch = content.match(/(https?:\/\/\S+\.mp4[^\s)"'\]]*)/i) || content.match(/(https?:\/\/\S+)/);
    if (!urlMatch) throw new Error(`无法从响应中提取视频 URL，响应：${content}`);

    logger(`[Qwen2API-Video] 提取到视频 URL: ${urlMatch[1]}`);
    logger(`[Qwen2API-Video] 视频生成完成，开始转换 Base64`);
    return await urlToBase64(urlMatch[1]);
  } catch (error: any) {
    logger(`[Qwen2API-Video] 错误：${error.message}`);
    if (error.response) {
      logger(`[Qwen2API-Video] 响应状态：${error.response.status}`);
      logger(`[Qwen2API-Video] 响应数据：${JSON.stringify(error.response.data, null, 2)}`);
    }
    throw new Error(`Qwen2API-Video 视频生成失败：${error.message}`);
  }
};

const ttsRequest = async (_config: TTSConfig, _model: TTSModel): Promise<string> => {
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

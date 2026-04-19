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
  size?: "720p" | "1080p"; // 视频分辨率选项
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
      size: "720p",
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
  const baseUrl = vendor.inputValues.baseUrl;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
    "Accept": "application/json",
    "sec-ch-ua": '"Microsoft Edge";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    "source": "web",
    "Origin": baseUrl,
    "Referer": `${baseUrl}/c/guest`,
    "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  };
};

/**
 * 生成随机 ChatID
 */
const generateChatID = (): string => {
  return "chat_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * 从 Base64 提取纯数据（去掉 data: 前缀）
 */
const extractPureBase64 = (base64: string): string => {
  return base64.replace(/^data:[^;]+;base64,/, "");
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  if (!vendor.inputValues.token) throw new Error("缺少 SessionID/Token");
  const token = vendor.inputValues.token;
  const baseUrl = vendor.inputValues.baseUrl;
  return createOpenAI({ baseURL: `${baseUrl}/api/v1`, apiKey: token }).chat(model.modelName);
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  throw new Error("此供应商模板仅支持视频生成，不支持图片生成");
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if (!vendor.inputValues.token) throw new Error("缺少 SessionID/Token");

  const baseUrl = vendor.inputValues.baseUrl;
  const headers = getHeaders();
  const chatID = generateChatID();

  // ============ 调试日志：打印请求配置 ============
  logger(`[Qwen2API-Video DEBUG] ============ 开始视频生成请求 ============`);
  logger(`[Qwen2API-Video DEBUG] 模型：${model.modelName}`);
  logger(`[Qwen2API-Video DEBUG] Prompt: ${config.prompt}`);
  logger(`[Qwen2API-Video DEBUG] 时长：${config.duration}s`);
  logger(`[Qwen2API-Video DEBUG] 分辨率：${config.resolution}`);
  logger(`[Qwen2API-Video DEBUG] 宽高比：${config.aspectRatio}`);
  logger(`[Qwen2API-Video DEBUG] Mode: ${JSON.stringify(config.mode)}`);
  logger(`[Qwen2API-Video DEBUG] referenceList 长度：${config.referenceList?.length || 0}`);
  logger(`[Qwen2API-Video DEBUG] baseUrl: ${baseUrl}`);
  logger(`[Qwen2API-Video DEBUG] chatID: ${chatID}`);

  // 构造请求体
  const reqBody: any = {
    stream: false,
    version: "2.1",
    incremental_output: true,
    chat_id: chatID,
    model: model.modelName,
    messages: [
      {
        role: "user",
        content: config.prompt,
        files: [],
        chat_type: "t2v",
        feature_config: {
          output_schema: "phase",
        },
      },
    ],
    size: config.aspectRatio,
  };

  // 处理参考资源
  const imageRefs = config.referenceList?.filter((r) => r.type === "image") || [];
  logger(`[Qwen2API-Video DEBUG] imageRefs 数量：${imageRefs.length}`);
  if (imageRefs.length > 0) {
    if (config.mode.includes("singleImage") && imageRefs.length >= 1) {
      logger(`[Qwen2API-Video DEBUG] 添加单图参考，base64 长度：${imageRefs[0].base64.length}`);
      reqBody.messages[0].files.push({
        type: "image",
        url: imageRefs[0].base64,
      });
    } else if (config.mode.includes("startEndRequired") && imageRefs.length >= 2) {
      logger(`[Qwen2API-Video DEBUG] 添加首尾帧参考，base64 长度：${imageRefs[0].base64.length}, ${imageRefs[1].base64.length}`);
      reqBody.messages[0].files.push(
        { type: "image", url: imageRefs[0].base64 },
        { type: "image", url: imageRefs[1].base64 }
      );
    }
  }

  logger(`[Qwen2API-Video DEBUG] ============ 请求 URL ============`);
  logger(`[Qwen2API-Video DEBUG] POST ${baseUrl}/api/v2/chat/completions?chat_id=${chatID}`);
  logger(`[Qwen2API-Video DEBUG] ============ 请求 Headers ============`);
  logger(`[Qwen2API-Video DEBUG] ${JSON.stringify(headers, null, 2)}`);
  logger(`[Qwen2API-Video DEBUG] ============ 请求 Body ============`);
  logger(`[Qwen2API-Video DEBUG] ${JSON.stringify(reqBody, null, 2)}`);

  try {
    const submitResp = await axios.post(`${baseUrl}/api/v2/chat/completions?chat_id=${chatID}`, reqBody, { headers });

    logger(`[Qwen2API-Video DEBUG] ============ 响应状态码：${submitResp.status} ============`);
    logger(`[Qwen2API-Video DEBUG] ============ 响应数据 ============`);
    logger(`[Qwen2API-Video DEBUG] ${JSON.stringify(submitResp.data, null, 2)}`);

    if (submitResp.data?.data?.code) {
      throw new Error(`任务提交失败：${submitResp.data.data.details || submitResp.data.data.code}`);
    }

    // 提取视频任务 ID 或直接的视频 URL
    const content = submitResp.data?.choices?.[0]?.message?.content;
    logger(`[Qwen2API-Video DEBUG] 响应 content: ${content}`);
    if (!content) {
      throw new Error("未获取到视频生成结果");
    }

    // 尝试提取 task_id
    const taskIdMatch = content.match(/"task_id"\s*:\s*"([^"]+)"/);
    let videoUrl: string | null = null;

    if (taskIdMatch) {
      const taskId = taskIdMatch[1];
      logger(`[Qwen2API-Video DEBUG] 提取到 task_id: ${taskId}`);
      logger(`[Qwen2API-Video DEBUG] 开始轮询任务状态...`);

      // 轮询视频任务状态
      const pollResult = await pollTask(
        async () => {
          const statusUrl = `${baseUrl}/api/v2/video/tasks/${taskId}`;
          logger(`[Qwen2API-Video DEBUG] 轮询 GET: ${statusUrl}`);
          const statusResp = await axios.get(statusUrl, { headers });
          const taskData = statusResp.data?.data;
          logger(`[Qwen2API-Video DEBUG] 轮询响应：${JSON.stringify(taskData, null, 2)}`);

          if (taskData?.status === "completed" || taskData?.status === "success") {
            videoUrl = taskData?.video_url || taskData?.content?.video_url;
            logger(`[Qwen2API-Video DEBUG] 任务完成，video_url: ${videoUrl}`);
            return { completed: true, data: videoUrl };
          }

          if (taskData?.status === "failed") {
            logger(`[Qwen2API-Video DEBUG] 任务失败：${JSON.stringify(taskData, null, 2)}`);
            return { completed: true, error: taskData?.error || "视频生成失败" };
          }

          logger(`[Qwen2API-Video DEBUG] 任务进行中，当前状态：${taskData?.status || "unknown"}`);
          return { completed: false };
        },
        5000,
        600000 // 10 分钟超时
      );

      if (pollResult.error) {
        throw new Error(pollResult.error);
      }

      videoUrl = pollResult.data;
    } else {
      logger(`[Qwen2API-Video DEBUG] 未找到 task_id，尝试直接提取视频 URL`);
      // 尝试直接提取视频 URL
      const urlMatch = content.match(/https?:\/\/[^\s"')\]]+\.mp4/);
      if (!urlMatch) {
        throw new Error("无法从响应中提取视频 URL 或任务 ID");
      }
      videoUrl = urlMatch[0];
      logger(`[Qwen2API-Video DEBUG] 提取到视频 URL: ${videoUrl}`);
    }

    logger(`[Qwen2API-Video DEBUG] 视频生成完成，开始转换 Base64`);
    return await urlToBase64(videoUrl!);
  } catch (error: any) {
    logger(`[Qwen2API-Video DEBUG] 错误：${error.message}`);
    logger(`[Qwen2API-Video DEBUG] 完整错误堆栈：${error.stack}`);
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

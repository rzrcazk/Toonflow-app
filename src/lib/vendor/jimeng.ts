/**
 * Toonflow AI 供应商模板 - 即梦 AI (Jimeng)
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
  id: "jimeng",
  version: "1.0",
  author: "Toonflow",
  name: "即梦 AI (Jimeng)",
  description: "即梦 AI 平台适配，支持 jimeng-5.0 图片生成和 jimeng-video-seedance-2.0-fast-vip 视频生成能力\n\n需要在 [即梦 AI](https://jimeng.jianying.com) 获取 SessionID",
  inputs: [
    { key: "sessionid", label: "SessionID", type: "password", required: true, placeholder: "请输入即梦 AI 的 SessionID" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：http://jimeng-api:8000" },
  ],
  inputValues: { sessionid: "", baseUrl: "http://jimeng-api:8000" },
  models: [
    // 图片模型
    {
      name: "Jimeng-5.0",
      modelName: "jimeng-5.0",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
    },
    // 视频模型
    {
      name: "Jimeng-Video-Seedance-2.0-Fast-VIP",
      modelName: "jimeng-video-seedance-2.0-fast-vip",
      type: "video",
      mode: ["text", "singleImage", "startFrameOptional"],
      audio: "optional",
      durationResolutionMap: [
        { duration: [5, 6, 7, 8, 9, 10], resolution: ["480p", "720p"] },
      ],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getHeaders = () => {
  const sessionid = vendor.inputValues.sessionid;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${sessionid}`,
  };
};

/**
 * 从 Base64 提取纯数据（去掉 data: 前缀）
 */
const extractPureBase64 = (base64: string): string => {
  return base64.replace(/^data:[^;]+;base64,/, "");
};

/**
 * 解析分辨率参数
 */
const resolveResolution = (size: string, aspectRatio: string): { width: number; height: number } => {
  const ratioMap: Record<string, { width: number; height: number }> = {
    "1:1": { width: 1024, height: 1024 },
    "16:9": { width: 1280, height: 720 },
    "9:16": { width: 720, height: 1280 },
    "4:3": { width: 1152, height: 864 },
    "3:4": { width: 864, height: 1152 },
    "3:2": { width: 1248, height: 832 },
    "2:3": { width: 832, height: 1248 },
  };

  const baseSize = ratioMap[aspectRatio] || { width: 1024, height: 1024 };
  
  // 根据 size 调整分辨率
  if (size === "2K") {
    return { width: baseSize.width * 2, height: baseSize.height * 2 };
  } else if (size === "4K") {
    return { width: baseSize.width * 4, height: baseSize.height * 4 };
  }
  
  return baseSize;
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (model: TextModel, think: boolean, thinkLevel: 0 | 1 | 2 | 3) => {
  throw new Error("即梦 AI 不支持文本模型");
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  if (!vendor.inputValues.sessionid) throw new Error("缺少 SessionID");
  
  const baseUrl = vendor.inputValues.baseUrl;
  const headers = getHeaders();
  
  // 解析分辨率
  const resolution = resolveResolution(config.size, config.aspectRatio);
  
  // 构造请求体
  const reqBody: any = {
    model: model.modelName,
    prompt: config.prompt,
    width: resolution.width,
    height: resolution.height,
    sample_strength: 0.6, // 默认采样强度
    aspect_ratio: config.aspectRatio,
  };
  
  // 处理参考图
  if (config.referenceList && config.referenceList.length > 0) {
    reqBody.image_urls = config.referenceList.map((ref) => ref.base64);
  }
  
  logger(`开始提交即梦 AI 图片生成任务，模型：${model.modelName}，分辨率：${resolution.width}x${resolution.height}`);
  
  try {
    const submitResp = await axios.post(`${baseUrl}/v1/images/generations`, reqBody, { headers });
    
    if (submitResp.data?.error) {
      throw new Error(`任务提交失败：${submitResp.data.error.message || JSON.stringify(submitResp.data)}`);
    }
    
    // 从响应中提取图片 URL 或 Base64
    const imageUrl = submitResp.data?.data?.[0]?.url || submitResp.data?.data?.[0]?.b64_json;
    if (!imageUrl) {
      throw new Error("未获取到图片生成结果");
    }
    
    // 如果是 URL，转换为 Base64；如果已经是 Base64，添加前缀
    if (imageUrl.startsWith("http")) {
      logger(`图片生成完成，开始转换 Base64`);
      return await urlToBase64(imageUrl);
    } else {
      return imageUrl.startsWith("data:") ? imageUrl : `data:image/png;base64,${imageUrl}`;
    }
  } catch (error) {
    logger(`即梦 AI 图片生成失败：${error.message}`);
    throw new Error(`即梦 AI 图片生成失败：${error.message}`);
  }
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if (!vendor.inputValues.sessionid) throw new Error("缺少 SessionID");
  
  const baseUrl = vendor.inputValues.baseUrl;
  const headers = getHeaders();
  
  // 构造请求体
  const reqBody: any = {
    model: model.modelName,
    prompt: config.prompt,
    duration: config.duration,
    resolution: config.resolution,
    aspect_ratio: config.aspectRatio,
  };
  
  // 处理参考资源
  const imageRefs = config.referenceList?.filter((r) => r.type === "image") || [];
  if (imageRefs.length > 0) {
    if (config.mode.includes("singleImage") && imageRefs.length >= 1) {
      reqBody.first_frame_url = imageRefs[0].base64;
    } else if (config.mode.includes("startFrameOptional") && imageRefs.length >= 1) {
      reqBody.first_frame_url = imageRefs[0].base64;
      if (imageRefs.length >= 2) {
        reqBody.last_frame_url = imageRefs[1].base64;
      }
    } else if (config.mode.includes("startEndRequired") && imageRefs.length >= 2) {
      reqBody.first_frame_url = imageRefs[0].base64;
      reqBody.last_frame_url = imageRefs[1].base64;
    }
  }
  
  // 音频设置
  if (model.audio === "optional") {
    reqBody.generate_audio = config.audio !== false;
  } else if (model.audio === true) {
    reqBody.generate_audio = true;
  } else {
    reqBody.generate_audio = false;
  }
  
  logger(`开始提交即梦 AI 视频生成任务，模型：${model.modelName}，时长：${config.duration}s，分辨率：${config.resolution}`);
  
  try {
    const submitResp = await axios.post(`${baseUrl}/v1/videos/generations`, reqBody, { headers });
    
    if (submitResp.data?.error) {
      throw new Error(`任务提交失败：${submitResp.data.error.message || JSON.stringify(submitResp.data)}`);
    }
    
    // 提取视频任务 ID
    const taskId = submitResp.data?.id || submitResp.data?.data?.id;
    if (!taskId) {
      throw new Error("未获取到视频任务 ID");
    }
    
    logger(`视频任务 ID：${taskId}，开始轮询结果...`);
    
    // 轮询视频任务状态
    const pollResult = await pollTask(
      async () => {
        const statusResp = await axios.get(`${baseUrl}/v1/videos/generations/${taskId}`, { headers });
        const taskData = statusResp.data?.data || statusResp.data;
        
        if (taskData?.status === "completed" || taskData?.status === "success" || taskData?.status === "succeeded") {
          const videoUrl = taskData?.video_url || taskData?.url || taskData?.video?.url;
          return { completed: true, data: videoUrl };
        }
        
        if (taskData?.status === "failed" || taskData?.status === "error") {
          return { completed: true, error: taskData?.error?.message || taskData?.failure_reason || "视频生成失败" };
        }
        
        const progress = taskData?.progress !== undefined ? `${taskData.progress}%` : "处理中";
        logger(`视频任务生成中，当前状态：${taskData?.status || "unknown"}，进度：${progress}`);
        return { completed: false };
      },
      5000,
      600000 // 10 分钟超时
    );
    
    if (pollResult.error) {
      throw new Error(pollResult.error);
    }
    
    const videoUrl = pollResult.data;
    if (!videoUrl) {
      throw new Error("视频生成完成但未获取到视频 URL");
    }
    
    logger(`视频生成完成，开始转换 Base64`);
    return await urlToBase64(videoUrl);
  } catch (error) {
    logger(`即梦 AI 视频生成失败：${error.message}`);
    throw new Error(`即梦 AI 视频生成失败：${error.message}`);
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

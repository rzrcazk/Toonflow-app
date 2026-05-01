/**
 * Toonflow AI 供应商模板 - 即梦 AI (Jimeng)
 * @version 1.0
 * @ts-nocheck
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
    { key: "testImageUrl", label: "测试图片 URL（视频测试用）", type: "url", required: false, placeholder: "可选：纯文字测试视频时自动使用此图片" },
  ],
  inputValues: { sessionid: "d0ab3b05b35ef9a0b7193d2b99df9e99", baseUrl: "http://jimeng-api:8000", testImageUrl: "" },
  models: [
    // 图片模型
    {
      name: "即梦 5.0",
      modelName: "jimeng-5.0",
      type: "image",
      mode: ["text", "singleImage", "multiReference"],
    },
    // VIP 视频模型
    {
      name: "Seedance 2.0 Fast VIP",
      modelName: "jimeng-video-seedance-2.0-fast-vip",
      type: "video",
      mode: ["text", "singleImage", "startFrameOptional"],
      audio: "optional",
      durationResolutionMap: [
        { duration: [5, 6, 7, 8, 9, 10], resolution: ["720p"] },
      ],
    },
    {
      name: "Seedance 2.0 VIP",
      modelName: "jimeng-video-seedance-2.0-vip",
      type: "video",
      mode: ["text", "singleImage", "startFrameOptional"],
      audio: "optional",
      durationResolutionMap: [
        { duration: [5, 6, 7, 8, 9, 10], resolution: ["720p", "1080p"] },
      ],
    },
  ],
};

// ============================================================
// 辅助工具
// ============================================================

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${vendor.inputValues.sessionid}`,
});

const sizeToResolution = (size: "1K" | "2K" | "4K"): string => {
  const map: Record<string, string> = { "1K": "1k", "2K": "2k", "4K": "4k" };
  return map[size] || "2k";
};

// ============================================================
// 适配器函数
// ============================================================

const textRequest = (_model: TextModel, _think: boolean, _thinkLevel: 0 | 1 | 2 | 3) => {
  throw new Error("即梦 AI 不支持文本模型");
};

const imageRequest = async (config: ImageConfig, model: ImageModel): Promise<string> => {
  if (!vendor.inputValues.sessionid) throw new Error("缺少 SessionID");

  const baseUrl = vendor.inputValues.baseUrl;
  const resolution = sizeToResolution(config.size);
  const hasRefs = config.referenceList && config.referenceList.length > 0;

  let imageUrl: string;

  if (hasRefs) {
    // 图生图：FormData 上传参考图
    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("resolution", resolution);

    for (const ref of config.referenceList!) {
      const match = ref.base64.match(/^data:([^;]+);base64,(.+)$/);
      const mimeType = match ? match[1] : "image/jpeg";
      const rawBase64 = match ? match[2] : ref.base64;
      const buffer = Buffer.from(rawBase64, "base64");
      formData.append("images", buffer, {
        filename: "reference.jpg",
        contentType: mimeType,
      } as any);
    }

    logger(`即梦图生图，模型：${model.modelName}，参考图：${config.referenceList!.length} 张`);
    const resp = await axios.post(`${baseUrl}/v1/images/generations`, formData, {
      headers: {
        Authorization: `Bearer ${vendor.inputValues.sessionid}`,
        ...(formData as any).getHeaders(),
      },
    });

    if (!resp.data?.data?.[0]?.url) throw new Error(`即梦图生图失败：${JSON.stringify(resp.data)}`);
    imageUrl = resp.data.data[0].url;
  } else {
    // 文生图：JSON
    logger(`即梦文生图，模型：${model.modelName}`);
    const resp = await axios.post(
      `${baseUrl}/v1/images/generations`,
      { model: model.modelName, prompt: config.prompt, ratio: config.aspectRatio, resolution },
      { headers: getHeaders() },
    );

    if (!resp.data?.data?.[0]?.url) throw new Error(`即梦文生图失败：${JSON.stringify(resp.data)}`);
    imageUrl = resp.data.data[0].url;
  }

  logger(`图片生成完成，转换 Base64 中...`);
  return await urlToBase64(imageUrl);
};

const videoRequest = async (config: VideoConfig, model: VideoModel): Promise<string> => {
  if (!vendor.inputValues.sessionid) throw new Error("缺少 SessionID");

  const baseUrl = vendor.inputValues.baseUrl;
  let imageRefs = (config.referenceList || []).filter((r) => r.type === "image") as Extract<ReferenceList, { type: "image" }>[];

  if (imageRefs.length === 0 && vendor.inputValues.testImageUrl) {
    logger(`即梦视频无参考图，使用测试图片 URL 补充：${vendor.inputValues.testImageUrl}`);
    const testBase64 = await urlToBase64(vendor.inputValues.testImageUrl);
    imageRefs = [{ type: "image", sourceType: "base64", base64: testBase64 }];
  }

  if (imageRefs.length === 0) {
    throw new Error("即梦 Seedance 2.0 需要至少一张参考图片，请在供应商设置中填写「测试图片 URL」或在生成时提供参考图");
  }

  const hasImages = imageRefs.length > 0;

  let taskId: string;

  if (hasImages) {
    // 有参考图：FormData 上传（Seedance VIP 必须 multipart）
    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("duration", String(config.duration));
    formData.append("resolution", config.resolution);

    for (const ref of imageRefs) {
      const match = ref.base64.match(/^data:([^;]+);base64,(.+)$/);
      const mimeType = match ? match[1] : "image/jpeg";
      const rawBase64 = match ? match[2] : ref.base64;
      const buffer = Buffer.from(rawBase64, "base64");
      formData.append("files", buffer, {
        filename: "image.jpg",
        contentType: mimeType,
      } as any);
    }

    logger(`即梦视频图生视频，模型：${model.modelName}，参考图：${imageRefs.length} 张`);
    const resp = await axios.post(`${baseUrl}/v1/videos/generations`, formData, {
      headers: {
        Authorization: `Bearer ${vendor.inputValues.sessionid}`,
        ...(formData as any).getHeaders(),
      },
    });

    // 即梦 API 可能直接返回视频 URL（同步完成），也可能返回 task_id（异步轮询）
    const directVideoUrl = resp.data?.data?.[0]?.url;
    if (directVideoUrl) {
      logger(`即梦视频同步返回 URL，转换 Base64 中...`);
      return await urlToBase64(directVideoUrl);
    }

    const id = resp.data?.task_id || resp.data?.id || resp.data?.data?.id;
    if (!id) throw new Error(`即梦视频任务提交失败：${JSON.stringify(resp.data)}`);
    taskId = id;
  } else {
    // 文生视频：JSON
    logger(`即梦文生视频，模型：${model.modelName}`);
    const resp = await axios.post(
      `${baseUrl}/v1/videos/generations`,
      { model: model.modelName, prompt: config.prompt, ratio: config.aspectRatio, resolution: config.resolution, duration: config.duration },
      { headers: getHeaders() },
    );

    // 即梦 API 可能直接返回视频 URL（同步完成），也可能返回 task_id（异步轮询）
    const directVideoUrl = resp.data?.data?.[0]?.url;
    if (directVideoUrl) {
      logger(`即梦视频同步返回 URL，转换 Base64 中...`);
      return await urlToBase64(directVideoUrl);
    }

    const id = resp.data?.task_id || resp.data?.id || resp.data?.data?.id;
    if (!id) throw new Error(`即梦视频任务提交失败：${JSON.stringify(resp.data)}`);
    taskId = id;
  }

  logger(`即梦视频任务已提交，任务ID：${taskId}，等待生成完成...`);

  const resultResp = await axios.get(`${baseUrl}/v1/videos/generations/${taskId}`, {
    headers: getHeaders(),
    timeout: 1800000,
  });

  if (resultResp.data?.status === "failed") {
    throw new Error(`即梦视频生成失败：${resultResp.data.error || "未知错误"}`);
  }

  const videoUrl = resultResp.data?.data?.[0]?.url || resultResp.data?.video_url;
  if (!videoUrl) throw new Error(`即梦视频生成完成但未获取到 URL：${JSON.stringify(resultResp.data)}`);

  logger(`视频生成完成，转换 Base64 中...`);
  return await urlToBase64(videoUrl);
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
export { };

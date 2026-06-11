/**
 * Toonflow AI 供应商模板 - 即梦 AI (Jimeng)
 * @version 1.1
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
  | { type: "image"; sourceType: "url"; url: string }
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
  version: "1.1",
  author: "Toonflow",
  name: "即梦 AI (Jimeng)",
  description: "即梦 AI 平台适配，支持 jimeng-5.0 图片生成和 jimeng-video-seedance-2.0-fast-vip 视频生成能力\n\n需要在 [即梦 AI](https://jimeng.jianying.com) 获取 SessionID",
  inputs: [
    { key: "sessionid", label: "SessionID", type: "password", required: true, placeholder: "请输入即梦 AI 的 SessionID" },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：http://jimeng-api:8000" },
    { key: "testImageUrl", label: "测试图片 URL（视频测试用）", type: "url", required: false, placeholder: "可选：纯文字测试视频时自动使用此图片" },
  ],
  inputValues: {
    sessionid: "a251d96954e96a3e1867f8993718908b",
    baseUrl: "http://127.0.0.1:5100",
    testImageUrl:
      "data:image/jpeg;base64,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",
  },
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
      mode: ["text", "singleImage", "endFrameOptional", ["imageReference:9", "videoReference:3"]],
      audio: "optional",
      durationResolutionMap: [
        { duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p"] },
      ],
    },
    {
      name: "Seedance 2.0 VIP",
      modelName: "jimeng-video-seedance-2.0-vip",
      type: "video",
      mode: ["text", "singleImage", "endFrameOptional", ["imageReference:9", "videoReference:3"]],
      audio: "optional",
      durationResolutionMap: [
        { duration: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], resolution: ["720p", "1080p"] },
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

const resolveJimengVideoModelName = (modelName: string): string => {
  const aliasMap: Record<string, string> = {
    "jimeng-video-seedance-2.0-fast-vip": "jimeng-video-seedance-2.0-fast",
    "jimeng-video-seedance-2.0-vip": "jimeng-video-seedance-2.0",
  };
  return aliasMap[modelName] || modelName;
};

const extractJimengErrorMessage = (data: any, fallback: string): string => {
  const rawMessage = data?.message || data?.error?.message || data?.error || fallback;
  const message = typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);
  const code = data?.code ?? data?.error?.code;
  const errorCodeMatch = message.match(/错误码[:：]\s*([^)）\s]+)/);
  const errorCode = errorCodeMatch?.[1] || (code !== undefined ? String(code) : "");

  if (errorCode === "4013" || /异常行为|风控|风险/.test(message)) {
    return `即梦视频提交被风控拒绝：${message}。请检查 SessionID 是否仍有效、当前 IP/账号是否触发频率限制或风控、提示词/参考图是否含敏感内容；建议更换/重新登录 SessionID，降低并发后重试。`;
  }

  return code !== undefined ? `${fallback}：${message}（code: ${code}）` : `${fallback}：${message}`;
};

const trimForLog = (value: string, maxLength = 240): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

const safeStringify = (value: any, maxLength = 2000): string => {
  try {
    return trimForLog(JSON.stringify(value), maxLength);
  } catch {
    return trimForLog(String(value), maxLength);
  }
};

const summarizePrompt = (prompt?: string) => ({
  length: prompt?.length || 0,
  preview: trimForLog((prompt || "").replace(/\s+/g, " "), 160),
});

const logJimengApiRequest = (phase: string, method: string, url: string, payload: any) => {
  logger(`[即梦API] ${phase} ${method} ${url} payload=${safeStringify(payload)}`);
};

const logJimengApiResponse = (phase: string, data: any) => {
  logger(`[即梦API] ${phase} response=${safeStringify(data)}`);
};

const logJimengApiError = (phase: string, url: string, error: any) => {
  logger(
    `[即梦API] ${phase} failed url=${url} status=${error?.response?.status || ""} message=${error?.message || ""} response=${safeStringify(error?.response?.data || "")}`,
  );
};

const resolveImageRefRole = (mode: any, index: number): string => {
  const modes = Array.isArray(mode) ? mode : [mode];
  const hasFrameMode = modes.some((item) => ["singleImage", "startFrameOptional", "startEndRequired", "endFrameOptional"].includes(item));
  if (!hasFrameMode) return `reference_image_${index + 1}`;
  if (index === 0) return "first_frame";
  if (index === 1) return "last_frame";
  return `extra_reference_image_${index + 1}`;
};

const getJimengReferenceModeTokens = (mode: any): string[] => {
  const modes = Array.isArray(mode) ? mode : [mode];
  return modes
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .filter((item) => typeof item === "string" && /^(imageReference|videoReference|audioReference):\d+$/.test(item));
};

const getJimengReferenceLimit = (tokens: string[], prefix: "imageReference" | "videoReference" | "audioReference", fallback: number): number => {
  const token = tokens.find((item) => item.startsWith(`${prefix}:`));
  const value = Number(token?.split(":")[1]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const readBase64File = async (ref: any, fallbackMimeType: string, errorMessage: string) => {
  const data = ref?.base64?.trim() || (ref?.url ? await urlToBase64(ref.url) : "");
  if (!data) throw new Error(errorMessage);

  const match = data.match(/^data:([^;]+);base64,(.+)$/);
  const mimeType = match ? match[1] : fallbackMimeType;
  const rawBase64 = match ? match[2] : data;
  return {
    mimeType,
    buffer: Buffer.from(rawBase64, "base64"),
    sourceType: ref?.sourceType || (ref?.url ? "url" : "base64"),
  };
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
  const resolution = "2k";
  const imageRefs = (config.referenceList || []).filter((ref) => {
    if (ref?.type !== "image") return false;
    return Boolean((ref as any).base64?.trim() || (ref as any).url?.trim());
  });

  const hasRefs = imageRefs.length > 0;

  let imageUrl: string;

  if (hasRefs) {
    // 图生图：FormData 上传参考图
    const formData = new FormData();
    formData.append("model", model.modelName);
    formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("resolution", resolution);

    for (const ref of imageRefs) {
      const imageBase64 = (ref as any).base64?.trim() || ((ref as any).url ? await urlToBase64((ref as any).url) : "");
      if (!imageBase64) throw new Error("即梦图生图参考图无效：缺少 base64 或 url");

      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      const mimeType = match ? match[1] : "image/jpeg";
      const rawBase64 = match ? match[2] : imageBase64;
      const buffer = Buffer.from(rawBase64, "base64");
      formData.append("images", buffer, {
        filename: "reference.jpg",
        contentType: mimeType,
      } as any);
    }

    logger(`即梦图生图，模型：${model.modelName}，参考图：${imageRefs.length} 张`);
    const resp = await axios.post(`${baseUrl}/v1/images/compositions`, formData, {
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
  const requestModelName = resolveJimengVideoModelName(model.modelName);
  const referenceTokens = getJimengReferenceModeTokens(config.mode);
  const isOmniReference = referenceTokens.length > 0;
  let imageRefs = (config.referenceList || []).filter((r) => r.type === "image") as Extract<ReferenceList, { type: "image" }>[];
  let videoRefs = (config.referenceList || []).filter((r) => r.type === "video") as Extract<ReferenceList, { type: "video" }>[];

  if (isOmniReference) {
    imageRefs = imageRefs.slice(0, getJimengReferenceLimit(referenceTokens, "imageReference", 9));
    videoRefs = videoRefs.slice(0, getJimengReferenceLimit(referenceTokens, "videoReference", 3));
  }

  if (imageRefs.length === 0 && videoRefs.length === 0 && vendor.inputValues.testImageUrl) {
    logger(`即梦视频无参考图，使用测试图片 URL 补充：${vendor.inputValues.testImageUrl}`);
    const testBase64 = await urlToBase64(vendor.inputValues.testImageUrl);
    imageRefs = [{ type: "image", sourceType: "base64", base64: testBase64 }];
  }

  if (imageRefs.length === 0 && videoRefs.length === 0) {
    throw new Error("即梦 Seedance 2.0 需要至少一个参考素材，请在供应商设置中填写「测试图片 URL」或在生成时提供参考图/参考视频");
  }

  const hasReferences = imageRefs.length > 0 || videoRefs.length > 0;

  let taskId: string;

  if (hasReferences) {
    // 有参考素材：FormData 上传（Seedance VIP 必须 multipart）
    const formData = new FormData();
    formData.append("model", requestModelName);
    formData.append("prompt", config.prompt);
    formData.append("ratio", config.aspectRatio);
    formData.append("duration", String(config.duration));
    formData.append("resolution", config.resolution);
    if (isOmniReference) formData.append("functionMode", "omni_reference");
    const imageSummaries: any[] = [];
    const videoSummaries: any[] = [];

    for (const [index, ref] of imageRefs.entries()) {
      const file = await readBase64File(ref, "image/jpeg", "即梦视频参考图无效：缺少 base64 或 url");
      const field = `image_file_${index + 1}`;
      imageSummaries.push({
        field,
        role: resolveImageRefRole(config.mode, index),
        sourceType: file.sourceType,
        mimeType: file.mimeType,
        bytes: file.buffer.length,
      });
      formData.append(field, file.buffer, {
        filename: `image_${index + 1}.jpg`,
        contentType: file.mimeType,
      } as any);
    }

    for (const [index, ref] of videoRefs.entries()) {
      const file = await readBase64File(ref, "video/mp4", "即梦视频参考视频无效：缺少 base64 或 url");
      const field = `video_file_${index + 1}`;
      videoSummaries.push({
        field,
        sourceType: file.sourceType,
        mimeType: file.mimeType,
        bytes: file.buffer.length,
      });
      formData.append(field, file.buffer, {
        filename: `video_${index + 1}.mp4`,
        contentType: file.mimeType,
      } as any);
    }

    logger(`即梦视频图生视频，模型：${model.modelName} -> ${requestModelName}，参考图：${imageRefs.length} 张，参考视频：${videoRefs.length} 个`);
    const submitUrl = `${baseUrl}/v1/videos/generations`;
    logJimengApiRequest("提交视频任务", "POST", submitUrl, {
      model: requestModelName,
      prompt: summarizePrompt(config.prompt),
      ratio: config.aspectRatio,
      duration: config.duration,
      resolution: config.resolution,
      mode: config.mode,
      functionMode: isOmniReference ? "omni_reference" : "first_last_frames",
      imageRefs: imageSummaries,
      videoRefs: videoSummaries,
    });
    let resp: any;
    try {
      resp = await axios.post(submitUrl, formData, {
        headers: {
          Authorization: `Bearer ${vendor.inputValues.sessionid}`,
          ...(formData as any).getHeaders(),
        },
      });
      logJimengApiResponse("提交视频任务", resp.data);
    } catch (error) {
      logJimengApiError("提交视频任务", submitUrl, error);
      throw error;
    }

    // 即梦 API 可能直接返回视频 URL（同步完成），也可能返回 task_id（异步轮询）
    const directVideoUrl = resp.data?.data?.[0]?.url;
    if (directVideoUrl) {
      logger(`即梦视频同步返回 URL，转换 Base64 中...`);
      return await urlToBase64(directVideoUrl);
    }

    const id = resp.data?.task_id || resp.data?.id || resp.data?.data?.id;
    if (!id) throw new Error(extractJimengErrorMessage(resp.data, "即梦视频任务提交失败"));
    taskId = id;
  } else {
    // 文生视频：JSON
    logger(`即梦文生视频，模型：${model.modelName} -> ${requestModelName}`);
    const submitUrl = `${baseUrl}/v1/videos/generations`;
    const body = { model: requestModelName, prompt: config.prompt, ratio: config.aspectRatio, resolution: config.resolution, duration: config.duration };
    logJimengApiRequest("提交视频任务", "POST", submitUrl, {
      ...body,
      prompt: summarizePrompt(config.prompt),
      mode: config.mode,
      imageRefs: [],
    });
    let resp: any;
    try {
      resp = await axios.post(submitUrl, body, { headers: getHeaders() });
      logJimengApiResponse("提交视频任务", resp.data);
    } catch (error) {
      logJimengApiError("提交视频任务", submitUrl, error);
      throw error;
    }

    // 即梦 API 可能直接返回视频 URL（同步完成），也可能返回 task_id（异步轮询）
    const directVideoUrl = resp.data?.data?.[0]?.url;
    if (directVideoUrl) {
      logger(`即梦视频同步返回 URL，转换 Base64 中...`);
      return await urlToBase64(directVideoUrl);
    }

    const id = resp.data?.task_id || resp.data?.id || resp.data?.data?.id;
    if (!id) throw new Error(extractJimengErrorMessage(resp.data, "即梦视频任务提交失败"));
    taskId = id;
  }

  logger(`即梦视频任务已提交，任务ID：${taskId}，等待生成完成...`);

  const queryUrl = `${baseUrl}/v1/videos/generations/${taskId}`;
  logJimengApiRequest("查询视频任务", "GET", queryUrl, { taskId });
  let resultResp: any;
  try {
    resultResp = await axios.get(queryUrl, {
      headers: getHeaders(),
      timeout: 1800000,
    });
    logJimengApiResponse("查询视频任务", resultResp.data);
  } catch (error) {
    logJimengApiError("查询视频任务", queryUrl, error);
    throw error;
  }

  if (resultResp.data?.status === "failed") {
    throw new Error(extractJimengErrorMessage(resultResp.data, "即梦视频生成失败"));
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
  return { hasUpdate: false, latestVersion: "1.1", notice: "" };
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

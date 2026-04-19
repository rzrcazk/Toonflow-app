/* eslint-disable */
// @ts-nocheck
/**
 * Toonflow AI 供应商模板 - 通义千问视频生成 (Qwen2API-Video)
 * 使用 /v1/chat/completions 接口
 */

const vendor = {
  id: "qwen2api-video",
  version: "1.0",
  author: "Toonflow",
  name: "通义千问视频生成 (Qwen2API-Video)",
  description: "通义千问 AI 平台视频生成专用适配",
  inputs: [
    { key: "token", label: "SessionID/Token", type: "password", required: true },
    { key: "baseUrl", label: "请求地址", type: "url", required: true, placeholder: "默认：http://qwen2api:3000" },
  ],
  inputValues: { token: "", baseUrl: "http://qwen2api:3000" },
  models: [
    {
      name: "Qwen3.6-Plus-Video",
      modelName: "qwen3.6-plus-video",
      type: "video",
      mode: ["text", "singleImage", "startEndRequired"],
      audio: false,
      durationResolutionMap: [{ duration: [5], resolution: ["720p"] }],
    },
  ],
};

const getHeaders = () => {
  const token = vendor.inputValues.token;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

const textRequest = (_model, _think, _thinkLevel) => {
  if (!vendor.inputValues.token) throw new Error("缺少 SessionID/Token");
  const token = vendor.inputValues.token;
  const baseUrl = vendor.inputValues.baseUrl;
  return createOpenAI({ baseURL: `${baseUrl}/v1`, apiKey: token }).chat(_model.modelName);
};

const imageRequest = async (_config, _model) => {
  throw new Error("此供应商模板仅支持视频生成，不支持图片生成");
};

const videoRequest = async (config, model) => {
  if (!vendor.inputValues.token) throw new Error("缺少 SessionID/Token");

  const baseUrl = vendor.inputValues.baseUrl;
  const headers = getHeaders();

  // 处理参考资源
  const imageRefs = config.referenceList?.filter((r) => r.type === "image") || [];
  let messageContent;

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

  // ============ 详细调试日志 ============
  console.log("\n========== [Qwen2API-Video] 开始视频生成请求 ==========");
  console.log("[Qwen2API-Video] 模型名称:", model.modelName);
  console.log("[Qwen2API-Video] vendor.inputValues.token:", vendor.inputValues.token ? "已设置" : "未设置");
  console.log("[Qwen2API-Video] vendor.inputValues.baseUrl:", baseUrl);
  console.log("[Qwen2API-Video] config.aspectRatio:", config.aspectRatio);
  console.log("[Qwen2API-Video] config.prompt:", config.prompt?.substring(0, 100) + "...");
  console.log("[Qwen2API-Video] config.mode:", JSON.stringify(config.mode));
  console.log("[Qwen2API-Video] config.referenceList 长度:", config.referenceList?.length || 0);
  console.log("[Qwen2API-Video] 请求 URL:", `${baseUrl}/v1/chat/completions`);
  console.log("[Qwen2API-Video] 请求 Headers:", JSON.stringify(headers, null, 2));
  console.log("[Qwen2API-Video] 请求 Body:", JSON.stringify(reqBody, null, 2));
  console.log("========== [Qwen2API-Video] 发送请求 ==========\n");

  try {
    const resp = await axios.post(`${baseUrl}/v1/chat/completions`, reqBody, { headers });

    console.log("\n========== [Qwen2API-Video] 收到响应 ==========");
    console.log("[Qwen2API-Video] 响应状态码:", resp.status);
    console.log("[Qwen2API-Video] 响应数据:", JSON.stringify(resp.data, null, 2));

    const content = resp.data?.choices?.[0]?.message?.content;
    if (!content) {
      console.log("[Qwen2API-Video] 错误：content 为空");
      throw new Error("未获取到视频生成结果");
    }

    console.log("[Qwen2API-Video] 响应 content:", content);

    const urlMatch = content.match(/(https?:\/\/\S+\.mp4[^\s)"'\]]*)/i) || content.match(/(https?:\/\/\S+)/);
    if (!urlMatch) {
      console.log("[Qwen2API-Video] 错误：无法从 content 中提取 URL");
      throw new Error(`无法从响应中提取视频 URL，响应：${content}`);
    }

    const videoUrl = urlMatch[1];
    console.log("[Qwen2API-Video] 提取到视频 URL:", videoUrl);
    console.log("[Qwen2API-Video] 开始转换 Base64...");
    console.log("========== [Qwen2API-Video] 请求完成 ==========\n");

    return await urlToBase64(videoUrl);
  } catch (error) {
    console.log("\n========== [Qwen2API-Video] 请求出错 ==========");
    console.log("[Qwen2API-Video] 错误消息:", error.message);
    if (error.response) {
      console.log("[Qwen2API-Video] 响应状态:", error.response.status);
      console.log("[Qwen2API-Video] 响应头:", JSON.stringify(error.response.headers, null, 2));
      console.log("[Qwen2API-Video] 响应数据:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("[Qwen2API-Video] 完整错误堆栈:", error.stack);
    console.log("========== [Qwen2API-Video] 结束 ==========\n");
    throw new Error(`Qwen2API-Video 视频生成失败：${error.message}`);
  }
};

const ttsRequest = async (_config, _model) => "";

const checkForUpdates = async () => ({ hasUpdate: false, latestVersion: "1.0", notice: "" });

const updateVendor = async () => "";

exports.vendor = vendor;
exports.textRequest = textRequest;
exports.imageRequest = imageRequest;
exports.videoRequest = videoRequest;
exports.ttsRequest = ttsRequest;
exports.checkForUpdates = checkForUpdates;
exports.updateVendor = updateVendor;

export {};

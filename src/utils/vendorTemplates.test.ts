import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { transform } from "sucrase";
import { VM } from "vm2";

const vendorDir = path.join(process.cwd(), "data", "vendor");

function createSandbox(overrides: Record<string, any> = {}) {
  const exports: Record<string, any> = {};
  const sandbox = new VM({
    sandbox: {
      exports,
      axios: {},
      FormData: class FormData {},
      logger: () => {},
      jsonwebtoken: {},
      fetch: () => {},
      Buffer,
      createOpenAI: () => ({ chat: () => ({}) }),
      createDeepSeek: () => ({}),
      createZhipu: () => ({}),
      createQwen: () => ({}),
      createAnthropic: () => ({}),
      createOpenAICompatible: () => ({}),
      createXai: () => ({}),
      createMinimax: () => ({}),
      createGoogleGenerativeAI: () => ({}),
      urlToBase64: async (url: string) => url,
      zipImage: async (base64: string) => base64,
      zipImageResolution: async (base64: string) => base64,
      mergeImages: async (base64Arr: string[]) => base64Arr.join(""),
      pollTask: async () => ({ completed: true }),
      ...overrides,
    },
  });
  return { sandbox, exports };
}

function readVendorTemplate(fileName: string) {
  const filePath = path.join(vendorDir, fileName);
  assert.equal(fs.existsSync(filePath), true, `${fileName} should exist`);

  const tsCode = fs.readFileSync(filePath, "utf-8");
  return transform(tsCode, { transforms: ["typescript"] }).code.replace(/export\s*\{\s*\};?/g, "");
}

function loadVendorTemplate(fileName: string) {
  const jsCode = readVendorTemplate(fileName);
  const { sandbox, exports } = createSandbox();
  sandbox.run(jsCode);
  assert.equal(typeof exports.vendor, "object", `${fileName} should export vendor`);
  assert.equal(typeof exports.imageRequest, "function", `${fileName} should export imageRequest`);
  assert.equal(typeof exports.videoRequest, "function", `${fileName} should export videoRequest`);
  assert.equal(typeof exports.ttsRequest, "function", `${fileName} should export ttsRequest`);
  return exports.vendor;
}

const qwen = loadVendorTemplate("qwen2api.ts");
assert.equal(qwen.id, "qwen2api");
assert.equal(qwen.version, "2.0");
assert.equal(typeof qwen.inputValues.apiKey, "string");
assert.match(qwen.inputValues.baseUrl, /^https?:\/\//);
assert.equal(qwen.models.some((model: any) => model.type === "image"), true);
assert.equal(qwen.models.some((model: any) => model.type === "video"), true);

const jimeng = loadVendorTemplate("jimeng.ts");
assert.equal(jimeng.id, "jimeng");
assert.equal(typeof jimeng.inputValues.sessionid, "string");
assert.match(jimeng.inputValues.baseUrl, /^https?:\/\//);
assert.equal(jimeng.models.some((model: any) => model.type === "image"), true);
assert.equal(jimeng.models.some((model: any) => model.type === "video"), true);

async function testJimengVideoModelAlias() {
  const jimengCode = readVendorTemplate("jimeng.ts");
  const requests: Array<{ url: string; fields: Record<string, any> }> = [];
  const logs: string[] = [];
  class CapturingFormData {
    fields: Record<string, any> = {};
    append(key: string, value: any) {
      if (this.fields[key] === undefined) this.fields[key] = value;
      else if (Array.isArray(this.fields[key])) this.fields[key].push(value);
      else this.fields[key] = [this.fields[key], value];
    }
    getHeaders() {
      return { "content-type": "multipart/form-data" };
    }
  }
  const { sandbox: jimengSandbox, exports: jimengExports } = createSandbox({
    FormData: CapturingFormData,
    axios: {
      post: async (url: string, body: CapturingFormData) => {
        requests.push({ url, fields: body.fields });
        return { data: { data: [{ url: "https://cdn.example.test/video.mp4" }] } };
      },
    },
    urlToBase64: async (url: string) => (url.startsWith("data:") ? "image-b64" : `converted:${url}`),
    logger: (msg: string) => logs.push(msg),
  });
  jimengSandbox.run(jimengCode);
  jimengExports.vendor.inputValues.sessionid = "test-session";
  jimengExports.vendor.inputValues.baseUrl = "http://127.0.0.1:5100";
  jimengExports.vendor.inputValues.testImageUrl = "";

  await jimengExports.videoRequest(
    {
      prompt: "move",
      duration: 5,
      resolution: "720p",
      aspectRatio: "9:16",
      mode: "singleImage",
      referenceList: [{ type: "image", sourceType: "base64", base64: "data:image/png;base64,aGVsbG8=" }],
    },
    { name: "Seedance 2.0 Fast VIP", modelName: "jimeng-video-seedance-2.0-fast-vip", type: "video", audio: "optional" },
  );

  assert.equal(requests[0].url, "http://127.0.0.1:5100/v1/videos/generations");
  assert.equal(requests[0].fields.model, "jimeng-video-seedance-2.0-fast");
  assert.equal(logs.some((log) => log.includes("[即梦API] 提交视频任务 POST http://127.0.0.1:5100/v1/videos/generations")), true);
  assert.equal(
    logs.some((log) =>
      log.includes('"imageRefs":[{"field":"image_file_1","role":"first_frame","sourceType":"base64","mimeType":"image/png","bytes":5}]'),
    ),
    true,
  );
  assert.equal(logs.some((log) => log.includes("aGVsbG8=")), false);
}

async function testJimengVideoRiskControlError() {
  const jimengCode = readVendorTemplate("jimeng.ts");
  class CapturingFormData {
    fields: Record<string, any> = {};
    append(key: string, value: any) {
      this.fields[key] = value;
    }
    getHeaders() {
      return { "content-type": "multipart/form-data" };
    }
  }
  const { sandbox: jimengSandbox, exports: jimengExports } = createSandbox({
    FormData: CapturingFormData,
    axios: {
      post: async () => ({
        data: {
          code: -2001,
          message: "[请求失败]: 生成失败，疑似存在异常行为，请重新尝试 (错误码: 4013)",
          data: null,
        },
      }),
    },
  });
  jimengSandbox.run(jimengCode);
  jimengExports.vendor.inputValues.sessionid = "test-session";
  jimengExports.vendor.inputValues.baseUrl = "http://127.0.0.1:5100";
  jimengExports.vendor.inputValues.testImageUrl = "";

  await assert.rejects(
    () =>
      jimengExports.videoRequest(
        {
          prompt: "move",
          duration: 5,
          resolution: "720p",
          aspectRatio: "9:16",
          mode: "singleImage",
          referenceList: [{ type: "image", sourceType: "base64", base64: "data:image/png;base64,aGVsbG8=" }],
        },
        { name: "Seedance 2.0 Fast VIP", modelName: "jimeng-video-seedance-2.0-fast-vip", type: "video", audio: "optional" },
      ),
    /即梦视频提交被风控拒绝.*错误码: 4013.*SessionID/,
  );
}

async function testJimengVideoOmniReferenceMode() {
  const jimengCode = readVendorTemplate("jimeng.ts");
  const requests: Array<{ url: string; fields: Record<string, any> }> = [];
  class CapturingFormData {
    fields: Record<string, any> = {};
    append(key: string, value: any) {
      if (this.fields[key] === undefined) this.fields[key] = value;
      else if (Array.isArray(this.fields[key])) this.fields[key].push(value);
      else this.fields[key] = [this.fields[key], value];
    }
    getHeaders() {
      return { "content-type": "multipart/form-data" };
    }
  }
  const { sandbox: jimengSandbox, exports: jimengExports } = createSandbox({
    FormData: CapturingFormData,
    axios: {
      post: async (url: string, body: CapturingFormData) => {
        requests.push({ url, fields: body.fields });
        return { data: { data: [{ url: "https://cdn.example.test/video.mp4" }] } };
      },
    },
  });
  jimengSandbox.run(jimengCode);
  jimengExports.vendor.inputValues.sessionid = "test-session";
  jimengExports.vendor.inputValues.baseUrl = "http://127.0.0.1:5100";
  jimengExports.vendor.inputValues.testImageUrl = "";

  await jimengExports.videoRequest(
    {
      prompt: "@image_file_1 as first frame, @image_file_2 as style reference, mimic motion from @video_file_1",
      duration: 5,
      resolution: "720p",
      aspectRatio: "16:9",
      mode: [["imageReference:9", "videoReference:3"]],
      referenceList: [
        { type: "image", sourceType: "base64", base64: "data:image/png;base64,aW1nMQ==" },
        { type: "image", sourceType: "base64", base64: "data:image/png;base64,aW1nMg==" },
        { type: "video", sourceType: "base64", base64: "data:video/mp4;base64,dmlkMQ==" },
      ],
    },
    { name: "Seedance 2.0 Fast VIP", modelName: "jimeng-video-seedance-2.0-fast-vip", type: "video", audio: "optional" },
  );

  assert.equal(requests[0].fields.model, "jimeng-video-seedance-2.0-fast");
  assert.equal(requests[0].fields.functionMode, "omni_reference");
  assert.equal(requests[0].fields.image_file_1 instanceof Buffer, true);
  assert.equal(requests[0].fields.image_file_2 instanceof Buffer, true);
  assert.equal(requests[0].fields.video_file_1 instanceof Buffer, true);
}

async function testOpenAIImageTemplate() {
  const openaiCode = readVendorTemplate("openai.ts");
  const requests: Array<{ url: string; body: any }> = [];
  const { sandbox: openaiSandbox, exports: openaiExports } = createSandbox({
    axios: {
      post: async (url: string, body: any) => {
        requests.push({ url, body });
        if (body.prompt === "return url") return { data: { data: [{ url: "https://cdn.example.test/out.png" }] } };
        if (body.prompt === "forbidden") {
          return {
            status: 403,
            data: { error: { message: "API Key is not assigned to any group and cannot be used." }, type: "error" },
          };
        }
        return { data: { data: [{ b64_json: `b64:${requests.length}` }] } };
      },
    },
    urlToBase64: async (url: string) => `converted:${url}`,
  });
  openaiSandbox.run(openaiCode);

  assert.equal(openaiExports.vendor.id, "openai");
  assert.equal(openaiExports.vendor.version, "2.2");
  assert.deepEqual(
    openaiExports.vendor.models.find((model: any) => model.name === "GPT-5.5"),
    { name: "GPT-5.5", modelName: "gpt-5.5", type: "text", think: true },
  );
  assert.deepEqual(
    openaiExports.vendor.models.find((model: any) => model.name === "GPT-image-2"),
    { name: "GPT-image-2", modelName: "gpt-image-2", type: "image", mode: ["text", "singleImage", "multiReference"] },
  );

  openaiExports.vendor.inputValues.apiKey = "Bearer test-key";
  openaiExports.vendor.inputValues.baseUrl = "https://example.test/v1/";
  const openaiImageModel = openaiExports.vendor.models.find((model: any) => model.modelName === "gpt-image-2");

  const textToImage = await openaiExports.imageRequest(
    { prompt: "a red lantern", size: "1K", aspectRatio: "1:1" },
    openaiImageModel,
  );
  assert.equal(textToImage, "b64:1");
  assert.equal(requests[0].url, "https://example.test/v1/images/generations");
  assert.deepEqual(requests[0].body, {
    model: "gpt-image-2",
    prompt: "a red lantern",
    size: "1024x1024",
    response_format: "b64_json",
  });

  const imageToImage = await openaiExports.imageRequest(
    {
      prompt: "keep character, change background",
      size: "1K",
      aspectRatio: "16:9",
      referenceList: [{ type: "image", base64: "data:image/png;base64,abc" }],
    },
    openaiImageModel,
  );
  assert.equal(imageToImage, "b64:2");
  assert.equal(requests[1].url, "https://example.test/v1/images/edits");
  assert.deepEqual(requests[1].body, {
    model: "gpt-image-2",
    prompt: "keep character, change background",
    images: [{ image_url: "data:image/png;base64,abc" }],
    size: "1536x1024",
    response_format: "b64_json",
  });

  const multiImage = await openaiExports.imageRequest(
    {
      prompt: "combine character and scene",
      size: "1K",
      aspectRatio: "16:9",
      referenceList: [
        { type: "image", base64: "data:image/png;base64,role" },
        { type: "image", base64: "data:image/png;base64,scene" },
      ],
    },
    openaiImageModel,
  );
  assert.equal(multiImage, "b64:3");
  assert.equal(requests[2].url, "https://example.test/v1/images/edits");
  assert.deepEqual(requests[2].body.images, [
    { image_url: "data:image/png;base64,role" },
    { image_url: "data:image/png;base64,scene" },
  ]);

  const urlResponse = await openaiExports.imageRequest(
    { prompt: "return url", size: "1K", aspectRatio: "9:16" },
    openaiImageModel,
  );
  assert.equal(urlResponse, "converted:https://cdn.example.test/out.png");
  assert.equal(requests[3].body.size, "1024x1536");

  await assert.rejects(
    () => openaiExports.imageRequest({ prompt: "forbidden", size: "1K", aspectRatio: "1:1" }, openaiImageModel),
    /图片生成请求失败，状态码: 403，错误信息: API Key is not assigned to any group and cannot be used\./,
  );
}

Promise.all([testJimengVideoModelAlias(), testJimengVideoRiskControlError(), testJimengVideoOmniReferenceMode(), testOpenAIImageTemplate()]).then(() => {
  console.log("vendor template tests passed");
});

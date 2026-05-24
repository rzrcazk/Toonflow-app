import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { transform } from "sucrase";
import { VM } from "vm2";

const vendorDir = path.join(process.cwd(), "data", "vendor");

function loadVendorTemplate(fileName: string) {
  const filePath = path.join(vendorDir, fileName);
  assert.equal(fs.existsSync(filePath), true, `${fileName} should exist`);

  const tsCode = fs.readFileSync(filePath, "utf-8");
  const jsCode = transform(tsCode, { transforms: ["typescript"] }).code.replace(/export\s*\{\s*\};?/g, "");
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
    },
  });
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
assert.equal(qwen.inputValues.apiKey, "");
assert.equal(qwen.inputValues.baseUrl, "http://qwen2api:7860");
assert.equal(qwen.models.some((model: any) => model.type === "image"), true);
assert.equal(qwen.models.some((model: any) => model.type === "video"), true);

const jimeng = loadVendorTemplate("jimeng.ts");
assert.equal(jimeng.id, "jimeng");
assert.equal(jimeng.inputValues.sessionid, "");
assert.equal(jimeng.inputValues.baseUrl, "http://jimeng-api:8000");
assert.equal(jimeng.models.some((model: any) => model.type === "image"), true);
assert.equal(jimeng.models.some((model: any) => model.type === "video"), true);

console.log("vendor template tests passed");

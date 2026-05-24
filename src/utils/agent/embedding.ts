import * as ONNX_WEB from "onnxruntime-web";
import { pipeline, env as transformersEnv, FeatureExtractionPipeline } from "@huggingface/transformers";
import path from "path";
import fs from "fs";
import getPath from "@/utils/getPath";
import db from "@/utils/db";

let extractor: FeatureExtractionPipeline | null = null;
let extractorCacheKey = "";

type EmbeddingSettings = {
  embeddingProvider: "local" | "openai";
  embeddingModel: string;
  embeddingDimensions?: number;
  modelOnnxFile: string[];
  modelDtype: string;
};

async function getEmbeddingSettings(): Promise<EmbeddingSettings> {
  const rows = await db("o_setting").whereIn("key", ["embeddingProvider", "embeddingModel", "embeddingDimensions", "modelOnnxFile", "modelDtype"]);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    if (row.key && row.value != null) settings[row.key] = String(row.value);
  }

  const provider = settings.embeddingProvider === "openai" ? "openai" : "local";
  const dimensions = Number(settings.embeddingDimensions);
  const configuredModel = settings.embeddingModel;
  let embeddingModel = configuredModel || "all-MiniLM-L6-v2";
  if (provider === "openai" && !configuredModel?.startsWith("text-embedding-3-")) {
    embeddingModel = "text-embedding-3-small";
  }
  return {
    embeddingProvider: provider,
    embeddingModel,
    embeddingDimensions: Number.isFinite(dimensions) && dimensions > 0 ? dimensions : undefined,
    modelOnnxFile: settings.modelOnnxFile ? JSON.parse(settings.modelOnnxFile) : ["all-MiniLM-L6-v2", "onnx", "model_fp16.onnx"],
    modelDtype: settings.modelDtype ?? "fp16",
  };
}

function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!norm) return vector;
  return vector.map((value) => value / norm);
}

export async function initEmbedding(): Promise<void> {
  const { modelOnnxFile, modelDtype } = await getEmbeddingSettings();
  const cacheKey = JSON.stringify({ modelOnnxFile, modelDtype });
  if (extractor && extractorCacheKey === cacheKey) return;

  const onnxPath = path.join(getPath("models"), ...modelOnnxFile);
  if (!fs.existsSync(onnxPath)) {
    throw new Error(`Embedding 模型文件不存在: ${onnxPath}`);
  }

  transformersEnv.allowRemoteModels = false;
  transformersEnv.allowLocalModels = true;
  transformersEnv.localModelPath = getPath("models").replace(/\\/g, "/") + "/";

  const modelFolder = modelOnnxFile[0];
  // @ts-ignore - pipeline 重载联合类型过于复杂
  extractor = await pipeline("feature-extraction", modelFolder, { dtype: modelDtype });
  extractorCacheKey = cacheKey;
}

async function getLocalEmbedding(text: string): Promise<number[]> {
  if (!extractor) await initEmbedding();
  const output = await extractor!(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

async function getOpenAIEmbedding(text: string, model: string, dimensions?: number): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("未配置 OPENAI_API_KEY，无法使用 OpenAI 向量模型");

  const body: Record<string, unknown> = {
    model,
    input: text,
    encoding_format: "float",
  };
  if (dimensions) body.dimensions = dimensions;

  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const response = await fetch(`${baseURL.replace(/\/$/, "")}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI Embedding 请求失败: ${response.status} ${detail}`);
  }

  const data = (await response.json()) as { data?: { embedding?: number[] }[] };
  const embedding = data.data?.[0]?.embedding;
  if (!embedding?.length) throw new Error("OpenAI Embedding 返回为空");
  return normalizeVector(embedding);
}

export async function getEmbedding(text: string): Promise<number[]> {
  const settings = await getEmbeddingSettings();
  if (settings.embeddingProvider === "openai") {
    return getOpenAIEmbedding(text, settings.embeddingModel, settings.embeddingDimensions);
  }
  return getLocalEmbedding(text);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return Number.NEGATIVE_INFINITY;
  return a.reduce((dot, v, i) => dot + v * b[i], 0);
}

export async function disposeEmbedding(): Promise<void> {
  await extractor?.dispose?.();
  extractor = null;
  extractorCacheKey = "";
}

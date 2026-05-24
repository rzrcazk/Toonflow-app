import u from "@/utils";

export interface VideoDurationPolicy {
  modelKey: string;
  modelName: string;
  supportedDurations: number[];
  minDuration: number;
  maxDuration: number;
}

function normalizeDurations(durationResolutionMap: unknown): number[] {
  if (!Array.isArray(durationResolutionMap)) return [];
  const durations = durationResolutionMap.flatMap((item: any) => (Array.isArray(item?.duration) ? item.duration : []));
  return [...new Set(durations.map(Number).filter((duration) => Number.isFinite(duration) && duration > 0))].sort((a, b) => a - b);
}

export async function getVideoDurationPolicy(modelKey: string): Promise<VideoDurationPolicy> {
  const [vendorId, modelName] = modelKey.split(/:(.+)/);
  if (!vendorId || !modelName) throw new Error(`视频模型格式无效：${modelKey}`);

  const models = await u.vendor.getModelList(vendorId);
  const model = models.find((item: any) => item.modelName === modelName);
  if (!model) throw new Error(`未找到视频模型：${modelKey}`);

  const supportedDurations = normalizeDurations(model.durationResolutionMap);
  if (!supportedDurations.length) throw new Error(`视频模型未配置支持时长：${modelName}`);

  return {
    modelKey,
    modelName,
    supportedDurations,
    minDuration: supportedDurations[0],
    maxDuration: supportedDurations[supportedDurations.length - 1],
  };
}

export async function getProjectVideoDurationPolicy(projectId: number): Promise<VideoDurationPolicy> {
  const project = await u.db("o_project").where("id", projectId).select("videoModel").first();
  if (!project?.videoModel) throw new Error("项目未配置视频模型");
  return getVideoDurationPolicy(project.videoModel);
}

export function assertSupportedVideoDuration(duration: number, policy: VideoDurationPolicy, label = "视频时长") {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`${label}无效：${duration}`);
  if (!policy.supportedDurations.includes(Number(duration))) {
    throw new Error(
      `${label} ${duration}s 不被当前视频模型 ${policy.modelName} 支持；支持的时长：${policy.supportedDurations.join(", ")}s。请拆分分镜或选择合法时长。`,
    );
  }
}

export function buildVideoDurationPrompt(policy: VideoDurationPolicy): string {
  return [
    "## 视频模型时长硬约束",
    `当前视频模型：${policy.modelName}`,
    `单条分镜 duration 只能取以下值之一：${policy.supportedDurations.join(", ")} 秒。`,
    `单条分镜最大时长：${policy.maxDuration} 秒；最小时长：${policy.minDuration} 秒。`,
    "如果台词、动作或情绪停顿超过单条最大时长，必须拆成多个连续分镜，每条分镜的 duration 都必须落在支持值集合内。",
    "禁止输出不在支持值集合内的分镜时长；不要依赖后续视频生成阶段裁剪时长。",
  ].join("\n");
}

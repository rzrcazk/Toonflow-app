import express from "express";
import u from "@/utils";
import { z } from "zod";
import { error, success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { groupStoryboardsForVideoTracks, normalizeSupportedDurations } from "@/utils/storyboardTrackGrouping";
const router = express.Router();
export default router.post(
  "/",
  validateFields({
    data: z.array(
      z.object({
        prompt: z.string(),
        duration: z.number(),
        track: z.string(),
        state: z.string(),
        src: z.string().nullable(),
        videoDesc: z.string(),
        shouldGenerateImage: z.number(),
        associateAssetsIds: z.array(z.number()),
        index: z.number().optional(),
      }),
    ),
    scriptId: z.number(),
    projectId: z.number(),
  }),
  async (req, res) => {
    const { data, scriptId, projectId } = req.body;
    if (!data.length) return res.status(400).send({ success: false, message: "数据不能为空" });
    for (const item of data) {
      const [id] = await u.db("o_storyboard").insert({
        prompt: item.prompt,
        duration: String(item.duration),
        state: item.state,
        scriptId,
        projectId,
        track: item.track,
        videoDesc: item.videoDesc,
        shouldGenerateImage: item.shouldGenerateImage,
        index: item.index,
        createTime: Date.now(),
      });
      if (item.associateAssetsIds?.length) {
        await u.db("o_assets2Storyboard").insert(
          item.associateAssetsIds.map((assetId: number) => ({
            assetId,
            storyboardId: id,
          })),
        );
      }
      item.id = id;
    }
    const lastStoryboard = await u.db("o_storyboard").where({ scriptId, projectId }).orderBy("index", "asc").orderBy("id", "asc");
    if (!lastStoryboard || !lastStoryboard.length) return res.status(400).send(error("未查到分镜数据"));
    const storyboardsWithId = lastStoryboard.filter((item): item is typeof item & { id: number } => typeof item.id === "number");
    const supportedDurations = await getProjectVideoSupportedDurations(projectId);
    const trackGroups = groupStoryboardsForVideoTracks(storyboardsWithId, supportedDurations);
    const existingTracks = await u.db("o_videoTrack").where({ scriptId, projectId }).orderBy("id", "asc");

    for (let index = 0; index < trackGroups.length; index += 1) {
      const group = trackGroups[index];
      const storyboardIds = group.items.map((item) => item.id);
      const existingTrack = existingTracks[index];
      const trackId = existingTrack?.id ?? Date.now() + index;

      if (existingTrack?.id) {
        const previousStoryboardIds = await u
          .db("o_storyboard")
          .where({ trackId, scriptId, projectId })
          .orderBy("index", "asc")
          .orderBy("id", "asc")
          .select("id")
          .pluck("id");
        const trackMembersChanged = !sameOrderedIds(previousStoryboardIds, storyboardIds);
        await u.db("o_videoTrack").where("id", trackId).update({
          duration: group.duration,
          ...(trackMembersChanged
            ? {
                state: "未生成",
                reason: "",
                prompt: "",
                videoId: null,
                selectVideoId: null,
              }
            : {}),
        });
      } else {
        await u.db("o_videoTrack").insert({
          id: trackId,
          scriptId,
          projectId,
          duration: group.duration,
        });
      }

      await u
        .db("o_storyboard")
        .whereIn("id", storyboardIds)
        .update({ trackId, track: String(index + 1) });
    }

    const extraTrackIds = existingTracks.slice(trackGroups.length).map((track) => track.id).filter((id): id is number => typeof id === "number");
    if (extraTrackIds.length) {
      const trackIdsWithVideo = await u.db("o_video").whereIn("videoTrackId", extraTrackIds).select("videoTrackId").pluck("videoTrackId");
      const removableTrackIds = extraTrackIds.filter((trackId) => !trackIdsWithVideo.includes(trackId));
      if (removableTrackIds.length) await u.db("o_videoTrack").whereIn("id", removableTrackIds).delete();
    }

    const storyboardData = await Promise.all(
      lastStoryboard.map(async (i) => {
        return {
          associateAssetsIds: await u.db("o_assets2Storyboard").where("storyboardId", i.id).orderBy("rowid").select("assetId").pluck("assetId"),
          src: i.filePath ? await u.oss.getSmallImageUrl(i.filePath) : "",
          id: i.id,
          trackId: i.trackId,
          prompt: i.prompt,
          duration: Number(i.duration),
          state: i.state,
          scriptId: i.scriptId,
          reason: i.reason,
          videoDesc: i.videoDesc
        };
      }),
    );
    return res.status(200).send(success(storyboardData));
  },
);

async function getProjectVideoSupportedDurations(projectId: number): Promise<number[]> {
  const project = await u.db("o_project").where("id", projectId).select("videoModel").first();
  const [vendorId, modelName] = String(project?.videoModel ?? "").split(/:(.+)/);
  if (!vendorId || !modelName) return normalizeSupportedDurations(null);

  const modelList = await u.vendor.getModelList(vendorId);
  const videoModel = modelList.find((model: any) => model.modelName === modelName);
  return normalizeSupportedDurations(videoModel?.durationResolutionMap);
}

function sameOrderedIds(left: unknown[], right: number[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((id, index) => Number(id) === right[index]);
}

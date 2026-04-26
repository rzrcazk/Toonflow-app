import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
import { generateScript } from "@/agents/animalVideoAgent/scriptAgent";
const router = express.Router();

// 新增项目
export default router.post(
  "/",
  validateFields({
    projectType: z.string(),
    name: z.string(),
    intro: z.string(),
    type: z.string(),
    artStyle: z.string(),
    directorManual: z.string(),
    videoRatio: z.string(),
    imageModel: z.string(),
    videoModel: z.string(),
    imageQuality: z.string(),
    mode: z.string(),
  }),
  async (req, res) => {
    const { projectType, name, intro, type, directorManual, artStyle, videoRatio, imageModel, videoModel, imageQuality, mode } = req.body;

    // 先创建项目获取 ID
    const result = await u.db("o_project")
      .insert({
        projectType,
        name,
        intro,
        type,
        artStyle,
        videoRatio,
        directorManual,
        userId: 1,
        imageModel,
        videoModel,
        createTime: BigInt(Date.now()),
        imageQuality,
        mode,
      })
      .returning("id");

    const projectId = result[0]?.id || result[0];

    // 如果是动物科普视频类型，自动生成科普脚本并存为小说章节，触发事件提取
    if (projectType === "animal_science") {
      try {
        const script = await generateScript(name);
        const novelResult = await u.db("o_novel")
          .insert({
            projectId,
            chapter: name,
            chapterData: script.full,
            order: 1,
            eventState: 0,
            createTime: Date.now(),
          })
          .returning("id");

        const novelId = novelResult[0]?.id || novelResult[0];
        const chapterAllList = await u.db("o_novel").where("id", novelId);

        const novelClass = new u.cleanNovel();
        novelClass.emitter.on("item", async (item) => {
          await u
            .db("o_novel")
            .where("id", item.id)
            .update({ event: item.event, eventState: item.event ? 1 : -1, errorReason: item?.errReason ?? null });
        });
        novelClass.start(chapterAllList, projectId);
      } catch (e) {
        // 生成失败不影响项目创建，仅记录日志
        console.error("生成动物科普脚本失败:", e);
      }
    }

    res.status(200).send(success({ id: projectId }, "新增项目成功"));
  },
);

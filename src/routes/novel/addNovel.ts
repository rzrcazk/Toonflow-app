import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

// 新增原文数据
export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    data: z.array(
      z.object({
        index: z.number(),
        reel: z.string(),
        chapter: z.string(),
        chapterData: z.string(),
      }),
    ),
  }),
  async (req, res) => {
    const { projectId, data } = req.body;
    const totalNovelId = [];
    const getLastOrder = await u.db("o_novel").where("projectId", projectId).select("order").orderBy("order", "desc").first();
    let lastOrder = 0;
    if (getLastOrder) {
      lastOrder = getLastOrder.order!;
    }
    for (const item of data) {
      const result = await u.db("o_novel").insert({
        projectId,
        order: ++lastOrder,
        reel: item.reel,
        chapter: item.chapter,
        chapterData: item.chapterData,
        createTime: Date.now(),
        eventState: 0,
      }).returning("id");
      totalNovelId.push(result[0].id);
    }
    const chapterAllList = await u.db("o_novel").where("projectId", projectId).whereIn("id", totalNovelId);
    const novelClass = new u.cleanNovel();
    novelClass.emitter.on("item", async (item) => {
      await u
        .db("o_novel")
        .where("id", item.id)
        .update({ event: item.event, eventState: item.event ? 1 : -1, errorReason: item?.errReason ?? null });
    });
    novelClass.start(chapterAllList, projectId);

    res.status(200).send(success({ message: "新增原文成功" }));
  },
);

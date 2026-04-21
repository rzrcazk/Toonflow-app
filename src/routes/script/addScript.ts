import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success, error } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

// 新增剧本
export default router.post(
  "/",
  validateFields({
    name: z.string(),
    content: z.string(),
    projectId: z.number(),
    novelIds: z.array(z.number()).optional(), // 可选，指定该剧本关联的章节 id 列表
    assets: z.array(z.number()),
  }),
  async (req, res) => {
    const { name, content, projectId, novelIds, assets } = req.body;

    await u.db("o_script").insert({
      name,
      content,
      projectId,
      createTime: Date.now(),
    });
    const newRow = await u.db("o_script").where({ projectId, name }).select("id").first();
    const scriptId = newRow.id;

    // 建立章节关联：优先使用传入的 novelIds，否则关联项目下全部章节
    const targetNovelIds: number[] = novelIds?.length
      ? novelIds
      : (await u.db("o_novel").where({ projectId }).orderBy("order").select("id")).map((n: any) => n.id);
    if (targetNovelIds.length > 0) {
      await u.db("o_scriptNovelMap").insert(
        targetNovelIds.map((novelId: number, index: number) => ({ scriptId, novelId, order: index }))
      );
    }

    if (assets.length) {
      const assetsData = await u.db("o_assets").whereIn("id", assets).select();
      if (assetsData.length) {
        const assetsIds = assetsData.map((item) => item.id);
        const insertData = assetsIds.map((i) => ({ scriptId, assetsId: i }));
        await u.db("o_scriptAssets").insert(insertData);
      }
    }

    res.status(200).send(success({ message: "添加剧本成功" }));
  },
);

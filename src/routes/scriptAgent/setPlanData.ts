import express from "express";
import { success } from "@/lib/responseFormat";
import u from "@/utils";
import { z } from "zod";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    agentType: z.enum(["scriptAgent"]),
    data: z.object({
      storySkeleton: z.string(),
      adaptationStrategy: z.string(),
    }),
  }),
  async (req, res) => {
    const { projectId, agentType, data } = req.body;
    await u
      .db("o_agentWorkData")
      .where({ projectId: projectId, key: agentType })
      .update({
        data: JSON.stringify(data),
      });
    const script = data.script;

    // 查询项目下所有章节，用于建立 scriptNovelMap 关联
    const novels = await u.db("o_novel").where({ projectId }).orderBy("order").select("id");
    const novelIds = novels.map((n: any) => n.id);

    await Promise.all(
      script.map(async (s: any) => {
        let scriptId: number;
        const row = await u.db("o_script").where({ projectId, name: s.name }).first();
        if (row) {
          await u.db("o_script").where({ id: row.id }).update({ content: s.content });
          scriptId = row.id;
        } else {
          await u.db("o_script").insert({ projectId, name: s.name, content: s.content });
          const newRow = await u.db("o_script").where({ projectId, name: s.name }).select("id").first();
          scriptId = newRow.id;
        }
        // 更新 scriptNovelMap：先清除旧关联，再写入当前项目所有章节
        if (novelIds.length > 0) {
          await u.db("o_scriptNovelMap").where({ scriptId }).delete();
          await u.db("o_scriptNovelMap").insert(
            novelIds.map((novelId: number, index: number) => ({ scriptId, novelId, order: index }))
          );
        }
      }),
    );

    res.status(200).send(success());
  },
);

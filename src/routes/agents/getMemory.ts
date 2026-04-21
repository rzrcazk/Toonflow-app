import express from "express";
import u from "@/utils";
import { z } from "zod";
import { success } from "@/lib/responseFormat";
import { validateFields } from "@/middleware/middleware";
const router = express.Router();

function normalizeRole(role?: string | null): "user" | "assistant" {
  return role?.startsWith("assistant") ? "assistant" : "user";
}

export default router.post(
  "/",
  validateFields({
    projectId: z.number(),
    agentType: z.enum(["scriptAgent", "productionAgent"]),
    episodesId: z.number().optional(),
  }),
  async (req, res) => {
    const { projectId, agentType, episodesId } = req.body;
    const isolationKey = `${projectId}:${agentType}${episodesId ? `:${episodesId}` : ""}`;

    const rows = await u
      .db("memories")
      .where({ isolationKey, type: "message" })
      .orderBy("createTime", "asc")
      .select("id", "role", "name", "content", "createTime");

    const history = rows.map((row) => {
      // PostgreSQL bigint 返回的是字符串，需要转为数字
      const createTime = typeof row.createTime === "string" ? Number(row.createTime) : (row.createTime as number);
      const datetime = new Date(createTime).toISOString();

      return {
        id: row.id,
        role: normalizeRole(row.role),
        name: row.name ?? undefined,
        status: "complete",
        datetime,
        content: [{ type: "markdown", status: "complete", data: row.content }],
        createTime,
      };
    });

    res.status(200).send(success(history));
  },
);

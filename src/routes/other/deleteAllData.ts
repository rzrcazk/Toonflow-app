import express from "express";
import { db } from "@/utils/db";
import { success } from "@/lib/responseFormat";
const router = express.Router();

// 清空数据表
export default router.post(
    "/",
    async (req, res) => {
        try {
            // 获取所有表名
            const tables: { name: string }[] = await db.raw(
                `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'knex_%'`,
            );

            // 禁用外键约束，逐一删除所有表
            await db.raw("PRAGMA foreign_keys = OFF");
            for (const table of tables) {
                await db.schema.dropTableIfExists(table.name);
            }
            await db.raw("PRAGMA foreign_keys = ON");

            res.status(200).send(success({ message: "数据库已清空" }));
        } catch (err: any) {
            res.status(500).send(success({ message: "清空失败：" + err?.message }));
        }
    },
);

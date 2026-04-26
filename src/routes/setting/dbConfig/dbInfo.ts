import express from "express";
import { success, error } from "@/lib/responseFormat";
import { db } from "@/utils/db";

const router = express.Router();

export default router.get("/", async (req, res) => {
  try {
    const tablesResult = await db.raw<{ tablename: string }[]>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
    );
    const tables = tablesResult.rows;

    const tableInfo = [];
    for (const table of tables) {
      const countResult = await db.raw(`SELECT COUNT(*) as count FROM "${table.tablename}"`);
      const countValue = countResult.rows[0]?.count ?? 0;
      const rowCount = typeof countValue === "string" ? Number(countValue) : countValue;
      tableInfo.push({
        name: table.tablename,
        rowCount,
      });
    }

    res.status(200).send(success(tableInfo));
  } catch (err: any) {
    res.status(500).send(error(err?.message || "获取数据库信息失败"));
  }
});

/**
 * o_novel 表添加 event 字段迁移脚本
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=user_toonflow PG_PASSWORD=xxx tsx scripts/migrate-novel-event-column.ts
 */

import knex from "knex";

const pg = knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST || "localhost",
    port: parseInt(process.env.PG_PORT || "5432"),
    database: process.env.PG_DATABASE || "toonflow",
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "postgres",
  },
  pool: { min: 1, max: 5 },
});

async function migrateNovelEventColumn() {
  console.log("开始迁移 o_novel 表，添加 event 字段...");

  const exists = await pg.schema.hasTable("o_novel");
  if (!exists) {
    console.log("o_novel 表不存在，退出");
    await pg.destroy();
    return;
  }

  const hasEvent = await pg.schema.hasColumn("o_novel", "event");
  if (hasEvent) {
    console.log("event 字段已存在，退出");
    await pg.destroy();
    return;
  }

  await pg.schema.alterTable("o_novel", (table) => {
    table.text("event").nullable();
  });

  console.log("event 字段添加成功!");
  await pg.destroy();
}

migrateNovelEventColumn().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

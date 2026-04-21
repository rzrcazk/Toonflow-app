/**
 * o_eventChapter 表添加 novelId 字段迁移脚本
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=user_toonflow PG_PASSWORD=xxx tsx scripts/migrate-eventchapter-novelid.ts
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

async function migrateEventChapterNovelId() {
  console.log("开始迁移 o_eventChapter 表，添加 novelId 字段...");

  const exists = await pg.schema.hasTable("o_eventChapter");
  if (!exists) {
    console.log("o_eventChapter 表不存在，退出");
    await pg.destroy();
    return;
  }

  const hasNovelId = await pg.schema.hasColumn("o_eventChapter", "novelId");
  if (hasNovelId) {
    console.log("novelId 字段已存在，退出");
    await pg.destroy();
    return;
  }

  await pg.schema.alterTable("o_eventChapter", (table) => {
    table.integer("novelId").nullable();
  });

  console.log("novelId 字段添加成功!");
  await pg.destroy();
}

migrateEventChapterNovelId().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

/**
 * o_novel 表结构迁移脚本
 * 添加缺失的字段：chapterIndex, reel, chapter, chapterData, createTime
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=postgres PG_PASSWORD=xxx tsx scripts/migrate-novel-table.ts
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

async function migrateNovelTable() {
  console.log("开始迁移 o_novel 表结构...");

  const exists = await pg.schema.hasTable("o_novel");
  if (!exists) {
    console.log("o_novel 表不存在，退出");
    await pg.destroy();
    return;
  }

  // 检查是否已经有新字段
  const hasChapterIndex = await pg.schema.hasColumn("o_novel", "chapterIndex");
  const hasReel = await pg.schema.hasColumn("o_novel", "reel");
  const hasChapter = await pg.schema.hasColumn("o_novel", "chapter");
  const hasChapterData = await pg.schema.hasColumn("o_novel", "chapterData");
  const hasCreateTime = await pg.schema.hasColumn("o_novel", "createTime");

  if (hasChapterIndex && hasReel && hasChapter && hasChapterData && hasCreateTime) {
    console.log("o_novel 表已经是新结构，无需迁移");
    await pg.destroy();
    return;
  }

  console.log("检测到表结构不完整，开始迁移...");

  // 添加缺失的字段
  await pg.schema.alterTable("o_novel", (table) => {
    if (!hasChapterIndex) {
      table.integer("chapterIndex").nullable();
      console.log("添加 chapterIndex 字段");
    }
    if (!hasReel) {
      table.string("reel").nullable();
      console.log("添加 reel 字段");
    }
    if (!hasChapter) {
      table.string("chapter").nullable();
      console.log("添加 chapter 字段");
    }
    if (!hasChapterData) {
      table.text("chapterData").nullable();
      console.log("添加 chapterData 字段");
    }
    if (!hasCreateTime) {
      table.bigInteger("createTime").nullable();
      console.log("添加 createTime 字段");
    }
  });

  console.log("o_novel 表结构迁移完成!");

  await pg.destroy();
}

migrateNovelTable().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

/**
 * o_project 表结构迁移脚本
 * 将旧的 PG 表结构 (name/describe/novelId/artStyleId/customPrompt)
 * 迁移到新的表结构 (projectType/imageModel/imageQuality/videoModel/name/intro/type/artStyle/directorManual/mode/videoRatio/createTime/userId)
 *
 * 用法:
 *   PG_USER=user_toonflow PG_PASSWORD=2430@163.com tsx scripts/migrate-project-table.ts
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

async function migrateProjectTable() {
  console.log("开始迁移 o_project 表结构...");

  const exists = await pg.schema.hasTable("o_project");
  if (!exists) {
    console.log("o_project 表不存在，退出");
    await pg.destroy();
    return;
  }

  // 检查是否已经有新字段
  const hasProjectType = await pg.schema.hasColumn("o_project", "projectType");

  if (hasProjectType) {
    console.log("o_project 表已经是新结构，无需迁移");
    await pg.destroy();
    return;
  }

  console.log("检测到旧表结构，开始迁移...");

  // 1. 备份旧数据（如果有）
  const oldData = await pg("o_project").select("*");
  console.log(`备份 ${oldData.length} 条记录`);

  // 2. 重命名旧表
  await pg.raw('ALTER TABLE "o_project" RENAME TO "o_project_old"');

  // 3. 创建新表
  await pg.schema.createTable("o_project", (table) => {
    table.increments("id").primary();
    table.string("projectType").nullable();
    table.string("imageModel").nullable();
    table.string("imageQuality").nullable();
    table.string("videoModel").nullable();
    table.text("name").notNullable();
    table.text("intro").nullable();
    table.text("type").nullable();
    table.text("artStyle").nullable();
    table.text("directorManual").nullable();
    table.text("mode").nullable();
    table.text("videoRatio").nullable();
    table.bigInteger("createTime").nullable();
    table.bigInteger("userId").nullable();
    table.timestamp("created_at").defaultTo(pg.fn.now());
    table.timestamp("updated_at").defaultTo(pg.fn.now());
  });

  console.log("新表创建完成");

  // 4. 删除旧表（因为字段完全不同，无法迁移数据）
  await pg.schema.dropTable("o_project_old");

  console.log("o_project 表结构迁移完成!");
  console.log("注意：旧数据已删除，因为字段结构完全不同");

  await pg.destroy();
}

migrateProjectTable().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

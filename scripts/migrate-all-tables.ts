/**
 * 批量数据库迁移脚本 - 修复所有缺失字段
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=user_toonflow PG_PASSWORD=xxx tsx scripts/migrate-all-tables.ts
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

async function migrateAllTables() {
  console.log("开始批量迁移数据库表结构...\n");

  // 1. memories 表添加 role, type, isolationKey 字段
  console.log("=== 迁移 memories 表 ===");
  const memoriesExists = await pg.schema.hasTable("memories");
  if (memoriesExists) {
    const hasRole = await pg.schema.hasColumn("memories", "role");
    const hasType = await pg.schema.hasColumn("memories", "type");
    const hasIsolationKey = await pg.schema.hasColumn("memories", "isolationKey");

    if (!hasRole || !hasType || !hasIsolationKey) {
      await pg.schema.alterTable("memories", (table) => {
        if (!hasRole) table.string("role").nullable();
        if (!hasType) table.string("type").nullable();
        if (!hasIsolationKey) table.string("isolationKey").nullable();
      });
      console.log("memories 表：添加 role, type, isolationKey 字段成功");
    } else {
      console.log("memories 表：字段已存在");
    }
  } else {
    console.log("memories 表不存在，跳过");
  }

  // 2. o_script 表添加 projectId 字段
  console.log("\n=== 迁移 o_script 表 ===");
  const scriptExists = await pg.schema.hasTable("o_script");
  if (scriptExists) {
    const hasProjectId = await pg.schema.hasColumn("o_script", "projectId");
    if (!hasProjectId) {
      await pg.schema.alterTable("o_script", (table) => {
        table.integer("projectId").nullable();
      });
      console.log("o_script 表：添加 projectId 字段成功");
    } else {
      console.log("o_script 表：projectId 字段已存在");
    }
  } else {
    console.log("o_script 表不存在，跳过");
  }

  // 3. o_vendorConfig 表检查
  console.log("\n=== 检查 o_vendorConfig 表 ===");
  const vendorConfigExists = await pg.schema.hasTable("o_vendorConfig");
  if (vendorConfigExists) {
    const hasId = await pg.schema.hasColumn("o_vendorConfig", "id");
    const hasModels = await pg.schema.hasColumn("o_vendorConfig", "models");
    console.log(`o_vendorConfig 表：id 字段=${hasId}, models 字段=${hasModels}`);
  } else {
    console.log("o_vendorConfig 表不存在");
  }

  console.log("\n批量迁移完成!");
  await pg.destroy();
}

migrateAllTables().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

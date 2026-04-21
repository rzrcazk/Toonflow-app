/**
 * o_tasks 表结构迁移脚本
 * 将旧的 PG 表结构 (type/relatedId/errorReason) 迁移到新的表结构 (projectId/taskClass/relatedObjects/model/describe/startTime/reason)
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=postgres PG_PASSWORD=xxx tsx scripts/migrate-tasks-table.ts
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

async function migrateTasksTable() {
  console.log("开始迁移 o_tasks 表结构...");

  // 检查表是否存在
  const exists = await pg.schema.hasTable("o_tasks");
  if (!exists) {
    console.log("o_tasks 表不存在，退出");
    await pg.destroy();
    return;
  }

  // 检查是否已经有新字段
  const hasProjectId = await pg.schema.hasColumn("o_tasks", "projectId");

  if (hasProjectId) {
    console.log("o_tasks 表已经是新结构，无需迁移");
    await pg.destroy();
    return;
  }

  console.log("检测到旧表结构，开始迁移...");

  // 1. 添加新字段
  await pg.schema.alterTable("o_tasks", (table) => {
    table.integer("projectId").defaultTo(0); // 临时默认值
    table.string("taskClass").defaultTo("default"); // 临时默认值
    table.string("relatedObjects").nullable();
    table.string("model").nullable();
    table.text("describe").nullable();
    table.integer("startTime").nullable();
    table.text("reason").nullable();
  });

  console.log("新字段添加完成");

  // 2. 删除旧字段
  await pg.schema.alterTable("o_tasks", (table) => {
    table.dropColumn("type");
    table.dropColumn("relatedId");
    table.dropColumn("errorReason");
  });

  console.log("旧字段删除完成");

  // 3. 修改新字段为 NOT NULL（移除默认值）
  await pg.schema.alterTable("o_tasks", (table) => {
    table.integer("projectId").notNullable().alter();
    table.string("taskClass").notNullable().alter();
  });

  console.log("字段约束更新完成");
  console.log("o_tasks 表结构迁移完成!");

  await pg.destroy();
}

migrateTasksTable().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

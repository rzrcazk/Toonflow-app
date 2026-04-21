/**
 * memories 表添加 name 字段迁移脚本
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

async function migrateMemoriesTable() {
  console.log("开始迁移 memories 表...");

  const exists = await pg.schema.hasTable("memories");
  if (!exists) {
    console.log("memories 表不存在，退出");
    await pg.destroy();
    return;
  }

  // 添加缺失字段
  const fields = [
    { name: "name", type: (table: any) => table.string("name").nullable() },
    { name: "embedding", type: (table: any) => table.text("embedding").nullable() },
    { name: "relatedMessageIds", type: (table: any) => table.text("relatedMessageIds").nullable() },
    { name: "summarized", type: (table: any) => table.boolean("summarized").defaultTo(false) },
  ];

  for (const field of fields) {
    const hasField = await pg.schema.hasColumn("memories", field.name);
    if (!hasField) {
      await pg.schema.alterTable("memories", field.type);
      console.log(`添加 ${field.name} 字段成功`);
    } else {
      console.log(`${field.name} 字段已存在`);
    }
  }

  // 确保 createTime 字段存在
  const hasCreateTime = await pg.schema.hasColumn("memories", "createTime");
  if (!hasCreateTime) {
    await pg.schema.alterTable("memories", (table) => {
      table.bigInteger("createTime").nullable();
    });
    console.log("添加 createTime 字段成功");
  }

  console.log("memories 表迁移完成!");
  await pg.destroy();
}

migrateMemoriesTable().catch((err) => {
  console.error("迁移失败:", err);
  process.exit(1);
});

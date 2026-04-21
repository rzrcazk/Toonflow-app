/**
 * 添加 universalAi 默认配置脚本
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=user_toonflow PG_PASSWORD=xxx tsx scripts/add-universal-ai-config.ts
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

async function addUniversalAiConfig() {
  console.log("添加 universalAi 默认配置...");

  const exists = await pg("o_agentDeploy").where("key", "universalAi").first();
  if (exists) {
    console.log("universalAi 配置已存在");
    await pg.destroy();
    return;
  }

  await pg("o_agentDeploy").insert({
    key: "universalAi",
    name: "通用 AI",
    desc: "通用 AI 模型，用于事件提取等通用任务",
    model: "Qwen 3.5 Plus",
    modelName: "new-api:qwen3.5-plus",
    vendorId: "new-api",
    type: 1,
    temperature: 1,
    maxOutputTokens: 0,
    disabled: false,
    created_at: new Date(),
    updated_at: new Date(),
  });

  console.log("universalAi 配置添加成功!");
  await pg.destroy();
}

addUniversalAiConfig().catch((err) => {
  console.error("添加失败:", err);
  process.exit(1);
});

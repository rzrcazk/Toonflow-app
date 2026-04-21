/**
 * 添加 scriptAgent 和 productionAgent 主配置脚本
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

async function addMainAgentConfig() {
  console.log("添加主 Agent 配置...");

  // 添加 scriptAgent 主配置
  const scriptAgentExists = await pg("o_agentDeploy").where("key", "scriptAgent").first();
  if (!scriptAgentExists) {
    await pg("o_agentDeploy").insert({
      key: "scriptAgent",
      name: "剧本 Agent",
      desc: "剧本生成 Agent",
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
    console.log("scriptAgent 主配置添加成功!");
  } else {
    console.log("scriptAgent 主配置已存在");
  }

  // 添加 productionAgent 主配置
  const productionAgentExists = await pg("o_agentDeploy").where("key", "productionAgent").first();
  if (!productionAgentExists) {
    await pg("o_agentDeploy").insert({
      key: "productionAgent",
      name: "生产 Agent",
      desc: "生产生成 Agent",
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
    console.log("productionAgent 主配置添加成功!");
  } else {
    console.log("productionAgent 主配置已存在");
  }

  await pg.destroy();
}

addMainAgentConfig().catch((err) => {
  console.error("添加失败:", err);
  process.exit(1);
});

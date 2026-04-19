/**
 * PostgreSQL 数据库初始化脚本
 * 用于首次创建所有必需的表结构
 */

import { Knex } from "knex";

export async function initPgSchema(knex: Knex): Promise<void> {
  console.log("开始初始化 PostgreSQL 数据库架构...");

  // 创建表 - 按依赖顺序
  await createAgentDeployTable(knex);
  await createSkillListTable(knex);
  await createSkillAttributionTable(knex);
  await createPromptTable(knex);
  await createSettingTable(knex);
  await createVendorConfigTable(knex);
  await createModelPromptTable(knex);
  await createArtStyleTable(knex);
  await createProjectTable(knex);
  await createNovelTable(knex);
  await createEventTable(knex);
  await createEventChapterTable(knex);
  await createScriptTable(knex);
  await createStoryboardTable(knex);
  await createAssetsTable(knex);
  await createScriptAssetsTable(knex);
  await createAssets2StoryboardTable(knex);
  await createAssetsRole2AudioTable(knex);
  await createImageTable(knex);
  await createImageFlowTable(knex);
  await createVideoTable(knex);
  await createVideoTrackTable(knex);
  await createTasksTable(knex);
  await createMemoriesTable(knex);
  await createUsersTable(knex);

  console.log("PostgreSQL 数据库架构初始化完成");
}

async function createAgentDeployTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_agentDeploy", (table) => {
    table.increments("id").primary();
    table.string("key").notNullable().unique();
    table.string("name").notNullable();
    table.string("desc").nullable();
    table.string("model").nullable();
    table.string("modelName").nullable();
    table.integer("vendorId").nullable();
    table.integer("type").defaultTo(1); // 1: 本地 2: 云端
    table.integer("temperature").defaultTo(1);
    table.integer("maxOutputTokens").defaultTo(0);
    table.boolean("disabled").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createSkillListTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_skillList", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").nullable();
    table.text("content").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createSkillAttributionTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_skillAttribution", (table) => {
    table.increments("id").primary();
    table.integer("skillId").notNullable();
    table.string("type").notNullable();
    table.string("value").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

async function createPromptTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_prompt", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable().unique();
    table.string("name").nullable();
    table.text("data").nullable();
    table.text("useData").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createSettingTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_setting", (table) => {
    table.increments("id").primary();
    table.string("key").notNullable().unique();
    table.text("value").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createVendorConfigTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_vendorConfig", (table) => {
    table.string("id").primary();
    table.text("inputValues").nullable();
    table.text("models").nullable();
    table.integer("enable").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createModelPromptTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_modelPrompt", (table) => {
    table.increments("id").primary();
    table.string("modelId").notNullable();
    table.string("type").notNullable();
    table.text("prompt").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createArtStyleTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_artStyle", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("prompt").nullable();
    table.string("imagePath").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createProjectTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_project", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("describe").nullable();
    table.integer("novelId").nullable();
    table.integer("artStyleId").nullable();
    table.text("customPrompt").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createNovelTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_novel", (table) => {
    table.increments("id").primary();
    table.integer("projectId").notNullable();
    table.string("name").nullable();
    table.text("content").nullable();
    table.integer("parentId").nullable();
    table.integer("level").defaultTo(1); // 1: 卷 2: 章 3: 节
    table.integer("order").defaultTo(0);
    table.integer("eventState").defaultTo(0); // -1: 失败 0: 进行中 1: 完成
    table.text("errorReason").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createEventTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_event", (table) => {
    table.increments("id").primary();
    table.integer("novelId").notNullable();
    table.string("name").nullable();
    table.text("content").nullable();
    table.integer("order").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createEventChapterTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_eventChapter", (table) => {
    table.increments("id").primary();
    table.integer("eventId").notNullable();
    table.string("name").nullable();
    table.text("content").nullable();
    table.integer("order").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createScriptTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_script", (table) => {
    table.increments("id").primary();
    table.integer("novelId").notNullable();
    table.string("name").nullable();
    table.text("content").nullable();
    table.integer("order").defaultTo(0);
    table.integer("extractState").defaultTo(0); // -1: 失败 0: 进行中 1: 完成
    table.text("errorReason").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createStoryboardTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_storyboard", (table) => {
    table.increments("id").primary();
    table.integer("scriptId").notNullable();
    table.text("content").nullable();
    table.string("track").nullable();
    table.integer("duration").defaultTo(3);
    table.string("state").defaultTo("待生成"); // 待生成/生成中/生成完成/生成失败
    table.text("reason").nullable();
    table.text("prompt").nullable();
    table.integer("imageId").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createAssetsTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_assets", (table) => {
    table.increments("id").primary();
    table.integer("projectId").notNullable();
    table.string("name").notNullable();
    table.string("type").notNullable(); // role/scene/tool
    table.text("describe").nullable();
    table.text("prompt").nullable();
    table.string("promptState").defaultTo("待生成"); // 待生成/生成中/生成完成/生成失败
    table.text("promptErrorReason").nullable();
    table.string("imagePath").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createScriptAssetsTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_scriptAssets", (table) => {
    table.increments("id").primary();
    table.integer("scriptId").notNullable();
    table.integer("assetsId").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

async function createAssets2StoryboardTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_assets2Storyboard", (table) => {
    table.increments("id").primary();
    table.integer("assetsId").notNullable();
    table.integer("storyboardId").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

async function createAssetsRole2AudioTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_assetsRole2Audio", (table) => {
    table.increments("id").primary();
    table.integer("assetsId").notNullable();
    table.string("audioPath").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

async function createImageTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_image", (table) => {
    table.increments("id").primary();
    table.integer("projectId").notNullable();
    table.string("type").nullable();
    table.string("state").defaultTo("待生成"); // 待生成/生成中/生成完成/生成失败
    table.text("errorReason").nullable();
    table.string("imagePath").nullable();
    table.text("prompt").nullable();
    table.integer("width").nullable();
    table.integer("height").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createImageFlowTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_imageFlow", (table) => {
    table.increments("id").primary();
    table.integer("imageId").notNullable();
    table.string("flowType").nullable();
    table.text("data").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

async function createVideoTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_video", (table) => {
    table.increments("id").primary();
    table.integer("projectId").notNullable();
    table.integer("scriptId").nullable();
    table.integer("storyboardId").nullable();
    table.string("state").defaultTo("待生成"); // 待生成/生成中/生成完成/生成失败
    table.text("errorReason").nullable();
    table.string("videoPath").nullable();
    table.text("prompt").nullable();
    table.integer("duration").nullable();
    table.integer("width").nullable();
    table.integer("height").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createVideoTrackTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_videoTrack", (table) => {
    table.increments("id").primary();
    table.integer("videoId").notNullable();
    table.integer("trackIndex").notNullable();
    table.integer("order").defaultTo(0);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

async function createTasksTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_tasks", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable();
    table.integer("relatedId").nullable();
    table.string("state").defaultTo("pending"); // pending/running/completed/failed
    table.text("errorReason").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

async function createMemoriesTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("memories", (table) => {
    table.increments("id").primary();
    table.string("agentId").notNullable();
    table.text("content").notNullable();
    table.jsonb("metadata").nullable();
    table.decimal("score", 10, 2).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Vector embedding (需要 pgvector 扩展)
    // table.specificType("embedding", "vector(384)").nullable();
  });
}

async function createUsersTable(knex: Knex) {
  await knex.schema.createTableIfNotExists("o_user", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.string("email").nullable();
    table.string("avatar").nullable();
    table.integer("role").defaultTo(1); // 1: 普通用户 2: 管理员
    table.boolean("disabled").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

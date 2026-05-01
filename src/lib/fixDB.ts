import path from "path";
import fs from "fs";
import { Knex } from "knex";
import { transform } from "sucrase";
import rawVendorData from "./vendor.json";
import getPath from "@/utils/getPath";
import vm from "@/utils/vm";
import { v4 as uuidv4 } from "uuid";

const vendorData = rawVendorData as Record<string, string>;

export default async (knex: Knex): Promise<void> => {
  const db = knex;

  // 延迟加载 vendor 工具以避免循环依赖
  const vendorUtils = await import("@/utils/vendor");
  const addColumn = async (table: string, column: string, type: string) => {
    if (!(await knex.schema.hasTable(table))) return;
    if (!(await knex.schema.hasColumn(table, column))) {
      await knex.schema.alterTable(table, (t) => (t as any)[type](column));
    }
  };

  const dropColumn = async (table: string, column: string) => {
    if (!(await knex.schema.hasTable(table))) return;
    if (await knex.schema.hasColumn(table, column)) {
      await knex.schema.alterTable(table, (t) => t.dropColumn(column));
    }
  };

  const alterColumnType = async (table: string, column: string, type: string) => {
    if (!(await knex.schema.hasTable(table))) return;
    if (await knex.schema.hasColumn(table, column)) {
      await knex.schema.alterTable(table, (t) => {
        (t as any)[type](column).alter();
      });
    }
  };
  // 清理已删除的供应商数据库记录（必须在查询 data 之前执行）
  await knex("o_vendorConfig").where("id", "qwen2api-video").del();
  await knex("o_vendorConfig").where("id", "null").del();
  // 同时删除本地文件
  const rootDir = getPath("vendor");
  const filesToDelete = ["qwen2api-video.ts", "null.ts"];
  for (const file of filesToDelete) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // 添加 o_storyboard.projectId 字段
  await addColumn("o_storyboard", "projectId", "integer");
  // 添加 o_storyboard.shouldGenerateImage 字段
  await addColumn("o_storyboard", "shouldGenerateImage", "integer");
  // 添加 o_storyboard.videoDesc 字段
  await addColumn("o_storyboard", "videoDesc", "text");
  // 添加 o_storyboard.trackId 字段
  await addColumn("o_storyboard", "trackId", "integer");
  // 添加 o_storyboard.filePath 字段
  await addColumn("o_storyboard", "filePath", "string");
  // 添加 o_storyboard.index 字段
  await addColumn("o_storyboard", "index", "integer");
  // 添加 o_storyboard.flowId 字段
  await addColumn("o_storyboard", "flowId", "integer");

  // 添加 o_imageFlow.flowData 字段
  await addColumn("o_imageFlow", "flowData", "text");
  // 添加 o_assets.flowId 字段
  await addColumn("o_assets", "flowId", "integer");

  // 添加 o_videoTrack.scriptId 和 o_videoTrack.projectId 字段
  await addColumn("o_videoTrack", "scriptId", "integer");
  await addColumn("o_videoTrack", "projectId", "integer");
  // 添加 o_videoTrack.duration 字段
  await addColumn("o_videoTrack", "duration", "integer");
  // 添加 o_videoTrack.prompt 字段
  await addColumn("o_videoTrack", "prompt", "text");

  // 添加 o_video.videoTrackId 字段
  await addColumn("o_video", "videoTrackId", "integer");

  // 移除 o_videoTrack.videoId 和 o_videoTrack.trackIndex 的 NOT NULL 约束
  if ((knex.client as any).config?.client === "pg") {
    const hasVideoTrackTable = await knex.schema.hasTable("o_videoTrack");
    if (hasVideoTrackTable) {
      // 检查 videoId 是否有 NOT NULL 约束
      const videoIdColInfo = await knex.raw(`
        SELECT is_nullable FROM information_schema.columns
        WHERE table_name = 'o_videoTrack' AND column_name = 'videoId'
      `);
      if (videoIdColInfo.rows?.[0]?.is_nullable === "NO") {
        await knex.raw(`ALTER TABLE "o_videoTrack" ALTER COLUMN "videoId" DROP NOT NULL`);
      }
      // 检查 trackIndex 是否有 NOT NULL 约束
      const trackIndexColInfo = await knex.raw(`
        SELECT is_nullable FROM information_schema.columns
        WHERE table_name = 'o_videoTrack' AND column_name = 'trackIndex'
      `);
      if (trackIndexColInfo.rows?.[0]?.is_nullable === "NO") {
        await knex.raw(`ALTER TABLE "o_videoTrack" ALTER COLUMN "trackIndex" DROP NOT NULL`);
      }
    }

    // 移除 o_imageFlow.imageId 的 NOT NULL 约束（分镜编辑等场景下 imageId 可为空）
    const hasImageFlowTable = await knex.schema.hasTable("o_imageFlow");
    if (hasImageFlowTable) {
      const imageIdColInfo = await knex.raw(`
        SELECT is_nullable FROM information_schema.columns
        WHERE table_name = 'o_imageFlow' AND column_name = 'imageId'
      `);
      if (imageIdColInfo.rows?.[0]?.is_nullable === "NO") {
        await knex.raw(`ALTER TABLE "o_imageFlow" ALTER COLUMN "imageId" DROP NOT NULL`);
      }
    }
  }

  // 矫正因软件异常退出导致的状态不一致问题
  await db("o_novel").where("eventState", 0).update({
    eventState: -1,
    errorReason: "软件退出导致失败",
  });
  await db("o_script").where("extractState", 0).update({
    extractState: -1,
    errorReason: "软件退出导致失败",
  });
  await db("o_assets").where("promptState", "生成中").update({
    promptState: "生成失败",
    promptErrorReason: "软件退出导致失败",
  });
  await db("o_image").where("state", "生成中").update({
    state: "生成失败",
    errorReason: "软件退出导致失败",
  });
  await db("o_storyboard").where("state", "生成中").update({
    state: "生成失败",
    reason: "软件退出导致失败",
  });
  await db("o_video").where("state", "生成中").update({
    state: "生成失败",
    errorReason: "软件退出导致失败",
  });

  // 迁移 memories 表 id 列从 increments 到 string（PostgreSQL）
  if ((knex.client as any).config?.client === "pg") {
    const hasMemoriesTable = await knex.schema.hasTable("memories");
    if (hasMemoriesTable) {
      const colInfo = await knex.raw(`
        SELECT data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'memories' AND column_name = 'id'
      `);
      const isIntegerId = colInfo.rows?.[0]?.data_type === "integer";
      if (isIntegerId) {
        // 备份数据
        const rows = await knex("memories").select("*");
        const idMapping = rows.map((r: any) => ({ oldId: r.id, uuid: uuidv4() }));

        // 删除旧表重建
        await knex.schema.dropTable("memories");
        await knex.schema.createTable("memories", (table) => {
          table.string("id").primary();
          table.string("agentId").notNullable();
          table.string("isolationKey").nullable();
          table.string("type").nullable();
          table.string("role").nullable();
          table.string("name").nullable();
          table.text("content").notNullable();
          table.text("embedding").nullable();
          table.text("relatedMessageIds").nullable();
          table.boolean("summarized").defaultTo(false);
          table.jsonb("metadata").nullable();
          table.decimal("score", 10, 2).nullable();
          table.bigInteger("createTime").nullable();
          table.timestamp("created_at").defaultTo(knex.fn.now());
        });

        // 恢复数据，使用新的 UUID
        for (const row of rows) {
          const mapping = idMapping.find(m => m.oldId === row.id);
          await knex("memories").insert({
            ...row,
            id: mapping?.uuid,
            createTime: row.createTime ? BigInt(row.createTime) : null,
          });
        }
        console.log("memories 表 id 列已从 integer 迁移到 UUID");
      }
    }

    // 去除 o_script.novelId 的 NOT NULL 约束
    const hasScriptTable = await knex.schema.hasTable("o_script");
    if (hasScriptTable && await knex.schema.hasColumn("o_script", "novelId")) {
      const colInfo = await knex.raw(`
        SELECT is_nullable FROM information_schema.columns
        WHERE table_name = 'o_script' AND column_name = 'novelId'
      `);
      if (colInfo.rows?.[0]?.is_nullable === "NO") {
        await knex.raw(`ALTER TABLE "o_script" ALTER COLUMN "novelId" DROP NOT NULL`);
        console.log("o_script.novelId NOT NULL 约束已移除");
      }
    }

    // 创建 o_scriptNovelMap 表（如不存在），并回填历史数据
    const hasMapTable = await knex.schema.hasTable("o_scriptNovelMap");
    if (!hasMapTable) {
      await knex.schema.createTable("o_scriptNovelMap", (table) => {
        table.increments("id").primary();
        table.integer("scriptId").notNullable();
        table.integer("novelId").notNullable();
        table.integer("order").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
      console.log("o_scriptNovelMap 表已创建，开始回填历史数据...");

      // 对每个脚本，将其项目下所有章节写入关联表
      const scripts = await knex("o_script").select("id", "projectId");
      for (const script of scripts) {
        const novels = await knex("o_novel").where({ projectId: script.projectId }).orderBy("order").select("id");
        if (novels.length > 0) {
          await knex("o_scriptNovelMap").insert(
            novels.map((novel: any, index: number) => ({
              scriptId: script.id,
              novelId: novel.id,
              order: index,
            }))
          );
        }
      }
      console.log("o_scriptNovelMap 历史数据回填完成");
    }
  }

  // SQLite 模式下创建 memories 表（如果不存在）
  if ((knex.client as any).config?.client === "better-sqlite3") {
    const hasMemoriesTable = await knex.schema.hasTable("memories");
    if (!hasMemoriesTable) {
      await knex.schema.createTable("memories", (table) => {
        table.string("id").primary(); // UUID 字符串
        table.string("agentId").notNullable();
        table.string("isolationKey").nullable();
        table.string("type").nullable();
        table.string("role").nullable();
        table.string("name").nullable();
        table.text("content").notNullable();
        table.text("embedding").nullable();
        table.text("relatedMessageIds").nullable();
        table.boolean("summarized").defaultTo(false);
        table.json("metadata").nullable();
        table.decimal("score", 10, 2).nullable();
        table.bigInteger("createTime").nullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
      console.log("memories 表已创建（SQLite，UUID id）");
    }

    // 创建 o_scriptNovelMap 表（SQLite）
    const hasMapTableSqlite = await knex.schema.hasTable("o_scriptNovelMap");
    if (!hasMapTableSqlite) {
      await knex.schema.createTable("o_scriptNovelMap", (table) => {
        table.increments("id").primary();
        table.integer("scriptId").notNullable();
        table.integer("novelId").notNullable();
        table.integer("order").defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
      const scripts = await knex("o_script").select("id", "projectId");
      for (const script of scripts) {
        const novels = await knex("o_novel").where({ projectId: script.projectId }).orderBy("order").select("id");
        if (novels.length > 0) {
          await knex("o_scriptNovelMap").insert(
            novels.map((novel: any, index: number) => ({
              scriptId: script.id,
              novelId: novel.id,
              order: index,
            }))
          );
        }
      }
      console.log("o_scriptNovelMap 表已创建并回填（SQLite）");
    }
  }

  // 添加 o_assets 新字段
  await addColumn("o_assets", "imageId", "integer");
  await addColumn("o_assets", "assetsId", "integer");
  await addColumn("o_assets", "remark", "string");
  await addColumn("o_assets", "startTime", "bigInteger");
  // 修复 o_tasks.startTime 类型从 bigInteger 到 timestamptz
  if ((knex.client as any).config?.client === "pg") {
    const hasTasksTable = await knex.schema.hasTable("o_tasks");
    if (hasTasksTable && await knex.schema.hasColumn("o_tasks", "startTime")) {
      const colInfo = await knex.raw(`
        SELECT data_type FROM information_schema.columns
        WHERE table_name = 'o_tasks' AND column_name = 'startTime'
      `);
      if (colInfo.rows?.[0]?.data_type === "bigint") {
        await knex.raw(`ALTER TABLE "o_tasks" ALTER COLUMN "startTime" TYPE TIMESTAMPTZ USING to_timestamp("startTime" / 1000.0)`);
      }
    }
    // 修复 o_tasks.model 类型从 varchar(255) 到 text
    if (hasTasksTable && await knex.schema.hasColumn("o_tasks", "model")) {
      const modelColInfo = await knex.raw(`
        SELECT data_type, character_maximum_length FROM information_schema.columns
        WHERE table_name = 'o_tasks' AND column_name = 'model'
      `);
      const modelCol = modelColInfo.rows?.[0];
      if (modelCol?.data_type === "character varying" && modelCol?.character_maximum_length === 255) {
        await knex.raw(`ALTER TABLE "o_tasks" ALTER COLUMN "model" TYPE TEXT`);
      }
    }
    // 修复 o_tasks.describe 类型从 varchar(255) 到 text
    if (hasTasksTable && await knex.schema.hasColumn("o_tasks", "describe")) {
      const describeColInfo = await knex.raw(`
        SELECT data_type, character_maximum_length FROM information_schema.columns
        WHERE table_name = 'o_tasks' AND column_name = 'describe'
      `);
      const describeCol = describeColInfo.rows?.[0];
      if (describeCol?.data_type === "character varying" && describeCol?.character_maximum_length === 255) {
        await knex.raw(`ALTER TABLE "o_tasks" ALTER COLUMN "describe" TYPE TEXT`);
      }
    }
    // 修复 o_tasks.relatedObjects 类型从 varchar(255) 到 text
    if (hasTasksTable && await knex.schema.hasColumn("o_tasks", "relatedObjects")) {
      const relatedObjectsColInfo = await knex.raw(`
        SELECT data_type, character_maximum_length FROM information_schema.columns
        WHERE table_name = 'o_tasks' AND column_name = 'relatedObjects'
      `);
      const relatedObjectsCol = relatedObjectsColInfo.rows?.[0];
      if (relatedObjectsCol?.data_type === "character varying" && relatedObjectsCol?.character_maximum_length === 255) {
        await knex.raw(`ALTER TABLE "o_tasks" ALTER COLUMN "relatedObjects" TYPE TEXT`);
      }
    }
  } else {
    await alterColumnType("o_tasks", "startTime", "timestamp");
    await alterColumnType("o_tasks", "model", "text");
    await alterColumnType("o_tasks", "describe", "text");
    await alterColumnType("o_tasks", "relatedObjects", "text");
  }
  // 添加 o_image 新字段
  await addColumn("o_image", "filePath", "string");
  await addColumn("o_image", "model", "string");
  await addColumn("o_image", "resolution", "string");
  await addColumn("o_image", "assetsId", "integer");
  // 添加 o_assetsRole2Audio 新字段
  const hasAssetsRole2Audio = await knex.schema.hasTable("o_assetsRole2Audio");
  if (hasAssetsRole2Audio) {
    const hasAssetsRoleId = await knex.schema.hasColumn("o_assetsRole2Audio", "assetsRoleId");
    const hasAssetsId = await knex.schema.hasColumn("o_assetsRole2Audio", "assetsId");
    if (hasAssetsId && !hasAssetsRoleId) {
      // 重命名 assetsId 为 assetsRoleId
      if ((knex.client as any).config?.client === "pg") {
        await knex.raw(`ALTER TABLE "o_assetsRole2Audio" RENAME COLUMN "assetsId" TO "assetsRoleId"`);
      } else {
        await knex.schema.alterTable("o_assetsRole2Audio", (t) => {
          t.renameColumn("assetsId", "assetsRoleId");
        });
      }
    } else if (!hasAssetsId && !hasAssetsRoleId) {
      await addColumn("o_assetsRole2Audio", "assetsRoleId", "integer");
    }
    await addColumn("o_assetsRole2Audio", "assetsAudioId", "integer");
  }
  // 添加新字段
  await addColumn("o_prompt", "useData", "text");
  // 添加新字段
  await addColumn("o_agentDeploy", "type", "string");
  // 添加新字段
  await addColumn("o_agentDeploy", "temperature", "integer");
  // 添加新字段
  await addColumn("o_agentDeploy", "maxOutputTokens", "integer");
  // 迁移 o_agentDeploy.vendorId 从 integer 到 string（PostgreSQL 需要显式 USING 子句）
  if ((knex.client as any).config?.client === "pg") {
    if (await knex.schema.hasColumn("o_agentDeploy", "vendorId")) {
      const colInfo = await knex.raw(`SELECT data_type FROM information_schema.columns WHERE table_name = 'o_agentDeploy' AND column_name = 'vendorId'`);
      if (colInfo.rows?.[0]?.data_type === "integer") {
        await knex.raw(`ALTER TABLE "o_agentDeploy" ALTER COLUMN "vendorId" TYPE VARCHAR USING "vendorId"::VARCHAR`);
      }
    }
  }
  await addColumn("o_assets", "audioBindState", "integer");

  //添加数据高级配置
  const advancedAgentList = [
    { key: "scriptAgent:decisionAgent", name: "剧本Agent:决策层", desc: "决策层" },
    { key: "scriptAgent:supervisionAgent", name: "剧本Agent:监督层", desc: "监督层" },
    { key: "scriptAgent:storySkeletonAgent", name: "剧本Agent:故事骨架", desc: "故事骨架生成" },
    { key: "scriptAgent:adaptationStrategyAgent", name: "剧本Agent:改编策略", desc: "改编策略生成" },
    { key: "scriptAgent:scriptAgent", name: "剧本Agent:剧本生成", desc: "剧本生成" },
    { key: "productionAgent:decisionAgent", name: "生产Agent:决策层", desc: "决策层" },
    { key: "productionAgent:supervisionAgent", name: "生产Agent:监督层", desc: "监督层" },
    { key: "productionAgent:deriveAssetsAgent", name: "生产Agent:衍生资产", desc: "衍生资产" },
    { key: "productionAgent:generateAssetsAgent", name: "生产Agent:生成资产", desc: "生成资产" },
    { key: "productionAgent:directorPlanAgent", name: "生产Agent:导演规划", desc: "导演规划" },
    { key: "productionAgent:storyboardGenAgent", name: "生产Agent:分镜生成", desc: "分镜生成" },
    { key: "productionAgent:storyboardPanelAgent", name: "生产Agent:分镜面板", desc: "分镜面板生成" },
    { key: "productionAgent:storyboardTableAgent", name: "生产Agent:分镜表格", desc: "分镜表格生成" },
  ];
  for (const agent of advancedAgentList) {
    const exists = await db("o_agentDeploy").where("key", agent.key).select("*").first();
    if (!exists) {
      await db("o_agentDeploy").insert({
        model: "",
        modelName: "",
        vendorId: null,
        key: agent.key,
        name: agent.name,
        desc: agent.desc,
        temperature: 1,
        maxOutputTokens: 0,
        disabled: false,
      });
    }
  }
  //矫正提示词 - 使用 insert ... onConflict 确保表中一定有默认数据
  const defaultPrompts = [
    {
      type: "eventExtraction",
      name: "事件提取",
      data: `请根据小说章节内容，提取出该章节中发生的核心事件。

要求：
1. 事件描述简洁明了，50-100 字
2. 包含事件的主要参与者（角色名称）
3. 包含事件的核心动作和结果
4. 按时间顺序描述事件发展

输出格式：
【事件名称】+【事件描述】

示例：
【萧炎退婚】萧炎前往云岚宗，在纳兰嫣然的退婚仪式上签下三年之约，发誓三年后上云岚宗击败纳兰嫣然。`,
    },
    {
      type: "scriptAssetExtraction",
      name: "剧本资产提取",
      data: `---\nname: universal_agent\ndescription: 专注于从剧本内容中提取所使用的资产（角色、场景、道具）并生成结构化资产列表的助手。\n---\n\n# Script Assets Extract\n\n你是一个专业的剧本内容分析助手，专注于从剧本文本中识别和提取所有涉及的资产（角色、场景、道具），并为每项资产生成可供下游制作流程使用的结构化描述和提示词。\n\n## 何时使用\n\n用户提供剧本内容，你需要逐段阅读并提取其中涉及的所有资产（人物角色、场景地点、道具物件），输出为结构化的资产列表。产出的资产描述将用于后续 AI 图片生成和制作流程。\n\n## 与系统的对应关系\n\n- 资产类型：\n  - \`role\` — 角色（对应 \`o_assets.type = "role"\`）\n  - \`scene\` — 场景（对应 \`o_assets.type = "scene"\`）\n  - \`tool\` — 道具（对应 \`o_assets.type = "tool"\`）\n- 下游用途：资产提示词生成 → AI 资产图生成 → 分镜制作\n\n## 输出要求\n\n**必须通过调用 \`resultTool\` 工具返回结果**，禁止以纯文本、Markdown 表格或 JSON 代码块等形式直接输出资产列表。\n\`resultTool\` 的 schema 会对字段类型和枚举值做强校验，调用时请严格按照下方字段定义填写，确保数据结构正确、字段完整、类型匹配。\n\n每个资产对象包含以下字段：\n\n| 字段 | 类型 | 必填 | 说明 |\n| ---- | ---- | ---- | ---- |\n| \`name\` | string | 是 | 资产名称，使用剧本中的原始称呼，不做其他多余描述 |\n| \`desc\` | string | 是 | 资产描述，30-80 字的视觉化描述 |\n| \`prompt\` | string | 是 | 生成提示词，英文，用于 AI 图片生成 |\n| \`type\` | enum | 是 | 资产类型：\`role\` / \`scene\` / \`tool\`  |\n\n## 提取规则\n\n### 角色（role）\n\n- 提取剧本中出现的所有有名字的角色\n- \`desc\`：包含性别、外貌特征、服饰风格、体态气质等视觉要素，需在描述开头明确标注角色性别（如"男性，……"或"女性，……"）\n- \`prompt\`：英文提示词，描述角色的外观特征，需以性别词开头（如 \`a young man, ...\` 或 \`a young woman, ...\`），适用于 AI 角色图生成\n- 同一角色有多个称呼时，取最常用的作为 \`name\`\n- 无名龙套（如"路人甲"、"士兵"）可跳过，除非其造型对剧情有重要视觉意义\n\n### 场景（scene）\n\n- 提取剧本中出现的所有场景/地点\n- \`desc\`：包含空间结构、光照氛围、关键陈设、色调基调等视觉要素\n- \`prompt\`：英文提示词，描述场景的整体视觉风格，适用于 AI 场景图生成\n- 同一场景的不同状态（如白天/夜晚）不重复提取，在 \`desc\` 中注明即可\n\n### 道具（tool）\n\n- 提取剧本中出现的重要道具/物品\n- \`desc\`：包含外观形状、颜色材质、尺寸参考、特殊效果等视觉要素\n- \`prompt\`：英文提示词，描述道具的外观细节，适用于 AI 道具图生成\n- 仅提取有独立视觉意义或剧情功能的道具，通用物品可跳过\n\n\n## 提示词（prompt）生成规范\n\n- 采用逗号分隔的关键词/短语格式\n- 优先描述**视觉特征**，避免抽象概念\n- 包含风格关键词（如 anime style, manga style 等，根据项目风格决定）\n- 角色 prompt 示例：\`a young man, sharp eyebrows, black hair, pale skin, wearing a gray Taoist robe, slender build, cold expression\`\n- 场景 prompt 示例：\`dark cave interior, glowing crystals on walls, misty atmosphere, dim blue lighting, stone altar in center\`\n- 道具 prompt 示例：\`ancient jade pendant, oval shape, translucent green, carved dragon pattern, glowing faintly\`\n\n## 提取流程\n\n1. 通读剧本全文，识别所有出现的角色、场景、道具\n2. 对每个资产生成结构化的 \`name\`、\`desc\`、\`prompt\`、\`type\`\n3. 去重：同一资产不重复提取\n4. **必须通过调用 \`resultTool\` 工具输出完整资产列表**，不要分多次调用，一次性将所有资产放入 \`assetsList\` 数组中提交\n\n## 提取原则\n\n1. **忠于剧本**：所有提取基于剧本中的实际内容，不臆造未出现的资产\n2. **视觉优先**：描述和提示词聚焦视觉特征，便于 AI 图片生成\n3. **精简实用**：只提取对制作有实际意义的资产，避免过度提取\n4. **分类准确**：严格按照 role/scene/tool 分类，不混淆\n5. **提示词质量**：英文提示词应具体、可执行，能直接用于 AI 图片生成\n\n## 注意事项\n\n- 资产列表中**不要包含剧本内容本身**，仅提取所使用到的资产\n- 角色的随身物品如果有独立剧情功能，应单独作为道具提取\n- 场景中的固定陈设不需要单独提取为道具，除非该物件有独立剧情作用`,
    },
    {
      type: "videoPromptGeneration",
      name: "视频提示词生成",
      data: `# 视频提示词生成 Skill\n\n你是**视频提示词生成 Agent**，专门负责根据指定的 AI 视频模型，读取分镜信息并输出该模型对应格式的视频提示词。\n\n---\n\n## 输入格式\n\n### 1. 模型与模式（必选）\n\n\n#### 模式路由规则\n\n| 条件 | 匹配模式 | 说明 |\n|------|----------|------|\n| 模型名为 \`seedance-2-0\` + \`多参：是\` / \`seedance 2.0\` + \`多参：是\` / \`即梦 2.0\` + \`多参：是\` | **seedance-2-0*，不包含其他版本比如 seedance-1-5/seedance-1-0 | 支持角色/场景/分镜图多参引用 |\n| 模型名为 \`Wan2.6\` / \`wan 2.6\` / \`万象 2.6\` | **Wan 2.6** | 固定模式，单图（首帧）+ 叙事文本，无尾帧 |\n| 其他任何模型 + \`多参：是\` | **通用多参模式** | 支持角色/场景/分镜图多参引用 |\n| 其他任何模型/seedance-1-5/seedance-1-0 + \`多参：否\` | **通用首尾帧模式** | 首帧/首尾帧 + 纯文本描述 |\n\n> 模型名仅用于记录，实际提示词格式由匹配到的模式决定。Seedance 2.0 和 Wan 2.6 是指定模型名即确定模式的特例。`,
    },
  ];

  for (const prompt of defaultPrompts) {
    const exists = await db("o_prompt").where("type", prompt.type).first();
    if (!exists) {
      await db("o_prompt").insert({
        ...prompt,
        useData: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      await db("o_prompt").where("type", prompt.type).update({
        data: prompt.data,
        name: prompt.name,
        updated_at: new Date(),
      });
    }
  }


  //迁移供应商函数
  const data = await knex("o_vendorConfig").select("*");
  for (const item of data) {
    let { id, code } = item;
    const filename = `${id}.ts`;
    const rootDir = getPath("vendor");
    if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir, { recursive: true });
    if (!fs.existsSync(path.join(rootDir, filename))) {
      // 仅从 vendor.json 恢复，不从数据库 code 字段恢复
      const vendorCode = vendorData[filename];
      if (vendorCode) {
        fs.writeFileSync(path.join(rootDir, filename), vendorCode);
      }
    }
  }
  const defList = Object.keys(vendorData).map((filename) => filename.replace(/\.ts$/, ""));
  const existingIds = data.map((i: any) => i.id);
  for (const id of defList) {
    if (!existingIds.includes(id)) {
      const tsCode = vendorData[`${id}.ts`];
      if (tsCode) await tempOnsert(knex, tsCode, vendorUtils);
    }
  }

  await dropColumn("o_vendorConfig", "author");
  await dropColumn("o_vendorConfig", "description");
  await dropColumn("o_vendorConfig", "name");
  await dropColumn("o_vendorConfig", "icon");
  await dropColumn("o_vendorConfig", "inputs");
  await dropColumn("o_vendorConfig", "createTime");

  const volcengineVer = await vendorUtils.getVendor("volcengine").version;
  if (Number(volcengineVer) < 2.3) {
    vendorUtils.writeCode("volcengine", vendorData["volcengine.ts"]);
  }
  const minimaxVer = await vendorUtils.getVendor("minimax").version;
  if (Number(minimaxVer) < 2.1) {
    vendorUtils.writeCode("minimax", vendorData["minimax.ts"]);
  }

  // 迁移 qwen2api 的 token 字段到 apiKey（不依赖 vendor.json，只要数据库中存在即处理）
  const vendorRow = await knex("o_vendorConfig").where("id", "qwen2api").first();
  if (vendorRow && vendorRow.inputValues) {
    const inputValues = JSON.parse(vendorRow.inputValues);
    if (inputValues.token && !inputValues.apiKey) {
      inputValues.apiKey = inputValues.token;
      delete inputValues.token;
      await knex("o_vendorConfig").where("id", "qwen2api").update({
        inputValues: JSON.stringify(inputValues),
      });
    }
  }
  // 更新 qwen2api vendor 代码到最新版本
  if (vendorData["qwen2api.ts"]) {
    const vendorVer = await vendorUtils.getVendor("qwen2api").version;
    if (Number(vendorVer) < 1.2) {
      vendorUtils.writeCode("qwen2api", vendorData["qwen2api.ts"]);
    }
  }
};

async function tempOnsert(knex: Knex, tsCode: string, vendorUtils: typeof import("@/utils/vendor")) {
  const jsCode = transform(tsCode, { transforms: ["typescript"] }).code;
  const exports = vm(jsCode);
  const vendor = exports.vendor;
  const data = await knex("o_vendorConfig").where("id", vendor.id).first();
  if (data) return;
  await knex("o_vendorConfig").insert({
    id: vendor.id,
    inputValues: JSON.stringify(vendor.inputValues ?? {}),
    models: JSON.stringify([]),
    enable: vendor.id == "toonflow" ? 1 : 0,
  });
  vendorUtils.writeCode(vendor.id, tsCode);
}

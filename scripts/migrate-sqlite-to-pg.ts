/**
 * SQLite → PostgreSQL 数据迁移脚本
 *
 * 用法:
 *   PG_HOST=localhost PG_DATABASE=toonflow PG_USER=postgres PG_PASSWORD=xxx tsx scripts/migrate-sqlite-to-pg.ts
 *
 * 说明:
 *   - 读取 data/db2.sqlite 中的所有表数据
 *   - 写入到 PostgreSQL 数据库（环境变量配置连接信息）
 *   - 幂等：每张表先清空再插入，可重复运行
 */

import Database from "better-sqlite3";
import knex from "knex";
import path from "path";
import fs from "fs";
import { initPgSchema } from "@/lib/initPg";

const BATCH_SIZE = 500;

// ─── SQLite 连接 ──────────────────────────────────────────────────────────────

const sqlitePath = path.resolve(process.cwd(), "data/db2.sqlite");
if (!fs.existsSync(sqlitePath)) {
  console.error(`[错误] SQLite 文件不存在: ${sqlitePath}`);
  process.exit(1);
}
const sqlite = new Database(sqlitePath, { readonly: true });
console.log(`[OK] 已连接 SQLite: ${sqlitePath}`);

// ─── PostgreSQL 连接 ──────────────────────────────────────────────────────────

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

// ─── 按依赖顺序排列的表列表 ────────────────────────────────────────────────────

const TABLE_ORDER = [
  "o_user",
  "o_setting",
  "o_vendorConfig",
  "o_agentDeploy",
  "o_skillList",
  "o_skillAttribution",
  "o_prompt",
  "o_modelPrompt",
  "o_artStyle",
  "o_project",
  "o_novel",
  "o_event",
  "o_eventChapter",
  "o_script",
  "o_assets",
  "o_scriptAssets",
  "o_image",
  "o_imageFlow",
  "o_storyboard",
  "o_assets2Storyboard",
  "o_assetsRole2Audio",
  "o_video",
  "o_videoTrack",
  "o_tasks",
  "memories",
  "o_agentWorkData",
];

// 这些字段在 SQLite 中存为 0/1 整数，PG 中需要转为 boolean
const BOOLEAN_FIELDS: Record<string, string[]> = {
  o_agentDeploy: ["disabled"],
  o_user: ["disabled"],
};

// 这些字段在 SQLite 中存为 JSON 字符串，PG 中为 jsonb，需要解析
const JSONB_FIELDS: Record<string, string[]> = {
  memories: ["metadata"],
};

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function getSqliteTables(): string[] {
  const rows = sqlite
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    )
    .all() as { name: string }[];
  return rows.map((r) => r.name);
}

function getSqliteRowCount(table: string): number {
  const row = sqlite.prepare(`SELECT COUNT(*) as cnt FROM "${table}"`).get() as { cnt: number };
  return row.cnt;
}

function convertRow(table: string, row: Record<string, unknown>): Record<string, unknown> {
  const result = { ...row };

  // boolean 转换
  const boolFields = BOOLEAN_FIELDS[table] || [];
  for (const field of boolFields) {
    if (field in result && result[field] !== null && result[field] !== undefined) {
      result[field] = result[field] === 1 || result[field] === true;
    }
  }

  // jsonb 转换（SQLite 中可能存的是字符串）
  const jsonFields = JSONB_FIELDS[table] || [];
  for (const field of jsonFields) {
    if (field in result && result[field] !== null && result[field] !== undefined) {
      const val = result[field];
      if (typeof val === "string") {
        try {
          result[field] = JSON.parse(val);
        } catch {
          // 解析失败保持原值
        }
      }
    }
  }

  return result;
}

async function ensureAgentWorkDataTable() {
  const exists = await pg.schema.hasTable("o_agentWorkData");
  if (!exists) {
    console.log("  [建表] o_agentWorkData (SQLite 独有表，PG 中补建)");
    await pg.schema.createTableIfNotExists("o_agentWorkData", (table) => {
      table.increments("id").primary();
      table.integer("projectId").nullable();
      table.integer("episodesId").nullable();
      table.string("key").nullable();
      table.text("data").nullable();
      table.timestamp("createTime").defaultTo(pg.fn.now());
      table.timestamp("updateTime").defaultTo(pg.fn.now());
    });
  }
}

async function migrateTable(table: string): Promise<{ sqlite: number; pg: number }> {
  const sqliteCount = getSqliteRowCount(table);
  if (sqliteCount === 0) {
    console.log(`  [跳过] ${table} — SQLite 中无数据`);
    return { sqlite: 0, pg: 0 };
  }

  // 清空 PG 目标表
  await pg(table).delete();

  let migrated = 0;
  let offset = 0;

  while (offset < sqliteCount) {
    const rows = sqlite
      .prepare(`SELECT * FROM "${table}" LIMIT ${BATCH_SIZE} OFFSET ${offset}`)
      .all() as Record<string, unknown>[];

    if (rows.length === 0) break;

    const converted = rows.map((row) => convertRow(table, row));
    await pg(table).insert(converted);

    migrated += rows.length;
    offset += rows.length;
    process.stdout.write(`\r  [迁移] ${table}: ${migrated}/${sqliteCount}`);
  }

  process.stdout.write("\n");

  const pgCount = await pg(table).count("* as cnt").first().then((r: any) => parseInt(r.cnt));
  return { sqlite: sqliteCount, pg: pgCount };
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n=== SQLite → PostgreSQL 数据迁移 ===\n");

  // 1. 测试 PG 连接
  try {
    await pg.raw("SELECT 1");
    console.log("[OK] 已连接 PostgreSQL");
  } catch (err) {
    console.error("[错误] 无法连接 PostgreSQL:", err);
    process.exit(1);
  }

  // 2. 初始化 PG 表结构（若已存在则跳过）
  console.log("\n[步骤 1] 检查 PG 表结构...");
  const hasTables = await pg.schema.hasTable("o_project");
  if (!hasTables) {
    console.log("  表不存在，开始建表...");
    await initPgSchema(pg);
  } else {
    console.log("  表结构已存在，跳过建表");
  }
  await ensureAgentWorkDataTable();

  // 3. 获取 SQLite 中实际存在的表
  const sqliteTables = getSqliteTables();
  console.log(`\n[步骤 2] SQLite 共有 ${sqliteTables.length} 张表: ${sqliteTables.join(", ")}`);

  // 4. 按顺序迁移数据
  console.log("\n[步骤 3] 开始迁移数据...\n");

  const report: { table: string; sqlite: number; pg: number; ok: boolean }[] = [];

  // 先迁移 TABLE_ORDER 中的表（按指定顺序）
  for (const table of TABLE_ORDER) {
    if (!sqliteTables.includes(table)) {
      console.log(`  [不存在] ${table} — SQLite 中不存在，跳过`);
      continue;
    }
    const counts = await migrateTable(table);
    report.push({ table, ...counts, ok: counts.sqlite === counts.pg });
  }

  // 迁移 TABLE_ORDER 中未涵盖的其他表
  const remaining = sqliteTables.filter((t) => !TABLE_ORDER.includes(t));
  for (const table of remaining) {
    console.log(`  [额外表] ${table}`);
    const hasPgTable = await pg.schema.hasTable(table);
    if (!hasPgTable) {
      console.log(`    [警告] PG 中不存在该表，跳过`);
      continue;
    }
    const counts = await migrateTable(table);
    report.push({ table, ...counts, ok: counts.sqlite === counts.pg });
  }

  // 5. 输出迁移报告
  console.log("\n=== 迁移报告 ===\n");
  console.log("表名".padEnd(30) + "SQLite".padEnd(12) + "PG".padEnd(12) + "状态");
  console.log("-".repeat(60));
  for (const row of report) {
    const status = row.ok ? "✓ OK" : `✗ 不一致 (差 ${Math.abs(row.sqlite - row.pg)})`;
    console.log(row.table.padEnd(30) + String(row.sqlite).padEnd(12) + String(row.pg).padEnd(12) + status);
  }

  const failed = report.filter((r) => !r.ok);
  console.log(`\n共迁移 ${report.length} 张表，${failed.length > 0 ? `${failed.length} 张表行数不一致` : "全部成功"}`);

  await pg.destroy();
  sqlite.close();
  console.log("\n[完成] 数据库连接已关闭");
}

main().catch((err) => {
  console.error("[致命错误]", err);
  process.exit(1);
});

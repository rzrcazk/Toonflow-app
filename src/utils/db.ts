import { readFile, writeFile } from "fs/promises";
import getPath from "@/utils/getPath";
import fs from "fs";
import path from "path";
import knex from "knex";
import fixDB from "@/lib/fixDB";
import type { DB } from "@/types/database";
import crypto from "crypto";

type TableName = keyof DB & string;
type RowType<TName extends TableName> = DB[TName];

// 数据库类型选择：支持 'sqlite' 或 'pg'
const DB_TYPE = process.env.DB_TYPE || "sqlite";

let db: any;

if (DB_TYPE === "pg") {
  // PostgreSQL 配置
  const pgConfig = {
    client: "pg",
    connection: {
      host: process.env.PG_HOST || "localhost",
      port: parseInt(process.env.PG_PORT || "5432"),
      database: process.env.PG_DATABASE || "toonflow",
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASSWORD || "postgres",
    },
    pool: {
      min: 2,
      max: 10,
    },
  };

  console.log("使用 PostgreSQL 数据库:", pgConfig.connection.database);
  db = knex(pgConfig);
} else {
  // SQLite 配置
  const dbPath = getPath("db2.sqlite");
  console.log("数据库目录:", dbPath);
  const dbDir = path.dirname(dbPath);

  // 确保数据库目录存在
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // 创建空数据库文件
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
  }

  db = knex({
    client: "better-sqlite3",
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  });
}

(async () => {
  // PostgreSQL 模式下，首次运行需要初始化表结构
  if (DB_TYPE === "pg") {
    const hasTables = await db.schema.hasTable("o_project");
    if (!hasTables) {
      console.log("未检测到现有表结构，开始初始化 PostgreSQL 架构...");
      const { initPgSchema } = await import("@/lib/initPg");
      await initPgSchema(db);
    }

    console.log("PostgreSQL 日期类型使用默认 ISO 字符串格式");
  }

  await fixDB(db);
  if (process.env.NODE_ENV == "dev") initKnexType(db);
})();

// 创建数据库客户端函数
function createDbClient(dbInstance: any) {
  const client = function<TName extends TableName>(table: TName) {
    return dbInstance<RowType<TName>, RowType<TName>[]>(table);
  };
  client.schema = dbInstance.schema;
  client.raw = dbInstance.raw.bind(dbInstance);
  client.destroy = dbInstance.destroy.bind(dbInstance);
  return client;
}

const dbClient = createDbClient(db);
export default dbClient;

export { db };

async function initKnexType(knexDb: any) {
  const { Client } = await import("@rmp135/sql-ts");
  const outFile = "src/types/database.d.ts";
  const dbClient = Client.fromConfig({
    interfaceNameFormat: "${table}",
    typeMap: {
      number: ["bigint"],
      string: ["text", "varchar", "char"],
    },
  }).fetchDatabase(knexDb);
  const declarations = await dbClient.toTypescript();
  const dbObject = await dbClient.toObject();
  const customHeader = `//该文件由脚本自动生成，请勿手动修改`;
  // 清除上次的注释头
  let declBody = declarations.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
  declBody = declBody.replace(/(\n\s*)\/\*([^*][\s\S]*?)\*\//g, "$1/**$2*/");
  const tableInterfaces = dbObject.schemas.flatMap((schema) => schema.tables.map((table) => table.interfaceName));
  const aggregateTypes = `
export interface DB {
${tableInterfaces.map((name) => `  ${JSON.stringify(name)}: ${name};`).join("\n")}
}
`;
  // 哈希仅基于结构化信息，header和空格不算
  const hashSource = JSON.stringify({
    tableInterfaces,
    declBody,
  });
  const hash = crypto.createHash("md5").update(hashSource).digest("hex");
  // 文件内容
  const content = `// @db-hash ${hash}\n${customHeader}\n\n` + declBody + aggregateTypes;
  let needWrite = true;
  try {
    const current = await readFile(outFile, "utf8");
    // 文件头已存在相同 hash，不需要写
    const match = current.match(/^\/\/\s*@db-hash\s*([a-zA-Z0-9]+)\n/);
    const currentHash = match ? match[1] : null;
    if (currentHash === hash) {
      needWrite = false;
    }
  } catch (err) {
    needWrite = true;
  }
  if (needWrite) await writeFile(outFile, content, "utf8");
}

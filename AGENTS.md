# Toonflow 后端开发指南

Express + TypeScript 后端，短剧/漫剧 AI 工具。

**当前版本**: 1.1.6
**当前分支**: `feature/animal-science-video`
**开发分支**: `develop`
**生产分支**: `master`

## 目录结构

```
toonflow-app/
├── src/
│   ├── agents/           # AI Agent 模块（productionAgent / scriptAgent）
│   ├── lib/              # 公共库
│   ├── middleware/       # 中间件
│   ├── routes/           # 路由模块
│   ├── socket/           # WebSocket 实时通信
│   ├── types/            # 类型声明
│   ├── utils/            # 工具函数
│   ├── app.ts            # 应用入口
│   ├── core.ts           # 核心初始化
│   ├── env.ts            # 环境变量
│   ├── err.ts            # 错误处理
│   ├── logger.ts         # 日志
│   ├── router.ts         # 路由注册
│   └── utils.ts          # 通用工具
├── data/                 # 运行时数据（oss/assets/models/skills/vendor）
├── scripts/              # 辅助脚本
├── build/                # 编译产物
├── build.sh              # 后端构建脚本（变化检测 + Docker build）
├── package.json
├── tsconfig.json
└── electron-builder.yml
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 运行时 | Node.js 23.11.1+ |
| 语言 | TypeScript 5.x |
| 后端框架 | Express 5 |
| 数据库 | SQLite / PostgreSQL (knex) |
| AI 集成 | Vercel AI SDK (OpenAI / Anthropic / Google / DeepSeek / 智谱 / MiniMax / 通义千问 / xAI) |
| 本地推理 | @huggingface/transformers (ONNX) |
| 实时通信 | Socket.IO |
| 桌面客户端 | Electron 40 |
| 图像处理 | Sharp |
| 包管理器 | Yarn |

## 开发命令

```bash
# 安装依赖
yarn install

# 启动开发环境（仅后端 API）
yarn dev    # 带 inspect，端口 10588

# Electron 桌面客户端
yarn dev:gui

# 生产模式
yarn start

# 编译 TypeScript
yarn build

# 代码检查
yarn lint

# Electron 打包
yarn dist
yarn dist:win
yarn dist:mac
yarn dist:linux

# AI 调试面板
yarn debug:ai
```

## Docker 构建

构建脚本位于同级目录的 `build.sh`，会自动检测源码变化，无变化时跳过 rebuild。

```bash
./build.sh    # 变化检测 + Docker build
```

Docker 配置在 `../toonflow-docker/` 目录，见该处 `docker-compose.yml` 和 `Dockerfile.*`。

## 同步上游

```bash
./scripts/sync-upstream.sh
```

自动拉取 HBAI-Ltd/Toonflow-app/develop 最新代码，定制代码会保留。

手动同步：
```bash
git fetch upstream && git merge upstream/develop
git log upstream/develop..HEAD    # 查看自己的定制
```

### Git Remote 配置

```bash
origin          → 你的 fork（rzrcazk/Toonflow-app）
upstream        → 官方上游（HBAI-Ltd/Toonflow-app）
upstream-web    → 前端上游（HBAI-Ltd/Toonflow-web）
```

## 环境变量

```bash
NODE_ENV=dev
PORT=10588

# 数据库
DB_TYPE=sqlite          # 或 pg
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=toonflow
PG_USER=postgres
PG_PASSWORD=postgres

# AI API Key
OPENAI_API_KEY
ANTHROPIC_API_KEY
GOOGLE_API_KEY
DEEPSEEK_API_KEY
ZHIPU_API_KEY
MINIMAX_API_KEY
QWEN_API_KEY
XAI_API_KEY
```

## 测试账号

首次启动默认：admin / admin123

## 调试

```bash
yarn dev        # 后端调试
yarn debug:ai   # AI SDK 可视化调试工具
```

日志通过 `logger.ts` 模块统一管理，输出到控制台。

## 常见问题

- **macOS 证书问题**：设置 → 隐私与安全性
- **端口占用**：修改 PORT 或关闭占用 10588 的进程
- **依赖安装失败**：确保 Node.js >= 23.11.1，使用 Yarn
- **PostgreSQL**：需 14+，首次启动自动创建表结构
- **SQLite/PG 切换**：不能同时使用，数据需要迁移

## 许可证

Apache-2.0，详见 [LICENSE](./LICENSE)。

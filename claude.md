# Toonflow 项目开发指南

## 项目概述

Toonflow 是一款 AI 短剧漫剧工具，能够利用 AI 技术将小说自动转化为剧本，并结合 AI 生成的图片和视频，实现高效的短剧创作。

**当前版本**: 1.1.6
**当前分支**: `feature/animal-science-video`
**开发分支**: `develop`
**生产分支**: `master`（不接受直接 PR）

---

## 工作目录说明（重要）

**本目录（`/Volumes/juanshen/github/Toonflow-app/`）是唯一的工作目录**，前后端源码、Docker 配置、运行时数据都在这里。

| 目录/文件 | 用途 |
|-----------|------|
| `packages/web/` | 前端源码（Vue/Vite，git subtree 合并自 Toonflow-web） |
| `src/` | 后端源码（Express/TypeScript） |
| `data/` | 运行时持久化数据（OSS 素材、模型、技能、vendor 配置等） |
| `infra/` | Docker 多阶段构建 + compose 编排 |
| `docker-compose.yml` | 一键构建 + 启动入口 |

**不需要关心其他目录**。改完代码后直接 `docker compose -f infra/docker-compose.yml up --build -d` 即可。

### 日常开发

```bash
# 改前后端代码 → 重启容器生效（自动构建前端 + 后端）
docker compose -f infra/docker-compose.yml up --build -d
```

### 同步上游最新代码

```bash
./scripts/sync-upstream.sh
```

自动拉取后端（HBAI-Ltd/Toonflow-app/develop）和前端（HBAI-Ltd/Toonflow-web/master）最新代码，你的定制代码会保留。

### 后端本地调试（不启动容器）

```bash
yarn install
yarn dev    # 带 inspect，端口 10588
```

---

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

---

## 开发命令

```bash
# 安装依赖
yarn install

# 启动开发环境（仅后端 API）
yarn dev

# 启动 Electron 桌面客户端（后端 + GUI）
yarn dev:gui

# 生产模式启动（需先 build）
yarn start

# 编译 TypeScript
yarn build

# 代码检查
yarn lint

# 打包发布
yarn dist          # 所有平台
yarn dist:win      # Windows
yarn dist:mac      # macOS
yarn dist:linux    # Linux

# AI 调试面板
yarn debug:ai

# === Monorepo 专用命令 ===

# Docker 一键构建 + 启动
docker compose -f infra/docker-compose.yml up --build -d

# 停止容器
docker compose -f infra/docker-compose.yml down

# 同步上游最新代码
./scripts/sync-upstream.sh
```

---

## 项目结构

```
Toonflow-app/
├── data/                  # 运行时数据
│   ├── models/           # 本地推理模型 (ONNX)
│   ├── oss/              # 对象存储 (素材/角色/场景)
│   ├── serve/            # 生产环境入口
│   ├── skills/           # Agent 技能提示词
│   └── web/              # 前端编译产物（Docker 构建时自动生成）
├── packages/
│   └── web/              # 前端源码（git subtree 合并自 Toonflow-web）
├── infra/                 # Docker 编排
│   ├── Dockerfile.multi-stage  # 多阶段构建（前端 build + 后端运行）
│   └── docker-compose.yml      # 服务编排
├── scripts/               # 构建与辅助脚本
│   └── sync-upstream.sh  # 同步上游最新代码
├── src/
│   ├── agents/           # AI Agent 模块
│   │   ├── productionAgent/   # 生产 Agent
│   │   └── scriptAgent/       # 剧本 Agent
│   ├── lib/              # 公共库
│   ├── middleware/       # 中间件
│   ├── routes/           # 路由模块 (19 个子模块)
│   ├── socket/           # WebSocket 实时通信
│   ├── types/            # TypeScript 类型声明
│   ├── utils/            # 工具函数
│   ├── app.ts            # 应用入口
│   ├── core.ts           # 核心初始化
│   ├── env.ts            # 环境变量处理
│   ├── err.ts            # 错误处理
│   ├── logger.ts         # 日志模块
│   ├── router.ts         # 路由注册
│   └── utils.ts          # 通用工具
├── docs/                  # 文档资源
├── build/                 # 编译产物
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── electron-builder.yml   # Electron 打包配置
└── Dockerfile             # Docker 构建文件（传统模式，兼容用）
```

---

## 核心功能模块

### 1. AI Agent 系统
- **ScriptAgent**: 负责小说改编为剧本
- **ProductionAgent**: 负责分镜、素材、视频生产

### 2. 三层 Agent 协作体系
- 决策层：任务规划与拆解
- 执行层：内容生成
- 监督层：质量审阅与修订反馈

### 3. 主要路由模块
- `agents/` - Agent 记忆管理
- `script/` - 剧本生成
- `production/` - 制作管理
- `cornerScape/` - 分镜管理
- `assets/` - 素材管理
- `assetsGenerate/` - 素材生成
- `novel/` - 小说管理
- `project/` - 项目管理
- `setting/` - 系统设置
- `modelSelect/` - 模型选择
- `login/` - 登录认证

---

## 开发规范

### Git 工作流
- ✅ **PR 提交到**: `develop` 分支
- ⛔ **不接受**: 直接提交到 `master` 分支

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 配置
- 提交前执行 `yarn lint` 检查

### 环境变量

**基本配置**：
- `NODE_ENV`: 运行环境 (dev | prod)
- `PORT`: 服务端口 (默认 10588)
- `OSSURL`: 文件存储访问地址

**数据库配置**：
```bash
# 数据库类型：sqlite 或 pg
DB_TYPE=sqlite

# PostgreSQL 配置（当 DB_TYPE=pg 时）
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=toonflow
PG_USER=postgres
PG_PASSWORD=postgres
```

**AI API Key**：
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `DEEPSEEK_API_KEY`
- `ZHIPU_API_KEY`
- `MINIMAX_API_KEY`
- `QWEN_API_KEY`
- `XAI_API_KEY`

---

## 测试账号

首次启动默认账号：
- **账号**: `admin`
- **密码**: `admin123`

---

## 调试技巧

### 后端调试
```bash
# 带 inspect 启动
yarn dev

# 访问 Chrome DevTools
chrome://inspect
```

### AI 调用调试
```bash
# 启动 AI SDK 可视化调试工具
yarn debug:ai
```

### 日志查看
日志输出在控制台，使用 `logger.ts` 模块统一管理。

---

## 常见问题

### 1. macOS 证书问题
到 **设置 → 隐私与安全性** 配置安全性。

### 2. 端口占用
修改 `PORT` 环境变量或关闭占用 10588 端口的进程。

### 3. 依赖安装失败
确保 Node.js 版本 ≥ 23.11.1，使用 Yarn 而非 npm。

### 4. PostgreSQL 数据库配置
1. 安装 PostgreSQL 14+
2. 创建数据库：`CREATE DATABASE toonflow;`
3. 设置 `.env` 文件中的 `DB_TYPE=pg` 和 PG_* 相关配置
4. 首次启动时会自动创建表结构

### 5. SQLite 与 PostgreSQL 切换
- 默认使用 SQLite（`DB_TYPE=sqlite`）
- 切换到 PostgreSQL：设置 `DB_TYPE=pg` 并配置连接参数
- 两种模式不能同时使用，数据需要迁移

---

## 相关仓库

| 仓库 | 说明 |
|------|------|
| [Toonflow-app](https://github.com/HBAI-Ltd/Toonflow-app) | 后端主仓库（本仓库），monorepo 包含前端源码 |
| [Toonflow-web](https://github.com/HBAI-Ltd/Toonflow-web) | 前端源码上游，通过 git subtree 合并到 `packages/web/` |

### Git Remote 配置

```bash
origin          → 你的 fork（rzrcazk/Toonflow-app）
upstream        → 官方上游（HBAI-Ltd/Toonflow-app）
upstream-web    → 前端上游（HBAI-Ltd/Toonflow-web）
```

### 同步上游工作流

```bash
# 一键同步后端 + 前端上游最新代码
./scripts/sync-upstream.sh

# 手动同步后端
git fetch upstream && git merge upstream/develop

# 手动同步前端
git fetch upstream-web && git subtree pull --prefix=packages/web upstream-web master --squash

# 查看自己的定制
git log upstream/develop..HEAD            # 后端定制
git log --oneline -- packages/web/        # 前端定制
```

---

## 联系与支持

- 📧 邮箱：ltlctools@outlook.com
- 💬 微信交流群：通过官方二维码加入
- 🌐 Discord: https://discord.gg/HEjKmpNpAZ

---

## 许可证

Apache-2.0 许可证，附有补充商业协议。详见 [LICENSE](./LICENSE) 文件。

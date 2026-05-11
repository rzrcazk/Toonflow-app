# jimeng-free-api-all-skill - CLAUDE.md

本文件为 Claude Code 在与此代码仓库工作时提供指导。

## 项目概述

Jimeng AI Free 服务支持即梦超强图像与视频生成能力，包含即梦 4.0 文生图等多款模型，提供文生图、图生图、视频生成功能（官方每日赠 66 积分，可生成 66 次），零配置部署且支持多路 token。 接口与 OpenAI 完全兼容，需从即梦官网获取 sessionid 作为 Authorization 的 Bearer Token，支持多账号接入。提供 Docker 部署方式及 dockerhub 镜像，可通过多种接口调用，包括对话补全、视频生成、图像生成（文生图、图生图）等，满足多样化生成需求。

**仓库地址:** https://github.com/rzrcazk/jimeng-free-api-all

**语言:** Node.js

## 快速使用

### 安装依赖
```bash
npm install
```

### 运行程序
```bash
node src/index.ts
```

## 项目结构

```
.
├── src/              # 源代码目录
├── scripts/          # 工具脚本
├── context_bundle.md # 上下文聚合文件（AI 快速理解）
├── SKILL.md          # 技能简明说明
└── CLAUDE.md         # 本文件（深度参考）
```

## 核心功能

请在 `context_bundle.md` 中查看详细的项目结构、依赖项和入口文件。

## 注意事项

- 本技能由 GitHub Skill Forge 自动生成
- 详细信息请查看 `context_bundle.md`
- 原始仓库：https://github.com/rzrcazk/jimeng-free-api-all

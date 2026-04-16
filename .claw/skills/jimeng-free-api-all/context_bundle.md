# jimeng-free-api-all 项目上下文

## 项目结构
```
├── _tmp_clone/
│   ├── CLAUDE.md
│   ├── Dockerfile
│   ├── LICENSE
│   ├── README.md
│   ├── libs.d.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── test-async-video.py
│   ├── test-international-seedance.py
│   ├── test-international-video-3.py
│   ├── test-multi-region.py
│   ├── test-seedance-media.py
│   ├── test-seedance-media.sh
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── yarn.lock
│   ├── .trae_tmp_clone/
│   ├── docs/
│   │   ├── JIMENG-4.1-4.5.md
│   │   ├── curl(node.js)_jimeng-5.0lite.txt
│   │   ├── curl.txt
│   │   ├── curl2.txt
│   │   ├── curl20260401.md
│   ├── public/
│   │   ├── welcome.html
│   ├── configs/
│   │   ├── dev/
│   │   │   ├── service.yml
│   │   │   ├── system.yml
│   ├── scripts/
│   │   ├── logout-sessions.py
│   ├── doc/
│   │   ├── example-0.png
│   │   ├── example-1.jpeg
│   ├── src/
│   │   ├── daemon.ts
│   │   ├── index.ts
│   │   ├── lib/
│   │   │   ├── browser-service.ts
│   │   │   ├── config.ts
│   │   │   ├── environment.ts
│   │   │   ├── http-status-codes.ts
│   │   │   ├── initialize.ts
│   │   │   ├── logger.ts
│   │   │   ├── server.ts
│   │   │   ├── util.ts
│   │   │   ├── x-bogus.ts
│   │   │   ├── x-gnarly.ts
│   │   │   ├── response/
│   │   │   │   ├── Body.ts
│   │   │   │   ├── FailureBody.ts
│   │   │   │   ├── Response.ts
│   │   │   │   ├── SuccessfulBody.ts
│   │   │   ├── exceptions/
│   │   │   │   ├── APIException.ts
│   │   │   │   ├── Exception.ts
│   │   │   ├── configs/
│   │   │   │   ├── model-config.ts
│   │   │   │   ├── service-config.ts
│   │   │   │   ├── system-config.ts
│   │   │   ├── request/
│   │   │   │   ├── Request.ts
│   │   │   ├── consts/
│   │   │   │   ├── exceptions.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── ICompletionMessage.ts
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   │   ├── chat.ts
│   │   │   │   ├── core.ts
│   │   │   │   ├── images.ts
│   │   │   │   ├── videos.ts
│   │   │   ├── routes/
│   │   │   │   ├── chat.ts
│   │   │   │   ├── images.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── models.ts
│   │   │   │   ├── ping.ts
│   │   │   │   ├── token.ts
│   │   │   │   ├── video.ts
│   │   │   │   ├── videos.ts
│   │   │   ├── consts/
│   │   │   │   ├── exceptions.ts
```


## 关键文档


### README.md
# Jimeng AI Free API

即梦 AI 免费 API 服务 - 支持文生图、图生图、视频生成的 OpenAI 兼容接口

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-v0.9.1-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

> 🎨 将即梦 AI 强大的图像和视频生成能力，通过 OpenAI 兼容接口开放给开发者

## 项目介绍

### 项目概述

Jimeng AI Free API 是一个逆向工程的 API 服务器，将即梦 AI（Jimeng AI）的图像和视频生成能力封装为 OpenAI 兼容的 API 接口。支持最新的 **jimeng-5.0**、**jimeng-4.6** 文生图模型、**Seedance 2.0 多模态智能视频生成**（模型名 `jimeng-video-seedance-2.0`，支持图片/视频/音频混合上传）及 **Seedance 2.0-fast 快速版**（模型名 `jimeng-video-seedance-2.0-fast`），**Seedance 2.0 Fast VIP Vision**（极速推理，会员专属通道）和 **Seedance 2.0 VIP Vision**（主模态能力，会员专属通道），**国际版普通视频生成**（jimeng-video-3.0/3.0-pro/3.5-pro），零配置部署，多路 token 支持。

### 核心功能

- 🖼️ **文生图**：支持 jimeng-5.0、jimeng-4.6、jimeng-4.5 等多款模型，最高 4K 分辨率
- 🎭 **图生图**：多图合成，支持 1-10 张输入图片
- 🎬 **视频生成**：jimeng-video-3.5-pro 等模型，支持首帧/尾帧控制
- 🌊 **Seedance 2.0 / 2.0-fast / 2.0-fast-vip / 2.0-vip**：多模态智能视频生成，支持图片/视频/音频混合上传，@1、@2 占位符引用素材，fast 版本生成更快，VIP 版本为会员专属通道
- 🌍 **国际版视频生成**：支持国际区域 Token（sg-/it-/jp-/hk- 等前缀），纯算法签名绕过 shark 反爬，支持普通视频（jimeng-video-3.0/3.0-pro/3.5-pro）与 Seedance 的同步/异步生成，VIP 模型同样支持
- 🎯 **国际版 VIP 无水印下载**：VIP Token 自动获取无水印视频，权益 API 自动调用，水印状态自动检测
- 🔗 **OpenAI 兼容**：完全兼容 OpenAI API 格式，无缝对接现有客户端
- 🔄 **多账号支持**：支持多个 sessionid 轮询使用

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | >=16.0.0 | 运行环境 |
| TypeScript | ^5.0.0 | 开发语言 |
| Koa | ^2.15.0 | Web 框架 |
| Playwright | ^1.49.0 | 浏览器代理（Seedance 反爬绕过） |
| Docker | latest | 容器化部署 |

## 功能清单

| 功能名称 | 功能说明 | 模型 | 状态 |
|---------|---------|------|------|
| 文生图 | 根据文本描述生成图片 | jimeng-5.0, jimeng-4.6, jimeng-4.5, jimeng-4.1 等 | ✅ 可用 |
| 图生图 | 多图合成生成新图片 | jimeng-5.0, jimeng-4.6, jimeng-4.5 等 | ✅ 可用 |
| 文生视频 | 根据文本描述生成视频 | jimeng-video-3.5-pro 等 | ✅ 可用 |
| 图生视频 | 使用首帧/尾帧图片生成视频 | jimeng-video-3.0 等 | ✅ 可用 |
| 多图智能视频 | Seedance 2.0 多模态混合生成 | jimeng-video-seedance-2.0, seedance-2.0 | ✅ 可用 |
| 多图快速视频 | Seedance 2.0-fast 快速生成 | jimeng-video-seedance-2.0-fast, seedance-2.0-fast | ✅ 可用 |
| VIP 极速视频 | Seedance 2.0 Fast VIP Vision 极速推理 | jimeng-video-seedance-2.0-fast-vip, seedance-2.0-fast-vip | ✅ 可用 |
| VIP 专业视频 | Seedance 2.0 VIP Vision 主模态能力 | jimeng-video-seedance-2.0-vip, seedance-2.0-vip | ✅ 可用 |
| 音频驱动视频 | Seedance 图片+音频混合生成 | jimeng-video-seedance-2.0, seedance-2.0-fast | ✅ 可用 |
| 异步视频生成 | 提交任务立即返回，查询接口阻塞等待结果 | 所有视频模型 | ✅ 可用 |
| 国际版视频生成 | 国际区域 Token 纯算法签名绕过 shark | jimeng-video-3.0, jimeng-video-3.0-pro, jimeng-video-3.5-pro, seedance-2.0-fast, seedance-2.0-pro, seedance-2.0-fast-vip, seedance-2.0-vip | ✅ 可用 |
| 国际版异步视频 | 国际版普通视频 / Seedance 异步生成 | jimeng-video-3.0, jimeng-video-3.0-pro, jimeng-video-3.5-pro, seedance-2.0-fast, seedance-2.0-pro, seedance-2.0-fast-vip, seedance-2.0-vip | ✅ 可用 |
| 国际版 VIP 无水印 | VIP Token 自动获取无水印视频 URL | 所有国际版视频模型 | ✅ 可用 |
| Chat 接口 | OpenAI 兼容的对话接口 | 所有模型 | ✅ 可用 |

## 免责声明

> ⚠️ **重要提示**

**逆向 API 是不稳定的，建议前往即梦 AI 官方 https://jimeng.jianying.com/ 体验功能，避免封禁的风险。**

**本组织和个人不接受任何资金捐助和交易，此项目是纯粹研究交流学习性质！**

**仅限自用，禁止对外提供服务或商用，避免对官方造成服务压力，否则风险自担！**

## 安装说明

### 环境要求

- Node.js 16+
- npm 或 yarn
- Chromium 浏览器（Seedance 模型需要，通过 Playwright 自动管理）
- Docker（可选）

### 方式一：Docker 部署（推荐）

**使用 Docker Hub 镜像：**

```bash
# 拉取镜像
docker pull wwwzhouhui569/jimeng-free-api-all:latest

# 启动容器
docker run -it -d --init --name jimeng-free-api-all \
  -p 8000:8000 \
  -e TZ=Asia/Shanghai \
  wwwzhouhui569/jimeng-free-api-all:latest
```

**从源码构建：**

```bash
# 克隆项目
git clone https://github.com/wwwzhouhui/jimeng-free-api-all.git

# 进入目录
cd jimeng-free-api-all

# 构建镜像
docker build -t jimeng-free-api-all:latest .

# 启动容器
docker run -it -d --init --name jimeng-free-api-all \
  -p 8000:8000 \
  -e TZ=Asia/Shanghai \
  jimeng-free-api-all:latest
```

### 方式二：源码安装

```bash
# 克隆项目
git clone https://github.com/wwwzhouhui/jimeng-free-api-all.git

# 进入目录
cd jimeng-free-api-all

# 安装依赖
npm install

# 安装 Chromium 浏览器（Seedance 模型需要）
npx playwright-core install chromium --with-deps

# 开发模式
npm run dev

# 生产模式
npm run build && npm start
```

## 使用说明

### 获取 SessionID

1. 访问 [即梦 AI](https://jimeng.jianying.com/) 并登录账号
2. 按 F12 打开开发者工具
3. 进入 Application > Cookies
4. 找到 `sessionid` 的值

![获取 sessionid](./doc/example-0.png)

### 多账号配置

支持多个账号的 sessionid，使用逗号分隔：

```
Authorization: Bearer sessionid1,sessionid2,sessionid3
```

每次请求会从中随机选择一个使用。

### API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/v1/chat/completions` | POST | OpenAI 兼容的对话接口 |
| `/v1/images/generations` | POST | 文生图/图生图接口（支持 images 可选参数） |
| `/v1/images/compositions` | POST | 图生图接口（向后兼容） |
| `/v1/videos/generations` | POST | 视频生成接口（同步，阻塞等待结果，含 VIP 模型） |
| `/v1/videos/generations/async` | POST | 异步视频生成接口（提交任务，立即返回 task_id） |
| `/v1/videos/generations/async/:taskId` | GET | 异步视频生成接口（查询任务结果，阻塞等待） |
| `/v1/videos/international/generations` | POST | 国际版视频生成（普通视频 + Seedance，同步） |
| `/v1/videos/international/generations/async` | POST | 国际版视频生成（普通视频 + Seedance，异步提交任务） |
| `/v1/videos/international/generations/async/:taskId` | GET | 国际版视频生成（普通视频 + Seedance，异步查询结果） |
| `/v1/models` | GET | 获取模型列表 |

### 快速开始

**文生图示例：**

```bash
curl -X POST http://localhost:8000/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_sessionid" \
  -d '{
    "model": "jimeng-4.5",
    "prompt": "美丽的日落风景，湖边的小屋",
    "ratio": "16:9",
    "resolution": "2k"
  }'
```

**图生图示例（通过 images 参数）：**

```bash
curl -X POST http://localhost:8000/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_sessionid" \
  -d '{
    "model": "jimeng-4.5",
    "prompt": "将两张图融合成梦幻风格",
    "images": [
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg"
    ],
    "ratio": "1:1",
    "resolution": "2k",
    "sample_strength": 0.5
  }'
```

**视频生成示例：**

```bash
curl -X POST http://localhost:8000/v1/videos/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_sessionid" \
  -d '{
    "model": "jimeng-video-3.5-pro",
    "prompt": "一只可爱的小猫在草地上玩耍",
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5
  }'
```

**Seedance 2.0 多图视频示例：**

```bash
curl -X POST http://localhost:8000/v1/videos/generations \
  -H "Authorization: Bearer your_sessionid" \
  -F "model=jimeng-video-seedance-2.0" \
  -F "prompt=@1 和 @2 两人开始跳舞" \
  -F "ratio=4:3" \
  -F "duration=4" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

**Seedance 2.0-fast 快速视频示例：**

```bash
curl -X POST http://localhost:8000/v1/videos/generations \
  -H "Authorization: Bearer your_sessionid" \
  -F "model=jimeng-video-seedance-2.0-fast" \
  -F "prompt=@1 图片中的人物开始微笑" \
  -F "ratio=4:3" \
  -F "duration=5" \
  -F "files=@/path/to/image1.jpg"
```

**Seedance 图片+音频混合示例：**

```bash
curl -X POST http://localhost:8000/v1/videos/generations \
  -H "Authorization: Bearer your_sessionid" \
  -F "model=jimeng-video-seedance-2.0-fast" \
  -F "prompt=@1 图片中的人物随着音乐 @2 开始跳舞" \
  -F "ratio=9:16" \
  -F "duration=5" \
  -F "files=@/path/to/image.png" \
  -F "files=@/path/to/audio.wav"
```

**Seedance 2.0 Fast VIP 极速推理示例（会员专属通道）：**

```bash
curl -X POST http://localhost:8000/v1/videos/generations \
  -H "Authorization: Bearer your_sessionid" \
  -F "model=jimeng-video-seedance-2.0-fast-vip" \
  -F "prompt=@1 图片中的人物开始微笑" \
  -F "ratio=4:3" \
  -F "duration=4" \
  -F "files=@/path/to/image.jpg"
```

**Seedance 2.0 VIP 主模态能力示例（会员专属通道）：**

```bash
curl -X POST http://localhost:8000/v1/videos/generations \
  -H "Authorization: Bearer your_sessionid" \
  -F "model=jimeng-video-seedance-2.0-vip" \
  -F "prompt=@1 和 @2 两人开始跳舞" \
  -F "ratio=4:3" \
  -F "duration=5" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

## 项目结构

```
jimeng-free-api-all/
├── src/
│   ├── index.ts                 # 应用入口
│   ├── daemon.ts                # 守护进程管理
│   ├── api/
│   │   ├── controllers/         # 业务逻辑控制器
│   │   │   ├── core.ts          # 核心工具（Token处理等）
│   │   │   ├── images.ts        # 图像生成逻辑
│   │   │   ├── videos.ts        # 视频生成逻辑
│   │   │   └── chat.ts          # 对话补全逻辑
│   │   ├── routes/              # API 路由定义
│   │   │   ├── index.ts         # 路由聚合
│   │   │   ├── images.ts        # /v1/images/* 端点
│   │   │   ├── videos.ts        # /v1/videos/* 端点
│   │   │   ├── chat.ts          # /v1/chat/* 端点
│   │   │   └── models.ts        # /v1/models 端点


... (文件截断，仅显示前 200 行)

### CLAUDE.md
# CLAUDE.md

本文件为 Claude Code (claude.ai/claude-code) 在此代码仓库中工作时提供指导。

## 项目概述

即梦 AI 免费 API 服务 - 逆向工程的 API 服务器，提供 OpenAI 兼容接口，封装即梦 AI 的图像和视频生成能力。

**版本：** v0.9.1

**核心功能：**
- 文生图：支持 jimeng-5.0、jimeng-4.6、jimeng-4.5 等多款模型，最高 4K 分辨率，国内版和国际版统一入口
- 图生图：多图合成，支持 1-10 张输入图片，国内版和国际版统一入口
- 视频生成：jimeng-video-3.5-pro 等模型，支持首帧/尾帧控制
- Seedance 2.0：多模态智能视频生成，模型名 `jimeng-video-seedance-2.0`（兼容 `seedance-2.0`），支持图片/视频/音频混合上传，@1、@2 占位符引用素材，4-15 秒时长
- 国际版视频：支持国际区域 Token（sg-/it-/jp-/hk- 等前缀），X-Bogus/X-Gnarly 纯算法签名绕过 shark 反爬，支持普通视频（jimeng-video-3.0/3.0-pro/3.5-pro）与 Seedance 的同步/异步两种模式
- 国际版 VIP 无水印下载：VIP Token 自动获取无水印视频 URL，权益 API（benefit_metadata / batch_get_user_benefit）自动调用，水印状态检测日志
- OpenAI 兼容：完全兼容 OpenAI API 格式，无缝对接现有客户端
- 多账号支持：支持多个 sessionid 轮询使用

**国际版支持（v0.9.0）：**
- 国际版图片生成：`/v1/images/generations` 和 `/v1/images/compositions` 接受国际 Token（sg-/it-/jp-/hk- 等前缀），自动切换 assistantId 和上传通道
- 国际版视频生成：普通视频（jimeng-video-3.0/3.0-pro/3.5-pro）+ Seedance 同步/异步
- 区域感知路由：`parseRegionFromToken` 自动识别 Token 前缀决定走国内版还是国际版链路

## 构建和开发命令

```bash
# 安装依赖
npm install

# 安装 Chromium 浏览器（Seedance 模型需要）
npx playwright-core install chromium --with-deps

# 开发模式（热重载）
npm run dev

# 生产环境构建
npm run build

# 启动生产服务
npm start
```

## Docker 命令

```bash
# 构建 Docker 镜像
docker build -t jimeng-free-api-all:latest .

# 运行容器
docker run -it -d --init --name jimeng-free-api-all -p 8000:8000 -e TZ=Asia/Shanghai jimeng-free-api-all:latest

# 使用 Docker Hub 预构建镜像
docker pull wwwzhouhui569/jimeng-free-api-all:latest
docker run -it -d --init --name jimeng-free-api-all -p 8000:8000 -e TZ=Asia/Shanghai wwwzhouhui569/jimeng-free-api-all:latest
```

## 项目架构

```
src/
├── index.ts                    # 应用入口
├── daemon.ts                   # 守护进程管理
├── api/
│   ├── controllers/            # 业务逻辑控制器
│   │   ├── core.ts            # 核心工具（Token处理、积分管理、请求封装、区域解析、checkResult 兼容空响应）
│   │   ├── images.ts          # 图像生成逻辑（文生图、图生图，复用 videos 上传通道，区域感知 assistantId）
│   │   ├── videos.ts          # 视频生成逻辑（含 Seedance 2.0）
│   │   └── chat.ts            # 对话补全逻辑
│   ├── routes/                 # API 路由定义
│   │   ├── index.ts           # 路由聚合器
│   │   ├── images.ts          # /v1/images/* 端点
│   │   ├── videos.ts          # /v1/videos/* 端点
│   │   ├── video.ts           # /v1/video/* 端点（videos 的包装路由）
│   │   ├── chat.ts            # /v1/chat/* 端点
│   │   ├── models.ts          # /v1/models 端点
│   │   ├── ping.ts            # /ping 健康检查端点
│   │   └── token.ts           # /token/* Token管理端点
│   └── consts/
│       └── exceptions.ts       # API 异常定义
└── lib/
    ├── server.ts              # Koa 服务器配置（含中间件栈）
    ├── browser-service.ts     # 浏览器代理服务（Seedance CN shark 反爬绕过）
    ├── x-bogus.ts             # X-Bogus 签名算法（国际版 shark 反爬绕过）
    ├── x-gnarly.ts            # X-Gnarly 签名算法（ChaCha20，国际版 shark 反爬绕过）
    ├── config.ts              # 配置管理
    ├── logger.ts              # 日志工具
    ├── util.ts                # 辅助工具函数
    ├── environment.ts         # 环境变量
    ├── initialize.ts          # 初始化逻辑
    ├── http-status-codes.ts   # HTTP 状态码
    ├── request/
    │   └── Request.ts         # 请求解析与验证（含文件上传规范化）
    ├── response/
    │   ├── Response.ts        # 响应包装器
    │   ├── Body.ts            # 响应体
    │   └── FailureBody.ts     # 错误响应体
    ├── exceptions/
    │   ├── Exception.ts       # 基础异常类
    │   └── APIException.ts    # API 异常类
    ├── interfaces/
    │   └── ICompletionMessage.ts  # 对话消息接口
    └── configs/               # 配置模式
        ├── model-config.ts    # 模型配置（模型参数、分辨率映射等）
        ├── service-config.ts  # 服务配置
        └── system-config.ts   # 系统配置
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/v1/chat/completions` | POST | OpenAI 兼容的对话接口（用于图像/视频生成） |
| `/v1/images/generations` | POST | 文生图/图生图接口（支持 images 可选参数，国内版和国际版统一入口） |
| `/v1/images/compositions` | POST | 图生图接口（支持文件上传，向后兼容，国内版和国际版统一入口） |
| `/v1/videos/generations` | POST | 视频生成接口（含 Seedance 2.0 / 2.0-fast / 2.0-fast-vip / 2.0-vip） |
| `/v1/videos/international/generations` | POST | 国际版视频生成（普通视频 + Seedance，同步） |
| `/v1/videos/international/generations/async` | POST | 国际版视频生成（普通视频 + Seedance，异步提交任务） |
| `/v1/videos/international/generations/async/:taskId` | GET | 国际版视频生成（普通视频 + Seedance，异步查询结果） |
| `/v1/video/generations` | POST | 视频生成接口（别名路由） |
| `/v1/videos/generations/async` | POST | 异步视频生成接口（提交任务，CN 版） |
| `/v1/videos/generations/async/:taskId` | GET | 异步视频生成接口（查询结果，CN 版） |
| `/v1/models` | GET | 获取可用模型列表 |
| `/token/check` | POST | 检查 Token 有效性 |
| `/token/points` | POST | 查询账户积分 |
| `/ping` | GET | 健康检查端点 |

## 关键技术细节

### 认证方式
- 使用即梦网站的 `sessionid` Cookie 作为 Bearer Token
- 多账号支持：逗号分隔多个 sessionid：`Authorization: Bearer sessionid1,sessionid2`
- 每次请求随机选择一个 sessionid 使用
- 区域感知：Token 前缀（如 `sg-`、`hk-`）自动识别区域，决定使用国内版还是国际版链路
- assistantId 区域映射：`getAssistantId()` 根据 `regionInfo.isInternational` 返回不同的 aid 值（CN: 513695, 国际: 513641）
- 图片生成也支持国际版 Token：`/v1/images/generations` 和 `/v1/images/compositions` 接受国际 Token，自动使用国际版上传通道和 assistantId

### 模型映射

#### 图像模型
| 用户模型名 | 内部模型名 | Draft 版本 | 说明 |
|-----------|-----------|-----------|------|
| `jimeng-5.0` | `high_aes_general_v50` | 3.3.9 | 5.0 正式版（原 jimeng-5.0-preview），最新模型 |
| `jimeng-4.6` | `high_aes_general_v42` | 3.3.9 | 推荐使用 |
| `jimeng-4.5` | `high_aes_general_v40l` | 3.3.4 | 高质量模型 |
| `jimeng-4.1` | `high_aes_general_v41` | 3.3.4 | 高质量模型 |
| `jimeng-4.0` | `high_aes_general_v40` | 3.3.4 | 稳定版本 |
| `jimeng-3.1` | `high_aes_general_v30l_art_fangzhou` | - | 艺术风格 |
| `jimeng-3.0` | `high_aes_general_v30l` | - | 通用模型 |
| `jimeng-2.1` | - | - | 旧版模型 |
| `jimeng-2.0-pro` | - | - | 旧版专业模型 |
| `jimeng-2.0` | - | - | 旧版模型 |
| `jimeng-1.4` | - | - | 早期模型 |
| `jimeng-xl-pro` | - | - | XL 专业模型 |

#### 视频模型
| 用户模型名 | 内部模型名 | 说明 |
|-----------|-----------|------|
| `jimeng-video-3.5-pro` | `dreamina_ic_generate_video_model_vgfm_3.5_pro` | 最新视频模型 |
| `jimeng-video-3.0` | `dreamina_ic_generate_video_model_vgfm_3.0` | 视频生成 3.0 |
| `jimeng-video-3.0-pro` | `dreamina_ic_generate_video_model_vgfm_3.0_pro` | 视频生成 3.0 专业版 |
| `jimeng-video-seedance-2.0` | `dreamina_seedance_40_pro` | Seedance 2.0（上游标准名称，推荐） |
| `seedance-2.0` | `dreamina_seedance_40_pro` | 多图智能视频生成（向后兼容别名） |
| `seedance-2.0-pro` | `dreamina_seedance_40_pro` | 多图智能视频生成专业版（向后兼容别名） |
| `jimeng-video-seedance-2.0-fast` | `dreamina_seedance_40` | Seedance 2.0-fast 快速版（上游标准名称） |
| `seedance-2.0-fast` | `dreamina_seedance_40` | Seedance 2.0-fast 快速版（向后兼容别名） |
| `jimeng-video-seedance-2.0-fast-vip` | `dreamina_seedance_40_vision` | Seedance 2.0 Fast VIP Vision 极速推理版（会员专属通道） |
| `seedance-2.0-fast-vip` | `dreamina_seedance_40_vision` | Seedance 2.0 Fast VIP Vision（向后兼容别名） |
| `jimeng-video-seedance-2.0-vip` | `dreamina_seedance_40_pro_vision` | Seedance 2.0 VIP Vision 主模态能力版（会员专属通道） |
| `seedance-2.0-vip` | `dreamina_seedance_40_pro_vision` | Seedance 2.0 VIP Vision（向后兼容别名） |

### 请求参数

#### 图像生成参数 (`/v1/images/generations`)
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | jimeng-4.5 | 模型名称 |
| prompt | string | 是 | - | 提示词，jimeng-4.x/5.x 支持多图生成 |
| images | array | 否 | - | 图片URL数组（1-10张），提供则走图生图模式，不提供则走文生图模式 |
| negative_prompt | string | 否 | "" | 反向提示词 |
| ratio | string | 否 | 1:1 | 宽高比：1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3, 21:9 |
| resolution | string | 否 | 2k | 分辨率：1k, 2k, 4k |
| sample_strength | float | 否 | 0.5 | 精细度 0.0-1.0 |
| response_format | string | 否 | url | url 或 b64_json |

**说明：**
- 当 `images` 参数为空或不提供时，接口执行文生图功能
- 当 `images` 参数提供（1-10张图片）时，接口执行图生图功能
- 支持 `application/json`（images 为 URL 数组）和 `multipart/form-data`（通过 images 字段上传文件）两种请求格式
- 图生图模式下，响应会额外包含 `input_images` 和 `composition_type` 字段

#### 图生图参数 (`/v1/images/compositions`) - 向后兼容
- 与 `/v1/images/generations` 相同的参数
- `images` 字段为必填（1-10张图片）
- 额外支持 multipart/form-data 文件上传

#### 视频生成参数 (`/v1/videos/generations`)
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | jimeng-video-3.0 | 模型名称 |
| prompt | string | 否 | - | 视频描述（图生视频时可选） |
| ratio | string | 否 | 1:1 | 宽高比：1:1, 4:3, 3:4, 16:9, 9:16 |
| resolution | string | 否 | 720p | 分辨率：480p, 720p, 1080p |
| duration | number | 否 | 5 | 时长：4-15秒（Seedance）、5 或 10 秒（普通） |
| file_paths / filePaths | array | 否 | [] | 首帧/尾帧图片 URL |
| files | file[] | 否 | - | 上传的素材文件（图片/视频/音频，multipart） |

#### Seedance 2.0 / 2.0-fast 专用参数
- 使用 `unified_edit_input` 结构，包含 `material_list` 和 `meta_list`
- 支持多模态素材混合上传：图片（ImageX）、视频/音频（VOD）
- 素材类型自动检测：通过 MIME 类型或文件扩展名判断（image/video/audio）
- 上游标准模型名：`jimeng-video-seedance-2.0`（兼容 `seedance-2.0`、`seedance-2.0-pro`）
- 快速版模型名：`jimeng-video-seedance-2.0-fast`（兼容 `seedance-2.0-fast`）
- 内部模型（标准版）：`dreamina_seedance_40_pro`，benefit_type：`dreamina_video_seedance_20_pro`
- 内部模型（快速版）：`dreamina_seedance_40`，benefit_type：`dreamina_seedance_20_fast`（注意：无 `video_` 前缀）
- VIP 模型（Fast VIP Vision 极速推理）：`dreamina_seedance_40_vision`，benefit_type：`seedance_20_fast_720p_output`（会员专属通道）
- VIP 模型（VIP Vision 主模态能力）：`dreamina_seedance_40_pro_vision`，benefit_type：`seedance_20_pro_720p_output`（会员专属通道）
- Draft 版本：3.3.9（普通版）/ 3.3.12（VIP 版）
- 生成请求新增参数：`commerce_with_input_video: "1"`、`workspace_id: 0`（v0.8.10）
- 时长范围：4-15 秒（连续范围，与上游 iptag/jimeng-api 一致）
- 提示词占位符：`@1`、`@2`、`@图1`、`@图2`、`@image1`、`@image2` 引用上传的素材
- 支持的素材格式：图片（jpg/png/webp/gif/bmp）、视频（mp4/mov/m4v）、音频（mp3/wav）

### Shark 反爬与浏览器代理（v0.8.4）
- 即梦对 Seedance 的 `/mweb/v1/aigc_draft/generate` 接口启用了 shark 安全中间件，要求请求携带 `a_bogus` 签名
- `a_bogus` 由字节跳动 `bdms` SDK 在浏览器中生成，依赖真实浏览器环境（Canvas, WebGL, DOM），Node.js 无法直接运行
- 解决方案：通过 `BrowserService`（`src/lib/browser-service.ts`）使用 Playwright 启动 headless Chromium，`bdms` SDK 自动拦截 `fetch` 并注入 `a_bogus`
- 仅 Seedance 的 generate 请求走浏览器代理，其他请求继续用 Node.js `axios`
- 浏览器懒启动，首次 Seedance 请求时创建；每个 sessionId 独立会话；10 分钟空闲自动清理
- 资源拦截：屏蔽图片/字体/Css，仅允许 bdms SDK 相关脚本（白名单域名：`vlabstatic.com`、`bytescm.com`、`jianying.com`、`byteimg.com`）

### 国际版 Shark 反爬：X-Bogus / X-Gnarly 纯算法签名（v0.8.9）
- 国际版视频链路（普通视频与 Seedance，`mweb-api-sg.capcut.com`）同样启用了 shark 安全中间件，但无需浏览器代理
- **X-Bogus**（URL 查询参数）：基于 MD5 + RC4 + 自定义 Base64 编码的签名算法，追加到请求 URL
  - 实现：`src/lib/x-bogus.ts`，纯 TypeScript，无外部依赖
  - 输入：查询字符串 + User-Agent + 请求体 → 输出：28 字符的 Base64 签名
- **X-Gnarly**（HTTP 请求头）：基于 ChaCha20 PRNG + 自定义 Base64 编码的签名算法
  - 实现：`src/lib/x-gnarly.ts`，纯 TypeScript，无外部依赖
  - 输入：查询字符串 + 请求体 + User-Agent → 输出：约 300 字符的 Base64 签名
- 在 `core.ts` 的 `request()` 函数中，对国际版请求（`regionInfo.isInternational`）自动注入这两个签名
- X-Bogus 直接拼接到 URL（避免 axios URL 编码破坏自定义 Base64 字符），X-Gnarly 作为 HTTP 头发送

### 国际版 VIP 无水印视频下载（v0.9.1）
- `fetchHighQualityVideoUrl()` 函数新增 VIP 无水印下载流程，匹配真实浏览器下载行为
- **权益 API 调用**：获取视频 URL 后，自动调用 commerce API 处理 VIP `remove_watermark` 权益
  - `POST /commerce/v3/resource/benefit_metadata` — 查询权益元数据
  - `POST /commerce/v3/benefits/batch_get_user_benefit` — 批量查询用户权益
  - 两个调用通过 `parseRegionFromToken` 自动判断国际版用户，失败时降级不影响主流程
- **水印状态检测**：自动检测并记录返回视频 URL 的水印标识
  - `lr=display_watermark_busi_aigc` → 免费账号（视频带水印）
  - `lr=display_watermark_aigc` → VIP 账号（视频无水印，`lr` 仅是埋点标签）
- **工作原理**：服务端根据 session 的 VIP 状态生成不同的签名 CDN URL，VIP 签名指向无水印视频文件
- **URL 提取优化**：重构为统一 `videoUrl` 变量 + 级联降级策略，支持提取后统一后处理

### 文件上传
- 支持 multipart/form-data 文件上传
- koa-body 配置最大文件大小 100MB
- files 字段可以是对象或数组格式（在 Request.ts 中自动规范化）
- 支持 formLimit/jsonLimit/textLimit：100mb

### 图片上传逻辑重构（v0.9.0）
- `images.ts` 中的 `uploadImageFromUrl` 和 `uploadImageBuffer` 不再自行实现 ImageX 上传流程
- 改为复用 `videos.ts` 中的 `uploadImageBufferForVideo`（统一上传通道）
- 国际版图片上传走 `uploadInternationalImageUrl`
- 新增区域感知 assistantId：`getImageAssistantId()` 根据区域返回正确的 aid

### 上传通道（v0.8.5）
- **ImageX 通道**（图片上传）：`get_upload_token(scene=2)` → `imagex.bytedanceapi.com` → `ApplyImageUpload` / `CommitImageUpload`，返回 URI 格式 `tos-cn-i-{service_id}/{uuid}`，service_id 为 `tb4s082cfz`
- **VOD 通道**（视频/音频上传）：`get_upload_token(scene=1)` → `vod.bytedanceapi.com` → `ApplyUploadInner` / `CommitUploadInner`，返回 vid 格式 `v028xxx`，SpaceName 为 `dreamina`
- AWS Signature V4 签名：ImageX 使用 service=`imagex`，VOD 使用 service=`vod`，region 均为 `cn-north-1`
- VOD 上传自动返回媒体元数据（Duration、Width、Height、Fps 等），音频时长 fallback 使用本地 WAV 头解析
- **区域感知上传路由**（v0.8.10）：`regionFetch()` 自动判断 `regionInfo.isInternational`，国际版走 `proxyFetch`（代理），国内版走 `cnFetch`（直连），避免 CN 上传目标走代理失败

### 分辨率支持

#### 图片分辨率
| 分辨率 | 1:1 | 4:3 | 3:4 | 16:9 | 9:16 | 3:2 | 2:3 | 21:9 |
|--------|-----|-----|-----|------|------|-----|-----|------|
| 1k | 1024×1024 | 768×1024 | 1024×768 | 1024×576 | 576×1024 | 1024×682 | 682×1024 | 1195×512 |
| 2k | 2048×2048 | 2304×1728 | 1728×2304 | 2560×1440 | 1440×2560 | 2496×1664 | 1664×2496 | 3024×1296 |
| 4k | 4096×4096 | 4608×3456 | 3456×4608 | 5120×2880 | 2880×5120 | 4992×3328 | 3328×4992 | 6048×2592 |

#### 视频分辨率
| 分辨率 | 1:1 | 4:3 | 3:4 | 16:9 | 9:16 |
|--------|-----|-----|-----|------|------|
| 480p | 480×480 | 640×480 | 480×640 | 854×480 | 480×854 |
| 720p | 720×720 | 960×720 | 720×960 | 1280×720 | 720×1280 |
| 1080p | 1080×1080 | 1440×1080 | 1080×1440 | 1920×1080 | 1080×1920 |

### 服务器中间件栈
1. **CORS 跨域支持**：`koa2-cors()`
2. **Range 请求**：`koaRange`（支持分段内容传输）
3. **自定义异常处理器**：捕获错误并返回 FailureBody 响应
4. **自定义 JSON 解析器**：处理 POST/PUT/PATCH 请求的 JSON（清理问题 Unicode 字符，跳过 multipart 请求）
5. **Body 解析器**：`koa-body`（multipart: true，maxFileSize: 100MB）

## 开发规范

1. **TypeScript**：项目使用 TypeScript + ESM 模块


... (文件截断，仅显示前 200 行)

### package.json
{
  "name": "jimeng-free-api",
  "version": "0.9.1",
  "description": "jimeng Free API Server",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "directories": {
    "dist": "dist"
  },
  "files": [
    "dist/"
  ],
  "scripts": {
    "dev": "tsup src/index.ts --format cjs,esm --sourcemap --dts --publicDir public --watch --onSuccess \"node --enable-source-maps --no-node-snapshot dist/index.js --port 8000\"",
    "start": "node --enable-source-maps --no-node-snapshot dist/index.js",
    "build": "tsup src/index.ts --format cjs,esm --sourcemap --dts --clean --publicDir public"
  },
  "author": "Vinlic",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.6.7",
    "colors": "^1.4.0",
    "crc-32": "^1.2.2",
    "cron": "^3.1.6",
    "date-fns": "^3.3.1",
    "eventsource-parser": "^1.1.2",
    "form-data": "^4.0.0",
    "fs-extra": "^11.2.0",
    "koa": "^2.15.0",
    "koa-body": "^5.0.0",
    "koa-bodyparser": "^4.4.1",
    "koa-range": "^0.3.0",
    "koa-router": "^12.0.1",
    "koa2-cors": "^2.0.6",
    "lodash": "^4.17.21",
    "mime": "^4.0.1",
    "minimist": "^1.2.8",
    "playwright-core": "^1.49.0",
    "randomstring": "^1.3.0",
    "semver": "^7.7.2",
    "undici": "^7.24.6",
    "uuid": "^9.0.1",
    "yaml": "^2.3.4"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.202",
    "@types/mime": "^3.0.4",
    "tsup": "^8.0.2",
    "typescript": "^5.3.3"
  }
}


### tsconfig.json
{
    "compilerOptions": {
      "baseUrl": ".",
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "allowImportingTsExtensions": true,
      "allowSyntheticDefaultImports": true,
      "noEmit": true,
      "paths": {
        "@/*": ["src/*"]
      },
      "outDir": "./dist"
    },
    "include": ["src/**/*", "libs.d.ts"],
    "exclude": ["node_modules", "dist"]
}

## 核心代码


### src/daemon.ts
```typescript
/**
 * 守护进程
 */

import process from 'process';
import path from 'path';
import { spawn } from 'child_process';

import fs from 'fs-extra';
import { format as dateFormat } from 'date-fns';
import 'colors';

const CRASH_RESTART_LIMIT = 600;  //进程崩溃重启次数限制
const CRASH_RESTART_DELAY = 5000;  //进程崩溃重启延迟
const LOG_PATH = path.resolve("./logs/daemon.log");  //守护进程日志路径
let crashCount = 0;  //进程崩溃次数
let currentProcess;  //当前运行进程

/**
 * 写入守护进程日志
 */
function daemonLog(value, color?: string) {
    try {
        const head = `[daemon][${dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss.SSS")}] `;
        value = head + value;
        console.log(color ? value[color] : value);
        fs.ensureDirSync(path.dirname(LOG_PATH));
        fs.appendFileSync(LOG_PATH, value + "\n");
    }
    catch(err) {
        console.error("daemon log write error:", err);
    }
}

daemonLog(`daemon pid: ${process.pid}`);

function createProcess() {
    const childProcess = spawn("node", ["index.js", ...process.argv.slice(2)]);  //启动子进程
    childProcess.stdout.pipe(process.stdout, { end: false });  //将子进程输出管道到当前进程输出
    childProcess.stderr.pipe(process.stderr, { end: false });  //将子进程错误输出管道到当前进程输出
    currentProcess = childProcess;  //更新当前进程
    daemonLog(`process(${childProcess.pid}) has started`);
    childProcess.on("error", err => daemonLog(`process(${childProcess.pid}) error: ${err.stack}`, "red"));
    childProcess.on("close", code => {
        if(code === 0)  //进程正常退出
            daemonLog(`process(${childProcess.pid}) has exited`);
        else if(code === 2)  //进程已被杀死
            daemonLog(`process(${childProcess.pid}) has been killed!`, "bgYellow");
        else if(code === 3) {  //进程主动重启
            daemonLog(`process(${childProcess.pid}) has restart`, "yellow");
            createProcess();  //重新创建进程
        }
        else {  //进程发生崩溃
            if(crashCount++ < CRASH_RESTART_LIMIT) {  //进程崩溃次数未达重启次数上限前尝试重启
                daemonLog(`process(${childProcess.pid}) has crashed! delay ${CRASH_RESTART_DELAY}ms try restarting...(${crashCount})`, "bgRed");
                setTimeout(() => createProcess(), CRASH_RESTART_DELAY);  //延迟指定时长后再重启
            }
            else  //进程已崩溃，且无法重启
                daemonLog(`process(${childProcess.pid}) has crashed! unable to restart`, "bgRed");
        }
    });  //子进程关闭监听
}

process.on("exit", code => {
    if(code === 0)
        daemonLog("daemon process exited");
    else if(code === 2)
        daemonLog("daemon process has been killed!");
});  //守护进程退出事件

process.on("SIGTERM", () => {
    daemonLog("received kill signal", "yellow");
    currentProcess && currentProcess.kill("SIGINT");
    process.exit(2);
});  //kill退出守护进程

process.on("SIGINT", () => {
    currentProcess && currentProcess.kill("SIGINT");
    process.exit(0);
});  //主动退出守护进程

createProcess();  //创建进程

```

### src/index.ts
```typescript
"use strict";

import environment from "@/lib/environment.ts";
import config from "@/lib/config.ts";
import "@/lib/initialize.ts";
import server from "@/lib/server.ts";
import routes from "@/api/routes/index.ts";
import logger from "@/lib/logger.ts";

const startupTime = performance.now();

(async () => {
  logger.header();

  logger.info("<<<< jimeng free server >>>>");
  logger.info("Version:", environment.package.version);
  logger.info("Process id:", process.pid);
  logger.info("Environment:", environment.env);
  logger.info("Service name:", config.service.name);

  server.attachRoutes(routes);
  await server.listen();

  config.service.bindAddress &&
    logger.success("Service bind address:", config.service.bindAddress);
})()
  .then(() =>
    logger.success(
      `Service startup completed (${Math.floor(performance.now() - startupTime)}ms)`
    )
  )
  .catch((err) => console.error(err));

```

### src/lib/environment.ts
```typescript
import path from 'path';

import fs from 'fs-extra';
import minimist from 'minimist';
import _ from 'lodash';

const cmdArgs = minimist(process.argv.slice(2));  //获取命令行参数
const envVars = process.env;  //获取环境变量

class Environment {

    /** 命令行参数 */
    cmdArgs: any;
    /** 环境变量 */
    envVars: any;
    /** 环境名称 */
    env?: string;
    /** 服务名称 */
    name?: string;
    /** 服务地址 */
    host?: string;
    /** 服务端口 */
    port?: number;
    /** 包参数 */
    package: any;

    constructor(options: any = {}) {
        const { cmdArgs, envVars, package: _package } = options;
        this.cmdArgs = cmdArgs;
        this.envVars = envVars;
        this.env = _.defaultTo(cmdArgs.env || envVars.SERVER_ENV, 'dev');
        this.name = cmdArgs.name || envVars.SERVER_NAME || undefined;
        this.host = cmdArgs.host || envVars.SERVER_HOST || undefined;
        this.port = Number(cmdArgs.port || envVars.SERVER_PORT) ? Number(cmdArgs.port || envVars.SERVER_PORT) : undefined;
        this.package = _package;
    }

}

export default new Environment({
    cmdArgs,
    envVars,
    package: JSON.parse(fs.readFileSync(path.join(path.resolve(), "package.json")).toString())
});
```

### src/lib/x-gnarly.ts
```typescript
import { createHash } from "crypto";

const CUSTOM_ALPHABET = "u09tbS3UvgDEe6r-ZVMXzLpsAohTn7mdINQlW412GqBjfYiyk8JORCF5/xKHwacP=";
const MASK_32 = 0xffffffff;

const CRYPTO_CONSTANTS = [
  0xffffffff, 138, 1498001188, 211147047, 253, null, 203, 288, 9,
  1196819126, 3212677781, 135, 263, 193, 58, 18, 244, 2931180889, 240, 173,
  268, 2157053261, 261, 175, 14, 5, 171, 270, 156, 258, 13, 15, 3732962506,
  185, 169, 2, 6, 132, 162, 200, 3, 160, 217618912, 62, 2517678443, 44, 164,
  4, 96, 183, 2903579748, 3863347763, 119, 181, 10, 190, 8, 2654435769, 259,
  104, 230, 128, 2633865432, 225, 1, 257, 143, 179, 16, 600974999, 185100057,
  32, 188, 53, 2718276124, 177, 196, 4294967296, 147, 117, 17, 49, 7, 28, 12,
  266, 216, 11, 0, 45, 166, 247, 1451689750,
];

const CHACHA_INITIAL_STATE = [
  CRYPTO_CONSTANTS[9],   // 1196819126
  CRYPTO_CONSTANTS[69],  // 600974999
  CRYPTO_CONSTANTS[51],  // 2903579748
  CRYPTO_CONSTANTS[92],  // 1451689750
];

function ensure32(value: number): number {
  return value & MASK_32;
}

function rotateLeft(value: number, shift: number): number {
  return ensure32((value << shift) | (value >>> (32 - shift)));
}

function chachaQuarterRound(state: number[], a: number, b: number, c: number, d: number): void {
  state[a] = ensure32(state[a] + state[b]);
  state[d] = rotateLeft(state[d] ^ state[a], 16);
  state[c] = ensure32(state[c] + state[d]);
  state[b] = rotateLeft(state[b] ^ state[c], 12);
  state[a] = ensure32(state[a] + state[b]);
  state[d] = rotateLeft(state[d] ^ state[a], 8);
  state[c] = ensure32(state[c] + state[d]);
  state[b] = rotateLeft(state[b] ^ state[c], 7);
}

function chachaBlockFunction(initialState: number[], numRounds: number): number[] {
  const working = [...initialState];
  let roundCount = 0;
  while (roundCount < numRounds) {
    // Column rounds
    chachaQuarterRound(working, 0, 4, 8, 12);
    chachaQuarterRound(working, 1, 5, 9, 13);
    chachaQuarterRound(working, 2, 6, 10, 14);
    chachaQuarterRound(working, 3, 7, 11, 15);
    roundCount++;
    if (roundCount >= numRounds) break;
    // Diagonal rounds
    chachaQuarterRound(working, 0, 5, 10, 15);
    chachaQuarterRound(working, 1, 6, 11, 12);
    chachaQuarterRound(working, 2, 7, 12, 13);
    chachaQuarterRound(working, 3, 4, 13, 14);
    roundCount++;
  }
  for (let i = 0; i < 16; i++) {
    working[i] = ensure32(working[i] + initialState[i]);
  }
  return working;
}

// Module-level PRNG state
let prngState: number[] = initializePrngState();
let stateIndex = CRYPTO_CONSTANTS[88] as number; // 0

function initializePrngState(): number[] {
  const tsMs = Date.now();
  return [
    CRYPTO_CONSTANTS[44] as number,
    CRYPTO_CONSTANTS[74] as number,
    CRYPTO_CONSTANTS[10] as number,
    CRYPTO_CONSTANTS[62] as number,
    CRYPTO_CONSTANTS[42] as number,
    CRYPTO_CONSTANTS[17] as number,
    CRYPTO_CONSTANTS[2] as number,
    CRYPTO_CONSTANTS[21] as number,
    CRYPTO_CONSTANTS[3] as number,
    CRYPTO_CONSTANTS[70] as number,
    CRYPTO_CONSTANTS[50] as number,
    CRYPTO_CONSTANTS[32] as number,
    (CRYPTO_CONSTANTS[0] as number) & tsMs,
    Math.floor(Math.random() * ((CRYPTO_CONSTANTS[77] as number) - 1)),
    Math.floor(Math.random() * ((CRYPTO_CONSTANTS[77] as number) - 1)),
    Math.floor(Math.random() * ((CRYPTO_CONSTANTS[77] as number) - 1)),
  ];
}

function generateRandomFloat(): number {
  const blockOutput = chachaBlockFunction(prngState, 8);
  const randomValue = blockOutput[stateIndex];
  const highBits = (blockOutput[stateIndex + 8] & 0xfffffff0) >>> 11;
  if (stateIndex === 7) {
    prngState[12] = ensure32(prngState[12] + 1);
    stateIndex = 0;
  } else {
    stateIndex++;
  }
  return (randomValue + 4294967296 * highBits) / (2 ** 53);
}

function convertNumberToBytes(value: number): number[] {
  if (value < 255 * 255) {
    return [(value >> 8) & 0xff, value & 0xff];
  }
  return [
    (value >> 24) & 0xff,
    (value >> 16) & 0xff,
    (value >> 8) & 0xff,
    value & 0xff,
  ];
}

function stringToBigEndianInt(input: string): number {
  const buf = Buffer.from(input.substring(0, 4), "utf-8");
  let acc = 0;
  for (const byte of buf) {
    acc = ((acc << 8) | byte) >>> 0;
  }
  return acc;
}

function chachaEncryptData(keyWords: number[], rounds: number, data: Buffer): void {
  const fullWordsCount = Math.floor(data.length / 4);
  const remainingBytes = data.length % 4;
  const totalWords = Math.ceil(data.length / 4);
  const wordArray = new Int32Array(totalWords);

  for (let i = 0; i < fullWordsCount; i++) {
    const bi = 4 * i;
    wordArray[i] = ((data[bi]!) | (data[bi + 1]! << 8) | (data[bi + 2]! << 16) | (data[bi + 3]! << 24)) >>> 0;
  }
  if (remainingBytes) {
    let partial = 0;
    const base = 4 * fullWordsCount;
    for (let b = 0; b < remainingBytes; b++) {
      partial |= data[base + b]! << (8 * b);
    }
    wordArray[fullWordsCount] = partial;
  }

  const fullState = [...CHACHA_INITIAL_STATE, ...keyWords];
  let wordOffset = 0;
  while (wordOffset + 16 < wordArray.length) {
    const keystream = chachaBlockFunction(fullState, rounds);
    fullState[12] = ensure32(fullState[12] + 1);


... (文件截断，仅显示前 200 行)
```

### src/lib/logger.ts
```typescript
import path from 'path';
import _util from 'util';

import 'colors';
import _ from 'lodash';
import fs from 'fs-extra';
import { format as dateFormat } from 'date-fns';

import config from './config.ts';
import util from './util.ts';

const isVercelEnv = process.env.VERCEL;

class LogWriter {

    #buffers = [];

    constructor() {
        !isVercelEnv && fs.ensureDirSync(config.system.logDirPath);
        !isVercelEnv && this.work();
    }

    push(content) {
        const buffer = Buffer.from(content);
        this.#buffers.push(buffer);
    }

    writeSync(buffer) {
        !isVercelEnv && fs.appendFileSync(path.join(config.system.logDirPath, `/${util.getDateString()}.log`), buffer);
    }

    async write(buffer) {
        !isVercelEnv && await fs.appendFile(path.join(config.system.logDirPath, `/${util.getDateString()}.log`), buffer);
    }

    flush() {
        if(!this.#buffers.length) return;
        !isVercelEnv && fs.appendFileSync(path.join(config.system.logDirPath, `/${util.getDateString()}.log`), Buffer.concat(this.#buffers));
    }

    work() {
        if (!this.#buffers.length) return setTimeout(this.work.bind(this), config.system.logWriteInterval);
        const buffer = Buffer.concat(this.#buffers);
        this.#buffers = [];
        this.write(buffer)
        .finally(() => setTimeout(this.work.bind(this), config.system.logWriteInterval))
        .catch(err => console.error("Log write error:", err));
    }

}

class LogText {

    /** @type {string} 日志级别 */
    level;
    /** @type {string} 日志文本 */
    text;
    /** @type {string} 日志来源 */
    source;
    /** @type {Date} 日志发生时间 */
    time = new Date();

    constructor(level, ...params) {
        this.level = level;
        this.text = _util.format.apply(null, params);
        this.source = this.#getStackTopCodeInfo();
    }

    #getStackTopCodeInfo() {
        const unknownInfo = { name: "unknown", codeLine: 0, codeColumn: 0 };
        const stackArray = new Error().stack.split("\n");
        const text = stackArray[4];
        if (!text)
            return unknownInfo;
        const match = text.match(/at (.+) \((.+)\)/) || text.match(/at (.+)/);
        if (!match || !_.isString(match[2] || match[1]))
            return unknownInfo;
        const temp = match[2] || match[1];
        const _match = temp.match(/([a-zA-Z0-9_\-\.]+)\:(\d+)\:(\d+)$/);
        if (!_match)
            return unknownInfo;
        const [, scriptPath, codeLine, codeColumn] = _match as any;
        return {
            name: scriptPath ? scriptPath.replace(/.js$/, "") : "unknown",
            path: scriptPath || null,
            codeLine: parseInt(codeLine || 0),
            codeColumn: parseInt(codeColumn || 0)
        };
    }

    toString() {
        return `[${dateFormat(this.time, "yyyy-MM-dd HH:mm:ss.SSS")}][${this.level}][${this.source.name}<${this.source.codeLine},${this.source.codeColumn}>] ${this.text}`;
    }

}

class Logger {

    /** @type {Object} 系统配置 */
    config = {};
    /** @type {Object} 日志级别映射 */
    static Level = {
        Success: "success",
        Info: "info",
        Log: "log",
        Debug: "debug",
        Warning: "warning",
        Error: "error",
        Fatal: "fatal"
    };
    /** @type {Object} 日志级别文本颜色樱色 */
    static LevelColor = {
        [Logger.Level.Success]: "green",
        [Logger.Level.Info]: "brightCyan",
        [Logger.Level.Debug]: "white",
        [Logger.Level.Warning]: "brightYellow",
        [Logger.Level.Error]: "brightRed",
        [Logger.Level.Fatal]: "red"
    };
    #writer;

    constructor() {
        this.#writer = new LogWriter();
    }

    header() {
        this.#writer.writeSync(Buffer.from(`\n\n===================== LOG START ${dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================\n\n`));
    }

    footer() {
        this.#writer.flush();  //将未写入文件的日志缓存写入
        this.#writer.writeSync(Buffer.from(`\n\n===================== LOG END ${dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================\n\n`));
    }

    success(...params) {
        const content = new LogText(Logger.Level.Success, ...params).toString();
        console.info(content[Logger.LevelColor[Logger.Level.Success]]);
        this.#writer.push(content + "\n");
    }

    info(...params) {
        const content = new LogText(Logger.Level.Info, ...params).toString();
        console.info(content[Logger.LevelColor[Logger.Level.Info]]);
        this.#writer.push(content + "\n");
    }

    log(...params) {
        const content = new LogText(Logger.Level.Log, ...params).toString();
        console.log(content[Logger.LevelColor[Logger.Level.Log]]);
        this.#writer.push(content + "\n");


... (文件截断，仅显示前 200 行)
```

### src/lib/util.ts
```typescript
import os from "os";
import path from "path";
import crypto from "crypto";
import { Readable, Writable } from "stream";

import "colors";
import mime from "mime";
import axios from "axios";
import fs from "fs-extra";
import { v1 as uuid } from "uuid";
import { format as dateFormat } from "date-fns";
import CRC32 from "crc-32";
import randomstring from "randomstring";
import _ from "lodash";
import { CronJob } from "cron";

import HTTP_STATUS_CODE from "./http-status-codes.ts";

const autoIdMap = new Map();

const util = {
  is2DArrays(value: any) {
    return (
      _.isArray(value) &&
      (!value[0] || (_.isArray(value[0]) && _.isArray(value[value.length - 1])))
    );
  },

  uuid: (separator = true) => (separator ? uuid() : uuid().replace(/\-/g, "")),

  autoId: (prefix = "") => {
    let index = autoIdMap.get(prefix);
    if (index > 999999) index = 0; //超过最大数字则重置为0
    autoIdMap.set(prefix, (index || 0) + 1);
    return `${prefix}${index || 1}`;
  },

  ignoreJSONParse(value: string) {
    const result = _.attempt(() => JSON.parse(value));
    if (_.isError(result)) return null;
    return result;
  },

  generateRandomString(options: any): string {
    return randomstring.generate(options);
  },

  getResponseContentType(value: any): string | null {
    return value.headers
      ? value.headers["content-type"] || value.headers["Content-Type"]
      : null;
  },

  mimeToExtension(value: string) {
    let extension = mime.getExtension(value);
    if (extension == "mpga") return "mp3";
    return extension;
  },

  extractURLExtension(value: string) {
    const extname = path.extname(new URL(value).pathname);
    return extname.substring(1).toLowerCase();
  },

  createCronJob(cronPatterns: any, callback?: Function) {
    if (!_.isFunction(callback))
      throw new Error("callback must be an Function");
    return new CronJob(
      cronPatterns,
      () => callback(),
      null,
      false,
      "Asia/Shanghai"
    );
  },

  getDateString(format = "yyyy-MM-dd", date = new Date()) {
    return dateFormat(date, format);
  },

  getIPAddressesByIPv4(): string[] {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let name in interfaces) {
      const networks = interfaces[name];
      const results = networks.filter(
        (network) =>
          network.family === "IPv4" &&
          network.address !== "127.0.0.1" &&
          !network.internal
      );
      if (results[0] && results[0].address) addresses.push(results[0].address);
    }
    return addresses;
  },

  getMACAddressesByIPv4(): string[] {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let name in interfaces) {
      const networks = interfaces[name];
      const results = networks.filter(
        (network) =>
          network.family === "IPv4" &&
          network.address !== "127.0.0.1" &&
          !network.internal
      );
      if (results[0] && results[0].mac) addresses.push(results[0].mac);
    }
    return addresses;
  },

  generateSSEData(event?: string, data?: string, retry?: number) {
    return `event: ${event || "message"}\ndata: ${(data || "")
      .replace(/\n/g, "\\n")
      .replace(/\s/g, "\\s")}\nretry: ${retry || 3000}\n\n`;
  },

  buildDataBASE64(type, ext, buffer) {
    return `data:${type}/${ext.replace("jpg", "jpeg")};base64,${buffer.toString(
      "base64"
    )}`;
  },

  isLinux() {
    return os.platform() !== "win32";
  },

  isIPAddress(value) {
    return (
      _.isString(value) &&
      (/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(
        value
      ) ||
        /\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/.test(
          value
        ))
    );
  },

  isPort(value) {
    return _.isNumber(value) && value > 0 && value < 65536;
  },

  isReadStream(value): boolean {
    return (
      value &&
      (value instanceof Readable || "readable" in value || value.readable)
    );
  },


... (文件截断，仅显示前 200 行)
```

### src/lib/initialize.ts
```typescript
import logger from './logger.js';
import browserService from './browser-service.js';

// 允许无限量的监听器
process.setMaxListeners(Infinity);
// 输出未捕获异常
process.on("uncaughtException", (err, origin) => {
    logger.error(`An unhandled error occurred: ${origin}`, err);
});
// 输出未处理的Promise.reject
process.on("unhandledRejection", (_, promise) => {
    promise.catch(err => logger.error("An unhandled rejection occurred:", err));
});
// 输出系统警告信息
process.on("warning", warning => logger.warn("System warning: ", warning));
// 进程退出监听
process.on("exit", () => {
    logger.info("Service exit");
    logger.footer();
});
// 进程被kill
process.on("SIGTERM", () => {
    logger.warn("received kill signal");
    browserService.close().finally(() => process.exit(2));
});
// Ctrl-C进程退出
process.on("SIGINT", () => {
    browserService.close().finally(() => process.exit(0));
});
```

### src/lib/config.ts
```typescript
import serviceConfig from "./configs/service-config.ts";
import systemConfig from "./configs/system-config.ts";

class Config {
    
    /** 服务配置 */
    service = serviceConfig;
    
    /** 系统配置 */
    system = systemConfig;

}

export default new Config();
```

### src/lib/http-status-codes.ts
```typescript
export default {

    CONTINUE: 100,  //客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应
    SWITCHING_PROTOCOLS: 101,  //服务器已经理解了客户端的请求，并将通过Upgrade 消息头通知客户端采用不同的协议来完成这个请求。在发送完这个响应最后的空行后，服务器将会切换到在Upgrade 消息头中定义的那些协议。只有在切换新的协议更有好处的时候才应该采取类似措施。例如，切换到新的HTTP 版本比旧版本更有优势，或者切换到一个实时且同步的协议以传送利用此类特性的资源
    PROCESSING: 102,  //处理将被继续执行

    OK: 200,  //请求已成功，请求所希望的响应头或数据体将随此响应返回
    CREATED: 201,  //请求已经被实现，而且有一个新的资源已经依据请求的需要而建立，且其 URI 已经随Location 头信息返回。假如需要的资源无法及时建立的话，应当返回 '202 Accepted'
    ACCEPTED: 202,  //服务器已接受请求，但尚未处理。正如它可能被拒绝一样，最终该请求可能会也可能不会被执行。在异步操作的场合下，没有比发送这个状态码更方便的做法了。返回202状态码的响应的目的是允许服务器接受其他过程的请求（例如某个每天只执行一次的基于批处理的操作），而不必让客户端一直保持与服务器的连接直到批处理操作全部完成。在接受请求处理并返回202状态码的响应应当在返回的实体中包含一些指示处理当前状态的信息，以及指向处理状态监视器或状态预测的指针，以便用户能够估计操作是否已经完成
    NON_AUTHORITATIVE_INFO: 203,  //服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝。当前的信息可能是原始版本的子集或者超集。例如，包含资源的元数据可能导致原始服务器知道元信息的超级。使用此状态码不是必须的，而且只有在响应不使用此状态码便会返回200 OK的情况下才是合适的
    NO_CONTENT: 204,  //服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。响应可能通过实体头部的形式，返回新的或更新后的元信息。如果存在这些头部信息，则应当与所请求的变量相呼应。如果客户端是浏览器的话，那么用户浏览器应保留发送了该请求的页面，而不产生任何文档视图上的变化，即使按照规范新的或更新后的元信息应当被应用到用户浏览器活动视图中的文档。由于204响应被禁止包含任何消息体，因此它始终以消息头后的第一个空行结尾
    RESET_CONTENT: 205,  //服务器成功处理了请求，且没有返回任何内容。但是与204响应不同，返回此状态码的响应要求请求者重置文档视图。该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。与204响应一样，该响应也被禁止包含任何消息体，且以消息头后的第一个空行结束
    PARTIAL_CONTENT: 206,  //服务器已经成功处理了部分 GET 请求。类似于FlashGet或者迅雷这类的HTTP下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。该请求必须包含 Range 头信息来指示客户端希望得到的内容范围，并且可能包含 If-Range 来作为请求条件。响应必须包含如下的头部域：Content-Range 用以指示本次响应中返回的内容的范围；如果是Content-Type为multipart/byteranges的多段下载，则每一段multipart中都应包含Content-Range域用以指示本段的内容范围。假如响应中包含Content-Length，那么它的数值必须匹配它返回的内容范围的真实字节数。Date和ETag或Content-Location，假如同样的请求本应该返回200响应。Expires, Cache-Control，和/或 Vary，假如其值可能与之前相同变量的其他响应对应的值不同的话。假如本响应请求使用了 If-Range 强缓存验证，那么本次响应不应该包含其他实体头；假如本响应的请求使用了 If-Range 弱缓存验证，那么本次响应禁止包含其他实体头；这避免了缓存的实体内容和更新了的实体头信息之间的不一致。否则，本响应就应当包含所有本应该返回200响应中应当返回的所有实体头部域。假如 ETag 或 Latest-Modified 头部不能精确匹配的话，则客户端缓存应禁止将206响应返回的内容与之前任何缓存过的内容组合在一起。任何不支持 Range 以及 Content-Range 头的缓存都禁止缓存206响应返回的内容
    MULTIPLE_STATUS: 207,  //代表之后的消息体将是一个XML消息，并且可能依照之前子请求数量的不同，包含一系列独立的响应代码

    MULTIPLE_CHOICES: 300,  //被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。除非这是一个HEAD请求，否则该响应应当包括一个资源特性及地址的列表的实体，以便用户或浏览器从中选择最合适的重定向地址。这个实体的格式由Content-Type定义的格式所决定。浏览器可能根据响应的格式以及浏览器自身能力，自动作出最合适的选择。当然，RFC 2616规范并没有规定这样的自动选择该如何进行。如果服务器本身已经有了首选的回馈选择，那么在Location中应当指明这个回馈的 URI；浏览器可能会将这个 Location 值作为自动重定向的地址。此外，除非额外指定，否则这个响应也是可缓存的
    MOVED_PERMANENTLY: 301,  //被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个URI之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。新的永久性的URI应当在响应的Location域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI的超链接及简短说明。如果这不是一个GET或者HEAD请求，因此浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。注意：对于某些使用 HTTP/1.0 协议的浏览器，当它们发送的POST请求得到了一个301响应的话，接下来的重定向请求将会变成GET方式
    FOUND: 302,  //请求的资源现在临时从不同的URI响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。新的临时性的URI应当在响应的 Location 域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI的超链接及简短说明。如果这不是一个GET或者HEAD请求，那么浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。注意：虽然RFC 1945和RFC 2068规范不允许客户端在重定向时改变请求的方法，但是很多现存的浏览器将302响应视作为303响应，并且使用GET方式访问在Location中规定的URI，而无视原先请求的方法。状态码303和307被添加了进来，用以明确服务器期待客户端进行何种反应
    SEE_OTHER: 303,  //对应当前请求的响应可以在另一个URI上被找到，而且客户端应当采用 GET 的方式访问那个资源。这个方法的存在主要是为了允许由脚本激活的POST请求输出重定向到一个新的资源。这个新的 URI 不是原始资源的替代引用。同时，303响应禁止被缓存。当然，第二个请求（重定向）可能被缓存。新的 URI 应当在响应的Location域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI的超链接及简短说明。注意：许多 HTTP/1.1 版以前的浏览器不能正确理解303状态。如果需要考虑与这些浏览器之间的互动，302状态码应该可以胜任，因为大多数的浏览器处理302响应时的方式恰恰就是上述规范要求客户端处理303响应时应当做的
    NOT_MODIFIED: 304,  //如果客户端发送了一个带条件的GET请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。该响应必须包含以下的头信息：Date，除非这个服务器没有时钟。假如没有时钟的服务器也遵守这些规则，那么代理服务器以及客户端可以自行将Date字段添加到接收到的响应头中去（正如RFC 2068中规定的一样），缓存机制将会正常工作。ETag或 Content-Location，假如同样的请求本应返回200响应。Expires, Cache-Control，和/或Vary，假如其值可能与之前相同变量的其他响应对应的值不同的话。假如本响应请求使用了强缓存验证，那么本次响应不应该包含其他实体头；否则（例如，某个带条件的 GET 请求使用了弱缓存验证），本次响应禁止包含其他实体头；这避免了缓存了的实体内容和更新了的实体头信息之间的不一致。假如某个304响应指明了当前某个实体没有缓存，那么缓存系统必须忽视这个响应，并且重复发送不包含限制条件的请求。假如接收到一个要求更新某个缓存条目的304响应，那么缓存系统必须更新整个条目以反映所有在响应中被更新的字段的值
    USE_PROXY: 305,  //被请求的资源必须通过指定的代理才能被访问。Location域中将给出指定的代理所在的URI信息，接收者需要重复发送一个单独的请求，通过这个代理才能访问相应资源。只有原始服务器才能建立305响应。注意：RFC 2068中没有明确305响应是为了重定向一个单独的请求，而且只能被原始服务器建立。忽视这些限制可能导致严重的安全后果
    UNUSED: 306,  //在最新版的规范中，306状态码已经不再被使用
    TEMPORARY_REDIRECT: 307,  //请求的资源现在临时从不同的URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。新的临时性的URI 应当在响应的Location域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI 的超链接及简短说明。因为部分浏览器不能识别307响应，因此需要添加上述必要信息以便用户能够理解并向新的 URI 发出访问请求。如果这不是一个GET或者HEAD请求，那么浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化

    BAD_REQUEST: 400,  //1.语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求 2.请求参数有误
    UNAUTHORIZED: 401,  //当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authorization 头信息的请求。如果当前请求已经包含了 Authorization 证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。参见RFC 2617
    PAYMENT_REQUIRED: 402,  //该状态码是为了将来可能的需求而预留的
    FORBIDDEN: 403,  //服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个HEAD请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个404响应，假如它不希望让客户端获得任何信息
    NOT_FOUND: 404,  //请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下
    METHOD_NOT_ALLOWED: 405,  //请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。鉴于PUT，DELETE方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误
    NO_ACCEPTABLE: 406,  //请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。除非这是一个 HEAD 请求，否则该响应就应当返回一个包含可以让用户或者浏览器从中选择最合适的实体特性以及地址列表的实体。实体的格式由Content-Type头中定义的媒体类型决定。浏览器可以根据格式及自身能力自行作出最佳选择。但是，规范中并没有定义任何作出此类自动选择的标准
    PROXY_AUTHENTICATION_REQUIRED: 407,  //与401响应类似，只不过客户端必须在代理服务器上进行身份验证。代理服务器必须返回一个Proxy-Authenticate用以进行身份询问。客户端可以返回一个Proxy-Authorization信息头用以验证。参见RFC 2617
    REQUEST_TIMEOUT: 408,  //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改
    CONFLICT: 409,  //由于和被请求的资源的当前状态之间存在冲突，请求无法完成。这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。该响应应当包含足够的信息以便用户发现冲突的源头。冲突通常发生于对PUT请求的处理中。例如，在采用版本检查的环境下，某次PUT提交的对特定资源的修改请求所附带的版本信息与之前的某个（第三方）请求向冲突，那么此时服务器就应该返回一个409错误，告知用户请求无法完成。此时，响应实体中很可能会包含两个冲突版本之间的差异比较，以便用户重新提交归并以后的新版本
    GONE: 410,  //被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用404状态码。除非额外说明，否则这个响应是可缓存的。410响应的目的主要是帮助网站管理员维护网站，通知用户该资源已经不再可用，并且服务器拥有者希望所有指向这个资源的远端连接也被删除。这类事件在限时、增值服务中很普遍。同样，410响应也被用于通知客户端在当前服务器站点上，原本属于某个个人的资源已经不再可用。当然，是否需要把所有永久不可用的资源标记为'410 Gone'，以及是否需要保持此标记多长时间，完全取决于服务器拥有者
    LENGTH_REQUIRED: 411,  //服务器拒绝在没有定义Content-Length头的情况下接受请求。在添加了表明请求消息体长度的有效Content-Length头之后，客户端可以再次提交该请求 
    PRECONDITION_FAILED: 412,  //服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。这个状态码允许客户端在获取资源时在请求的元信息（请求头字段数据）中设置先决条件，以此避免该请求方法被应用到其希望的内容以外的资源上
    REQUEST_ENTITY_TOO_LARGE: 413,  //服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。此种情况下，服务器可以关闭连接以免客户端继续发送此请求。如果这个状况是临时的，服务器应当返回一个 Retry-After 的响应头，以告知客户端可以在多少时间以后重新尝试
    REQUEST_URI_TOO_LONG: 414,  //请求的URI长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。这比较少见，通常的情况包括：本应使用POST方法的表单提交变成了GET方法，导致查询字符串（Query String）过长。重定向URI “黑洞”，例如每次重定向把旧的URI作为新的URI的一部分，导致在若干次重定向后URI超长。客户端正在尝试利用某些服务器中存在的安全漏洞攻击服务器。这类服务器使用固定长度的缓冲读取或操作请求的URI，当GET后的参数超过某个数值后，可能会产生缓冲区溢出，导致任意代码被执行[1]。没有此类漏洞的服务器，应当返回414状态码
    UNSUPPORTED_MEDIA_TYPE: 415,  //对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,  //如果请求中包含了Range请求头，并且Range中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义If-Range请求头，那么服务器就应当返回416状态码。假如Range使用的是字节范围，那么这种情况就是指请求指定的所有数据范围的首字节位置都超过了当前资源的长度。服务器也应当在返回416状态码的同时，包含一个Content-Range实体头，用以指明当前资源的长度。这个响应也被禁止使用multipart/byteranges作为其 Content-Type
    EXPECTION_FAILED: 417,  //在请求头Expect中指定的预期内容无法被服务器满足，或者这个服务器是一个代理服务器，它有明显的证据证明在当前路由的下一个节点上，Expect的内容无法被满足
    TOO_MANY_CONNECTIONS: 421,  //从当前客户端所在的IP地址到服务器的连接数超过了服务器许可的最大范围。通常，这里的IP地址指的是从服务器上看到的客户端地址（比如用户的网关或者代理服务器地址）。在这种情况下，连接数的计算可能涉及到不止一个终端用户
    UNPROCESSABLE_ENTITY: 422,  //请求格式正确，但是由于含有语义错误，无法响应
    FAILED_DEPENDENCY: 424,  //由于之前的某个请求发生的错误，导致当前请求失败，例如PROPPATCH
    UNORDERED_COLLECTION: 425,  //在WebDav Advanced Collections 草案中定义，但是未出现在《WebDAV 顺序集协议》（RFC 3658）中
    UPGRADE_REQUIRED: 426,  //客户端应当切换到TLS/1.0
    RETRY_WITH: 449,  //由微软扩展，代表请求应当在执行完适当的操作后进行重试

    INTERNAL_SERVER_ERROR: 500,  //服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器的程序码出错时出现
    NOT_IMPLEMENTED: 501, //服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，并且无法支持其对任何资源的请求
    BAD_GATEWAY: 502, //作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应
    SERVICE_UNAVAILABLE: 503,  //由于临时的服务器维护或者过载，服务器当前无法处理请求。这个状况是临时的，并且将在一段时间以后恢复。如果能够预计延迟时间，那么响应中可以包含一个 Retry-After 头用以标明这个延迟时间。如果没有给出这个 Retry-After 信息，那么客户端应当以处理500响应的方式处理它。注意：503状态码的存在并不意味着服务器在过载的时候必须使用它。某些服务器只不过是希望拒绝客户端的连接
    GATEWAY_TIMEOUT: 504,  //作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。注意：某些代理服务器在DNS查询超时时会返回400或者500错误
    HTTP_VERSION_NOT_SUPPORTED: 505,  //服务器不支持，或者拒绝支持在请求中使用的HTTP版本。这暗示着服务器不能或不愿使用与客户端相同的版本。响应中应当包含一个描述了为何版本不被支持以及服务器支持哪些协议的实体
    VARIANT_ALSO_NEGOTIATES: 506,  //服务器存在内部配置错误：被请求的协商变元资源被配置为在透明内容协商中使用自己，因此在一个协商处理中不是一个合适的重点
    INSUFFICIENT_STORAGE: 507,  //服务器无法存储完成请求所必须的内容。这个状况被认为是临时的
    BANDWIDTH_LIMIT_EXCEEDED: 509,  //服务器达到带宽限制。这不是一个官方的状态码，但是仍被广泛使用
    NOT_EXTENDED: 510  //获取资源所需要的策略并没有没满足

};
```

### src/lib/x-bogus.ts
```typescript
import { createHash } from "crypto";

const SHIFT_ARRAY =
  "Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe";
const MAGIC = 536919696;

function md5Hex(input: string): string {
  return createHash("md5").update(input).digest("hex");
}

function md5Double(input: string): string {
  const first = createHash("md5").update(input).digest();
  return createHash("md5").update(first).digest("hex");
}

function rc4Encrypt(plaintext: string, key: number[]): string {
  const sBox = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + sBox[i] + key[i % key.length]) & 0xff;
    [sBox[i], sBox[j]] = [sBox[j], sBox[i]];
  }
  let i2 = 0;
  let j2 = 0;
  let result = "";
  for (let k = 0; k < plaintext.length; k++) {
    i2 = (i2 + 1) & 0xff;
    j2 = (j2 + sBox[i2]) & 0xff;
    [sBox[i2], sBox[j2]] = [sBox[j2], sBox[i2]];
    const keystream = sBox[(sBox[i2] + sBox[j2]) & 0xff];
    result += String.fromCharCode(plaintext.charCodeAt(k) ^ keystream);
  }
  return result;
}

function b64Encode(
  input: string,
  alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
): string {
  const result: string[] = [];
  for (let i = 0; i < input.length; i += 3) {
    const num1 = input.charCodeAt(i);
    const num2 = i + 1 < input.length ? input.charCodeAt(i + 1) : -1;
    const num3 = i + 2 < input.length ? input.charCodeAt(i + 2) : -1;

    const arr1 = num1 >> 2;
    const arr2 = num2 >= 0 ? ((3 & num1) << 4) | (num2 >> 4) : (3 & num1) << 4;
    const arr3 = num2 >= 0 ? ((15 & num2) << 2) | (num3! >> 6) : 64;
    const arr4 = num3 >= 0 ? 63 & num3 : 64;

    result.push(alphabet[arr1], alphabet[arr2], alphabet[arr3], alphabet[arr4]);
  }
  return result.join("");
}

function filterList(numList: number[]): number[] {
  const indices = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  return indices.map((x) => numList[x - 1]);
}

function scramble(chars: number[]): string {
  const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s] = chars;
  return String.fromCharCode(
    a, k, b, l, c, m, d, n, e, o, f, p, g, q, h, r, i, s, j
  );
}

function computeChecksum(saltList: number[]): number {
  let cs = 64;
  for (let i = 3; i < saltList.length; i++) {
    cs ^= saltList[i];
  }
  return cs;
}

function xBogus(params: string, userAgent: string, timestamp: number, data: string = ""): string {
  const md5Data = md5Double(data);
  const md5Params = md5Double(params);

  const rc4Ua = rc4Encrypt(userAgent, [0, 1, 14]);
  const b64Ua = b64Encode(rc4Ua);
  const md5Ua = md5Hex(b64Ua);

  const md5ParamsBytes = Buffer.from(md5Params, "hex");
  const md5DataBytes = Buffer.from(md5Data, "hex");
  const md5UaBytes = Buffer.from(md5Ua, "hex");

  const saltList: number[] = [
    timestamp,
    MAGIC,
    64,
    0,
    1,
    14,
    md5ParamsBytes[md5ParamsBytes.length - 2],
    md5ParamsBytes[md5ParamsBytes.length - 1],
    md5DataBytes[md5DataBytes.length - 2],
    md5DataBytes[md5DataBytes.length - 1],
    md5UaBytes[md5UaBytes.length - 2],
    md5UaBytes[md5UaBytes.length - 1],
  ];

  // Python: range(24, -1, -8) = [24, 16, 8, 0] → 4 bytes
  saltList.push((timestamp >> 24) & 0xff);
  saltList.push((timestamp >> 16) & 0xff);
  saltList.push((timestamp >> 8) & 0xff);
  saltList.push(timestamp & 0xff);

  // Append magic as 4 big-endian bytes
  saltList.push((saltList[1] >> 24) & 0xff);
  saltList.push((saltList[1] >> 16) & 0xff);
  saltList.push((saltList[1] >> 8) & 0xff);
  saltList.push(saltList[1] & 0xff);

  saltList.push(computeChecksum(saltList));
  saltList.push(255);

  const numList = filterList(saltList);
  const rc4Result = rc4Encrypt(scramble(numList), [255]);

  const prefixed = "\x02\xff" + rc4Result;
  return b64Encode(prefixed, SHIFT_ARRAY);
}

/**
 * Sign URL params with X-Bogus
 * @param params Query string (e.g. "aid=513641&device_platform=web")
 * @param userAgent User-Agent string
 * @param data Request body (POST data)
 * @returns params with &X-Bogus=<value> appended
 */
export function signXBogus(params: string, userAgent: string, data: string = ""): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const bogus = xBogus(params, userAgent, timestamp, data);
  return params + "&X-Bogus=" + bogus;
}

```

### Dockerfile
```dockerfile
FROM node:lts AS BUILD_IMAGE

WORKDIR /app

COPY . /app

RUN yarn install --registry https://registry.npmmirror.com/ --ignore-engines && yarn run build

FROM node:lts

# 安装 Chromium 依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libwayland-client0 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=BUILD_IMAGE /app/configs /app/configs
COPY --from=BUILD_IMAGE /app/package.json /app/package.json
COPY --from=BUILD_IMAGE /app/dist /app/dist
COPY --from=BUILD_IMAGE /app/public /app/public
COPY --from=BUILD_IMAGE /app/node_modules /app/node_modules

WORKDIR /app

# 安装 Playwright Chromium 浏览器
RUN npx playwright-core install chromium

EXPOSE 8000

CMD ["npm", "start"]

```
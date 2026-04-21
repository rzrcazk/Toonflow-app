# Toonflow 视频生成全流程说明书

> 版本：1.1.5 | 数据库：PostgreSQL | 更新日期：2026-04-20

---

## 目录

1. [整体流程概览](#整体流程概览)
2. [数据库表总览与关系图](#数据库表总览与关系图)
3. [各阶段详细说明](#各阶段详细说明)
   - [阶段 0：创建项目](#阶段-0创建项目)
   - [阶段 1：导入原文 & 事件提取](#阶段-1导入原文--事件提取)
   - [阶段 2：剧本生成（scriptAgent）](#阶段-2剧本生成scriptAgent)
   - [阶段 3：资产提取](#阶段-3资产提取)
   - [阶段 4：资产图片生成（productionAgent）](#阶段-4资产图片生成productionAgent)
   - [阶段 5：导演规划 & 分镜生成](#阶段-5导演规划--分镜生成)
   - [阶段 6：分镜图片生成](#阶段-6分镜图片生成)
   - [阶段 7：视频生成](#阶段-7视频生成)
4. [数据库表结构详解](#数据库表结构详解)
5. [状态字段枚举速查](#状态字段枚举速查)
6. [Agent 记忆机制](#agent-记忆机制)

---

## 整体流程概览

```
[小说原文]
    │
    ▼ 阶段 0
[创建项目] → o_project
    │
    ▼ 阶段 1
[导入章节 & AI 事件提取] → o_novel → o_event → o_eventChapter
    │
    ▼ 阶段 2（scriptAgent 对话驱动）
    ├─ 2a 故事骨架 → o_agentWorkData.storySkeleton
    ├─ 2b 改编策略 → o_agentWorkData.adaptationStrategy
    └─ 2c 剧本内容 → o_script（每集一行）
    │
    ▼ 阶段 3
[AI 资产提取] → o_assets（角色/场景/道具）+ o_scriptAssets（关联关系）
    │
    ▼ 阶段 4（productionAgent）
[资产图片生成] → o_assets.imagePath + o_image
    │
    ▼ 阶段 5（productionAgent）
    ├─ 5a 导演规划（拍摄计划）
    ├─ 5b 分镜表构建
    └─ 5c 分镜面板写入 → o_storyboard + o_assets2Storyboard
    │
    ▼ 阶段 6
[分镜图片生成] → o_image（imageId 写回 o_storyboard）
    │
    ▼ 阶段 7
[视频生成] → o_video + o_tasks（任务记录）
```

---

## 数据库表总览与关系图

### 表分类

| 分类 | 表名 | 说明 |
|------|------|------|
| 配置类 | `o_user` | 用户账号 |
| 配置类 | `o_project` | 项目（IP/小说） |
| 配置类 | `o_vendorConfig` | AI 供应商配置（API Key 等） |
| 配置类 | `o_agentDeploy` | Agent 模型绑定配置 |
| 配置类 | `o_setting` | 系统全局设置 |
| 配置类 | `o_prompt` | 各类 AI 提示词模板 |
| 配置类 | `o_artStyle` | 美术风格库 |
| 业务类 | `o_novel` | 原文章节 |
| 业务类 | `o_event` | 章节事件 |
| 业务类 | `o_eventChapter` | 事件-章节细节 |
| 业务类 | `o_agentWorkData` | ScriptAgent 工作区（骨架/策略/剧本草稿） |
| 业务类 | `o_script` | 正式剧本（每集一行） |
| 业务类 | `o_assets` | 角色/场景/道具/衍生资产 |
| 业务类 | `o_scriptAssets` | 剧本-资产多对多关联 |
| 业务类 | `o_storyboard` | 分镜（每个镜头一行） |
| 业务类 | `o_assets2Storyboard` | 资产-分镜多对多关联 |
| 生成类 | `o_image` | AI 生成的图像记录 |
| 生成类 | `o_imageFlow` | 图像生成流程记录 |
| 生成类 | `o_video` | AI 生成的视频记录 |
| 生成类 | `o_videoTrack` | 视频轨道排列 |
| 追踪类 | `o_tasks` | 所有 AI 调用任务记录 |
| 追踪类 | `memories` | Agent 对话记忆（短期+摘要+向量） |

### ER 关系图

```
o_user (1)
  └── o_project (n)          [o_project.userId → o_user.id]
        │
        ├── o_novel (n)       [o_novel.projectId → o_project.id]
        │     ├── o_event (n)          [o_event.novelId → o_novel.id]
        │     │     └── o_eventChapter (n)  [o_eventChapter.eventId → o_event.id]
        │     │                             [o_eventChapter.novelId → o_novel.id]
        │     └── o_script (n)         [o_script.novelId → o_novel.id]
        │                              [o_script.projectId → o_project.id]
        │
        ├── o_script (n)      （同上，双 FK：novelId + projectId）
        │     ├── o_scriptAssets (n)   [o_scriptAssets.scriptId → o_script.id]
        │     └── o_storyboard (n)     [o_storyboard.scriptId → o_script.id]
        │           ├── o_assets2Storyboard (n) [storyboardId → o_storyboard.id]
        │           ├── o_image (1)             [o_storyboard.imageId → o_image.id]
        │           └── o_video (n)             [o_video.storyboardId → o_storyboard.id]
        │                 └── o_videoTrack (n)  [videoId → o_video.id]
        │
        ├── o_assets (n)      [o_assets.projectId → o_project.id]
        │     ├── o_scriptAssets (n)         [assetsId → o_assets.id]
        │     ├── o_assets2Storyboard (n)    [assetsId → o_assets.id]
        │     └── o_assetsRole2Audio (n)     [assetsId → o_assets.id]
        │
        ├── o_image (n)       [o_image.projectId → o_project.id]
        │     └── o_imageFlow (n)   [imageId → o_image.id]
        │
        ├── o_video (n)       [o_video.projectId → o_project.id]
        │                     [o_video.scriptId → o_script.id]
        │
        ├── o_tasks (n)       [o_tasks.projectId → o_project.id]
        └── o_agentWorkData (n) [projectId → o_project.id]

memories （软关联）  isolationKey = "{projectId}:{agentType}[:{episodesId}]"
```

---

## 各阶段详细说明

---

### 阶段 0：创建项目

**目的**：定义 IP/小说基本信息和生产参数

**写入表**：`o_project`

| 字段 | 说明 | 示例 |
|------|------|------|
| name | 项目/小说名称 | 斗破苍穹 |
| intro | 简介 | 讲述了萧炎... |
| type | 小说类型 | 玄幻 |
| artStyle | 美术风格 | 国漫水墨 |
| directorManual | 导演手册名称 | 东方玄幻 |
| imageModel | 图像生成模型 | `volcengine:seedream-3-0` |
| videoModel | 视频生成模型 | `volcengine:seedance2` |
| videoRatio | 视频比例 | `9:16` |
| mode | 视频模式 | `"首尾帧"` 或 `["多参数"]` |
| imageQuality | 图像质量 | standard / high |

---

### 阶段 1：导入原文 & 事件提取

**目的**：将小说章节导入系统，AI 提炼每章核心事件

**涉及表**：`o_novel`、`o_event`、`o_eventChapter`

#### 流程

```
用户上传原文
    │
    ▼
POST /novel/add
    │
    ├── 写入 o_novel（chapterData=原文，eventState=0）
    │
    ▼
后台 cleanNovel 异步任务
    │
    ├── AI 分析 chapterData → 提炼事件列表
    ├── 写入 o_event（name, content）
    ├── 写入 o_eventChapter（细节拆分）
    └── 回写 o_novel.eventState = 1（成功）或 -1（失败）
```

#### `o_novel.eventState` 状态流转

```
0（生成中） ──成功──▶ 1（完成）
           ──失败──▶ -1（失败）
软件重启修复：0 → -1（fixDB.ts 处理）
```

#### 关键字段说明

- `o_novel.event`：AI 生成的事件摘要（JSON 字符串，冗余字段，具体数据在 `o_event`）
- `o_event.content`：完整事件描述，供后续剧本生成参考
- `o_eventChapter`：将事件进一步拆分为更小的章节段落，用于细粒度检索

---

### 阶段 2：剧本生成（scriptAgent）

**目的**：由 AI 对话驱动，分三步生成正式剧本

**涉及表**：`o_agentWorkData`、`o_script`、`memories`

#### 三层 Agent 架构

```
用户发起对话
    │
    ▼
scriptAgent（决策层）
    ├── scriptAgent:decisionAgent   → 规划任务
    ├── scriptAgent:supervisionAgent → 审核质量
    └── 执行子 Agent（按任务分派）
          ├── storySkeletonAgent   → 子阶段 2a
          ├── adaptationStrategyAgent → 子阶段 2b
          └── scriptAgent         → 子阶段 2c
```

#### 子阶段 2a：故事骨架生成

- **Agent**：`scriptAgent:storySkeletonAgent`
- **读取**：`o_novel`（事件、原文）via 工具 `get_novel_events` / `get_novel_text`
- **产物**：写入 `o_agentWorkData.data.storySkeleton`（JSON 工作区）

故事骨架包含：人物关系、主线剧情结构、关键转折点、世界观设定

#### 子阶段 2b：改编策略生成

- **Agent**：`scriptAgent:adaptationStrategyAgent`
- **读取**：`o_agentWorkData.storySkeleton`（故事骨架）
- **产物**：写入 `o_agentWorkData.data.adaptationStrategy`

改编策略包含：分集规划（几集）、每集重点、删改原则、节奏把控

#### 子阶段 2c：剧本内容生成

- **Agent**：`scriptAgent:scriptAgent`
- **读取**：工作区骨架 + 改编策略 + 已有 `o_script`（断点续写）
- **产物格式**：

```xml
<scriptItem name="第1集">
  第一场 内景·萧家书房·日
  萧炎：（愤怒）斗气，消失了...
  ...
</scriptItem>
```

- **写入路由**：`POST /scriptAgent/setPlanData`
  - name 存在则 UPDATE `o_script.content`
  - name 不存在则 INSERT 新行
  - 同时更新 `o_agentWorkData.data.script` 草稿

#### `o_agentWorkData.data` 结构

```json
{
  "storySkeleton": "故事骨架全文...",
  "adaptationStrategy": "改编策略全文...",
  "script": [
    { "id": 1, "name": "第1集", "content": "剧本正文..." },
    { "id": 2, "name": "第2集", "content": "..." }
  ]
}
```

#### 记忆存储（`memories` 表）

| isolationKey 格式 | 说明 |
|-------------------|------|
| `{projectId}:scriptAgent` | scriptAgent 的所有对话记忆 |
| `{projectId}:productionAgent:{scriptId}` | productionAgent 按集隔离 |

记忆类型：
- `type=message`：原始对话消息
- `type=summary`：AI 生成的摘要（每 3 条消息自动触发）
- `embedding`：向量，用于 RAG 语义检索

---

### 阶段 3：资产提取

**目的**：从剧本文本中 AI 识别并抽取角色、场景、道具

**涉及表**：`o_script`（读）、`o_assets`（写）、`o_scriptAssets`（写关联）

#### 流程

```
POST /script/extractAssets
    │
    ├── o_script.extractState → 2（等待队列）
    │
    ▼ 异步处理
    ├── o_script.extractState → 0（提取中）
    ├── AI 分析剧本文本（o_prompt 表中 type=scriptAssetExtraction 的提示词）
    ├── 识别角色/场景/道具
    ├── 写入 o_assets（type: role / scene / tool）
    ├── 写入 o_scriptAssets（scriptId + assetsId 建立关联）
    └── o_script.extractState → 1（完成）或 -1（失败）
```

#### `o_script.extractState` 状态流转

```
2（等待队列）→ 0（提取中）→ 1（完成）
                          → -1（失败）
软件重启修复：0 → -1
```

#### `o_assets.type` 枚举

| 值 | 说明 |
|----|------|
| `role` | 角色（人物） |
| `scene` | 场景（地点/环境） |
| `tool` | 道具/物品 |
| `clip` | 衍生资产（由 productionAgent 补充） |

#### 多对多关联说明

一个剧本 (`o_script`) 可以使用多个资产 (`o_assets`)，
同一个资产（如主角）可以出现在多个剧本集中。
关联通过 `o_scriptAssets` 表维护：

```
o_script ─────── o_scriptAssets ─────── o_assets
  (id)        (scriptId, assetsId)         (id)
```

---

### 阶段 4：资产图片生成（productionAgent）

**目的**：为每个角色/场景/道具生成固定参考图

**涉及表**：`o_assets`（读+写）、`o_image`（写）、`o_scriptAssets`（写衍生关联）

#### 子阶段 4a：衍生资产分析

- **Agent**：`productionAgent:deriveAssetsAgent`
- 分析剧本后补充 productionAgent 认为需要的额外资产（type=`clip`）
- 工具 `add_deriveAsset`：INSERT `o_assets` + INSERT `o_scriptAssets`
- 工具 `del_deriveAsset`：DELETE `o_assets` + DELETE `o_scriptAssets`

#### 子阶段 4b：图片生成

- **Agent**：`productionAgent:generateAssetsAgent`
- 工具 `generate_deriveAsset`：触发前端 socket 事件开始生成

#### `o_assets.promptState` 状态流转

```
待生成 → 生成中 → 生成完成
                → 生成失败
软件重启修复：生成中 → 生成失败
```

生成成功后写入：
- `o_assets.imagePath`：图片本地路径
- `o_assets.prompt`：实际使用的英文提示词

---

### 阶段 5：导演规划 & 分镜生成

**目的**：将剧本文本转化为结构化分镜（每个镜头一行）

**涉及表**：`o_storyboard`（写）、`o_assets2Storyboard`（写关联）

#### 三个子阶段

```
productionAgent:directorPlanAgent
    │ 输出：<scriptPlan> 拍摄计划
    ▼
productionAgent:storyboardTableAgent
    │ 输出：<storyboardTable> 结构化分镜表
    ▼
productionAgent:storyboardPanelAgent
    │ 输出：<storyboardItem> 写入数据库
    ▼
写入 o_storyboard + o_assets2Storyboard
```

#### `o_storyboard` 分镜数据结构

每行代表一个镜头，核心字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| scriptId | 所属剧本集 | 1 |
| content | videoDesc 结构化描述 | 场景、人物、动作、台词、光影... |
| prompt | 图像生成提示词（英文） | masterpiece, 1girl, ... |
| track | 分组轨道 | main |
| duration | 镜头时长（秒） | 4 |
| state | 图片生成状态 | 待生成 |
| imageId | 生成后关联的图像 | 42 |

#### storyboardItem XML 格式（Agent 产物）

```xml
<storyboardItem
  videoDesc='内景·书房·日光/萧炎站在书桌前/愤怒表情，握拳/台词："斗气消失了！"/...'
  prompt='interior, study room, daylight, 1boy, angry expression, clenched fist, ...'
  track='main'
  duration='4'
  shouldGenerateImage='true'
  associateAssetsIds='["A001","A003"]'>
</storyboardItem>
```

#### 资产-分镜关联

每个分镜可以关联多个资产（通过 `associateAssetsIds`），
写入 `o_assets2Storyboard`（多对多）：

```
o_assets ─── o_assets2Storyboard ─── o_storyboard
  (id)      (assetsId, storyboardId)     (id)
```

---

### 阶段 6：分镜图片生成

**目的**：为每个分镜生成参考图（用作视频首帧或参考）

**涉及表**：`o_storyboard`（状态更新）、`o_image`（写入）、`o_imageFlow`（日志）

#### 流程

```
触发生成（批量或单个）
    │
    ├── o_storyboard.state → 生成中
    │
    ▼ 调用图像 AI（imageModel）
    ├── 写入 o_image（projectId, imagePath, prompt, state）
    ├── 写入 o_imageFlow（生成过程记录）
    └── 回写 o_storyboard.imageId = o_image.id
        o_storyboard.state = 生成完成 / 生成失败
```

#### `o_storyboard.state` 状态流转

```
待生成 → 生成中 → 生成完成
                → 生成失败
软件重启修复：生成中 → 生成失败
```

---

### 阶段 7：视频生成

**目的**：基于分镜图 + 分镜描述，调用视频 AI 生成最终视频片段

**涉及表**：`o_video`（写）、`o_tasks`（记录）、`o_videoTrack`（轨道）

#### 视频提示词格式（依模型不同）

| 模型/模式 | 提示词格式 |
|-----------|-----------|
| Seedance 2.0 + 多参模式 | 中文结构化，图片引用 `@图1`、`@图2` |
| Wan 2.6 | 英文叙事式描述 |
| 通用多参模式 | `[References]\n...\n[Instruction]\n...`（英文） |
| 通用首尾帧模式 | 五维度英文纯文本（场景/人物/动作/镜头/氛围） |

#### 流程

```
用户触发视频生成（分镜为单位）
    │
    ├── 写入 o_video（storyboardId, scriptId, projectId, prompt, state=生成中）
    │
    ▼ 调用视频 AI（videoModel）
    ├── 写入 o_tasks（taskClass, model, state=进行中）
    │
    ▼ 轮询 / 回调
    ├── 成功：o_video.videoPath = 视频路径，state=生成完成
    │         o_tasks.state = 已完成
    └── 失败：o_video.errorReason, state=生成失败
              o_tasks.state = 生成失败
```

#### `o_video.state` 状态流转

```
待生成 → 生成中 → 生成完成
                → 生成失败
```

#### `o_tasks` 任务记录说明

每次 AI 调用（图像/视频）都会写入 `o_tasks` 一行，用于：
- 成本追踪（记录使用的模型）
- 失败排查（reason 字段）
- 任务管理（前端轮询 state）

---

## 数据库表结构详解

### o_project（项目表）

```sql
id           SERIAL PRIMARY KEY
name         TEXT             -- 项目名
intro        TEXT             -- 简介
type         TEXT             -- 类型（玄幻/都市等）
projectType  VARCHAR(100)     -- 项目类型
artStyle     TEXT             -- 美术风格名
directorManual TEXT           -- 导演手册名
imageModel   VARCHAR(200)     -- 图像模型（vendorId:modelName）
imageQuality VARCHAR(100)     -- 图像质量
videoModel   VARCHAR(200)     -- 视频模型（vendorId:modelName）
videoRatio   TEXT             -- 视频比例（9:16 / 16:9）
mode         TEXT             -- 视频模式（JSON数组=多参，字符串=首尾帧）
userId       BIGINT FK        -- 创建者
createTime   BIGINT           -- 创建时间戳
```

### o_novel（原文章节表）

```sql
id           SERIAL PRIMARY KEY
projectId    INTEGER FK o_project.id
chapterIndex INTEGER          -- 章节序号（旧）
reel         VARCHAR(100)     -- 卷号
chapter      VARCHAR(200)     -- 章节标题
chapterData  TEXT             -- 章节全文
event        TEXT             -- AI提炼事件摘要（JSON冗余字段）
order        INTEGER          -- 排序
eventState   INTEGER          -- 0=生成中 1=完成 -1=失败
errorReason  TEXT             -- 失败原因
createTime   BIGINT
```

### o_event（事件表）

```sql
id           SERIAL PRIMARY KEY
novelId      INTEGER FK o_novel.id
name         VARCHAR(200)     -- 事件名称
content      TEXT             -- 事件详情
order        INTEGER          -- 排序
```

### o_eventChapter（事件章节细节表）

```sql
id           SERIAL PRIMARY KEY
eventId      INTEGER FK o_event.id
novelId      INTEGER FK o_novel.id
name         VARCHAR(200)
content      TEXT
order        INTEGER
```

### o_agentWorkData（Agent 工作区表）

```sql
id           SERIAL PRIMARY KEY
projectId    INTEGER FK o_project.id
episodesId   INTEGER          -- 集数ID（productionAgent 按集隔离）
key          VARCHAR(100)     -- scriptAgent / productionAgent
data         TEXT             -- JSON工作区数据
createTime   DATETIME
updateTime   DATETIME
```

**data 字段（key=scriptAgent）示例：**

```json
{
  "storySkeleton": "主线骨架内容...",
  "adaptationStrategy": "改编策略内容...",
  "script": [
    {"id": 1, "name": "第1集", "content": "剧本正文..."}
  ]
}
```

### o_script（剧本表）

```sql
id           SERIAL PRIMARY KEY
novelId      INTEGER FK o_novel.id  -- 关联的原文章节
projectId    INTEGER FK o_project.id
name         VARCHAR(200)     -- 集名称（第1集）
content      TEXT             -- 剧本正文
order        INTEGER          -- 排序
extractState INTEGER          -- 0=提取中 1=完成 2=等待 -1=失败
errorReason  TEXT
```

### o_assets（资产表）

```sql
id           SERIAL PRIMARY KEY
projectId    INTEGER FK o_project.id
name         VARCHAR(200)     -- 资产名称（角色名/场景名）
type         VARCHAR(50)      -- role / scene / tool / clip
describe     TEXT             -- 中文描述（20-80字视觉化）
prompt       TEXT             -- 英文提示词（用于图像生成）
promptState  VARCHAR(50)      -- 待生成/生成中/生成完成/生成失败
promptErrorReason TEXT
imagePath    VARCHAR(500)     -- 已生成图片路径
```

### o_scriptAssets（剧本-资产关联表）

```sql
id           SERIAL PRIMARY KEY
scriptId     INTEGER FK o_script.id
assetsId     INTEGER FK o_assets.id
```

### o_storyboard（分镜表）

```sql
id           SERIAL PRIMARY KEY
scriptId     INTEGER FK o_script.id
content      TEXT             -- videoDesc 结构化描述
track        VARCHAR(100)     -- 轨道（main）
duration     INTEGER          -- 时长（秒，默认3）
state        VARCHAR(50)      -- 待生成/生成中/生成完成/生成失败
reason       TEXT             -- 失败原因
prompt       TEXT             -- 图像提示词
imageId      INTEGER FK o_image.id  -- 关联生成图像
```

### o_assets2Storyboard（资产-分镜关联表）

```sql
id           SERIAL PRIMARY KEY
assetsId     INTEGER FK o_assets.id
storyboardId INTEGER FK o_storyboard.id
```

### o_image（图像表）

```sql
id           SERIAL PRIMARY KEY
projectId    INTEGER FK o_project.id
type         VARCHAR(100)     -- 图像用途类型
state        VARCHAR(50)      -- 状态（同上枚举）
errorReason  TEXT
imagePath    TEXT             -- 文件路径或 Base64
prompt       TEXT             -- 生成提示词
width        INTEGER
height       INTEGER
```

### o_imageFlow（图像流程记录表）

```sql
id           SERIAL PRIMARY KEY
imageId      INTEGER FK o_image.id
flowType     VARCHAR(100)     -- 流程类型
data         TEXT             -- JSON流程数据
```

### o_video（视频表）

```sql
id           SERIAL PRIMARY KEY
projectId    INTEGER FK o_project.id
scriptId     INTEGER FK o_script.id
storyboardId INTEGER FK o_storyboard.id  -- 关联分镜（首帧图来源）
state        VARCHAR(50)      -- 状态（同上枚举）
errorReason  TEXT
videoPath    VARCHAR(500)     -- 视频文件路径
prompt       TEXT             -- 视频生成提示词
duration     INTEGER          -- 时长（秒）
width        INTEGER
height       INTEGER
```

### o_tasks（任务记录表）

```sql
id           SERIAL PRIMARY KEY
projectId    INTEGER FK o_project.id
taskClass    VARCHAR(100)     -- 任务分类
relatedObjects VARCHAR(500)  -- 相关对象JSON
model        VARCHAR(200)     -- 使用模型
describe     TEXT             -- 任务描述
state        VARCHAR(50)      -- 进行中/已完成/生成失败
startTime    INTEGER          -- 开始时间戳
reason       TEXT             -- 失败原因
```

### memories（Agent 记忆表）

```sql
id           VARCHAR PK       -- UUID
agentId      VARCHAR          -- scriptAgent / productionAgent
isolationKey VARCHAR          -- {projectId}:{agentType}[:{episodesId}]
type         VARCHAR          -- message / summary
role         VARCHAR          -- user / assistant:decision / assistant:execution
name         VARCHAR          -- 发言者显示名
content      TEXT             -- 记忆内容
embedding    TEXT             -- 向量（JSON数组，用于RAG）
relatedMessageIds TEXT        -- 关联消息ID（JSON数组）
summarized   BOOLEAN          -- 是否已被摘要
metadata     JSONB            -- 附加元数据
score        DECIMAL          -- 相似度得分
createTime   BIGINT
```

---

## 状态字段枚举速查

| 表 | 字段 | 状态值 |
|----|------|--------|
| `o_novel` | eventState | `0`=生成中 \| `1`=完成 \| `-1`=失败 |
| `o_script` | extractState | `0`=提取中 \| `1`=完成 \| `2`=等待 \| `-1`=失败 |
| `o_assets` | promptState | `待生成` \| `生成中` \| `生成完成` \| `生成失败` |
| `o_storyboard` | state | `待生成` \| `生成中` \| `生成完成` \| `生成失败` |
| `o_image` | state | `待生成` \| `生成中` \| `生成完成` \| `生成失败` |
| `o_video` | state | `待生成` \| `生成中` \| `生成完成` \| `生成失败` |
| `o_tasks` | state | `进行中` \| `已完成` \| `生成失败` |

**注意**：软件异常重启后，`fixDB.ts` 会将所有 `生成中/进行中/0` 状态重置为失败状态，避免僵死任务。

---

## Agent 记忆机制

### 三层记忆结构

```
get() 读取时混合三层：
  ┌─ shortTerm ──▶ 最近 5 条未被摘要的 message（最新上下文）
  ├─ summaries ──▶ 最近 10 条 summary（中期压缩记忆）
  └─ RAG ────────▶ 向量相似搜索 3 条历史（远期语义检索）
```

### 自动摘要触发

```
每写入 3 条 message
    │
    ▼
取最早一批消息 → AI 生成摘要
    │
    ├── 写入 memories（type=summary）
    └── 原始消息标记 summarized=1
```

### 隔离键规则

| Agent | isolationKey | 说明 |
|-------|-------------|------|
| scriptAgent | `{projectId}:scriptAgent` | 整个项目共享一套记忆 |
| productionAgent | `{projectId}:productionAgent:{scriptId}` | 按集（每集剧本）独立隔离 |

---

*文档由 Claude Code 根据源码自动生成，如有疑问可对照源码：*
- *数据库初始化：[src/lib/initPg.ts](../src/lib/initPg.ts)*
- *表类型定义：[src/types/database.d.ts](../src/types/database.d.ts)*
- *Agent 入口：[src/agents/scriptAgent/index.ts](../src/agents/scriptAgent/index.ts)*
- *记忆模块：[src/utils/agent/memory.ts](../src/utils/agent/memory.ts)*

[35m项目结构 (全在线递归扫描)[0m
```
[dir] configs
[dir] configs/dev
[dir] doc
[dir] docs
[dir] public
[dir] scripts
[dir] src
[dir] src/api
[dir] src/lib
[dir] src/lib/configs
[dir] src/lib/consts
[dir] src/lib/exceptions
[dir] src/lib/interfaces
[dir] src/lib/request
[dir] src/lib/response
[file] .dockerignore
[file] .gitattributes
[file] .gitignore
[file] .trae_tmp_clone
[file] CLAUDE.md
[file] Dockerfile
[file] LICENSE
[file] README.md
[file] doc/example-0.png
[file] doc/example-1.jpeg
[file] docs/JIMENG-4.1-4.5.md
[file] docs/curl(node.js)_jimeng-5.0lite.txt
[file] docs/curl.txt
[file] docs/curl2.txt
[file] docs/curl20260401.md
[file] libs.d.ts
[file] package-lock.json
[file] package.json
[file] public/welcome.html
[file] scripts/logout-sessions.py
[file] src/daemon.ts
[file] src/index.ts
[file] src/lib/browser-service.ts
[file] src/lib/config.ts
[file] src/lib/environment.ts
[file] src/lib/http-status-codes.ts
[file] src/lib/initialize.ts
[file] src/lib/logger.ts
[file] src/lib/server.ts
[file] src/lib/util.ts
[file] src/lib/x-bogus.ts
[file] src/lib/x-gnarly.ts
[file] test-async-video.py
[file] test-international-seedance.py
[file] test-international-video-3.py
[file] test-multi-region.py
[file] test-seedance-media.py
[file] test-seedance-media.sh
[file] tsconfig.json
[file] vercel.json
[file] yarn.lock
```

[35m主要语言: [0mNode.js

[35m关键文档内容[0m

[35m文件: LICENSE[0m
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
  

[33m... (文档截断)[0m

------------------------------------------------------------


[35m文件: README.md[0m
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
│   │   └── consts/              # API 常量和异常
│   └── lib/
│       ├── server.ts            # Koa 服务器配置
│       ├── browser-service.ts   # 浏览器代理服务（Seedance 反爬）
│       ├── config.ts            # 配置管理
│       ├── logger.ts            # 日志工具
│       ├── util.ts              # 辅助工具
│       ├── request/             # 请求处理类
│       ├── response/            # 响应处理类
│       ├── exceptions/          # 异常类
│       └── configs/             # 配置模式
├── configs/                     # 配置文件目录
├── scripts/                     # 工具脚本目录
│   └── logout-sessions.py       # 历史 Session 强制退出工具
├── doc/                         # 文档资源
├── Dockerfile                   # Docker 构建文件
├── package.json                 # 项目配置
└── tsconfig.json                # TypeScript 配置
```

## 模型说明

### 文生图模型

| 用户模型名 | 内部模型名 | 说明 |
|-----------|-----------|------|
| `jimeng-5.0` | `high_aes_general_v50` | 5.0 正式版，最新模型 |
| `jimeng-4.6` | `high_aes_general_v42` | 最新模型，推荐使用 |
| `jimeng-4.5` | `high_aes_general_v40l` | 高质量模型 |
| `jimeng-4.1` | `high_aes_general_v41` | 高质量模型 |
| `jimeng-4.0` | `high_aes_general_v40` | 稳定版本 |
| `jimeng-3.1` | `high_aes_general_v30l_art_fangzhou` | 艺术风格 |
| `jimeng-3.0` | `high_aes_general_v30l` | 通用模型 |
| `jimeng-2.1` | - | 旧版模型 |
| `jimeng-2.0-pro` | - | 旧版专业模型 |
| `jimeng-2.0` | - | 旧版模型 |
| `jimeng-1.4` | - | 早期模型 |
| `jimeng-xl-pro` | - | XL 专业模型 |

### 视频模型

| 用户模型名 | 内部模型名 | 说明 |
|-----------|-----------|------|
| `jimeng-video-3.5-pro` | `dreamina_ic_generate_video_model_vgfm_3.5_pro` | 最新视频模型 |
| `jimeng-video-3.0` | `dreamina_ic_generate_video_model_vgfm_3.0` | 视频生成 3.0 |
| `jimeng-video-3.0-pro` | `dreamina_ic_generate_video_model_vgfm_3.0_pro` | 视频生成 3.0 专业版 |
| `jimeng-video-seedance-2.0` | `dreamina_seedance_40_pro` | Seedance 2.0（上游标准名称，推荐） |
| `seedance-2.0` | `dreamina_seedance_40_pro` | Seedance 2.0（向后兼容别名） |
| `seedance-2.0-pro` | `dreamina_seedance_40_pro` | Seedance 2.0（向后兼容别名） |
| `jimeng-video-seedance-2.0-fast` | `dreamina_seedance_40` | Seedance 2.0-fast 快速版（上游标准名称） |
| `seedance-2.0-fast` | `dreamina_seedance_40` | Seedance 2.0-fast 快速版（向后兼容别名） |
| `jimeng-video-seedance-2.0-fast-vip` | `dreamina_seedance_40_vision` | Seedance 2.0 Fast VIP Vision 极速推理版（会员专属通道） |
| `seedance-2.0-fast-vip` | `dreamina_seedance_40_vision` | Seedance 2.0 Fast VIP Vision（向后兼容别名） |
| `jimeng-video-seedance-2.0-vip` | `dreamina_seedance_40_pro_vision` | Seedance 2.0 VIP Vision 主模态能力版（会员专属通道） |
| `seedance-2.0-vip` | `dreamina_seedance_40_pro_vision` | Seedance 2.0 VIP Vision（向后兼容别名） |

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

## API 详细文档

### 图像生成接口

**POST /v1/images/generations**

统一接口，支持文生图和图生图两种模式：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | jimeng-4.5 | 模型名称 |
| prompt | string | 是 | - | 提示词，支持多图生成 |
| images | array | 否 | - | 图片URL数组（1-10张），提供则走图生图模式，不提供则走文生图模式 |
| negative_prompt | string | 否 | "" | 反向提示词 |
| ratio | string | 否 | 1:1 | 宽高比 |
| resolution | string | 否 | 2k | 分辨率：1k, 2k, 4k |
| sample_strength | number | 否 | 0.5 | 精细度 0-1 |
| response_format | string | 否 | url | url 或 b64_json |

**说明：**
- 当 `images` 参数为空或不提供时，接口执行文生图功能
- 当 `images` 参数提供（1-10张图片）时，接口执行图生图功能
- 支持 `application/json`（images 为 URL 数组）和 `multipart/form-data`（通过 images 字段上传文件）两种请求格式
- 图生图模式下，响应会额外包含 `input_images` 和 `composition_type` 字段

### 图生图接口（向后兼容）

**POST /v1/images/compositions**

保留此接口以确保向后兼容，功能与 `/v1/images/generations` 提供 `images` 参数时相同。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | jimeng-4.5 | 模型名称 |
| prompt | string | 是 | - | 提示词 |
| images | array | 是 | - | 图片URL数组，1-10张 |
| ratio | string | 否 | 1:1 | 宽高比 |
| resolution | string | 否 | 2k | 分辨率 |

### 视频生成接口

**POST /v1/videos/generations**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | jimeng-video-3.0 | 模型名称 |
| prompt | string | 是 | - | 视频描述 |
| ratio | string | 否 | 1:1 | 宽高比 |
| resolution | string | 否 | 720p | 分辨率：480p, 720p, 1080p |
| duration | number | 否 | 5 | 时长：4-15 秒（Seedance）、5 或 10 秒（普通） |
| file_paths | array | 否 | [] | 首帧/尾帧图片URL |

### 异步视频生成接口

由于即梦平台排队时间较长，同步接口可能阻塞等待 10-20 分钟。异步接口将提交和查询分离，避免长时间占用连接。

#### 提交异步任务

**POST /v1/videos/generations/async**

请求参数与同步接口 `POST /v1/videos/generations` 完全一致，但立即返回 `task_id` 而非等待视频生成完成。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | jimeng-video-3.0 | 模型名称 |
| prompt | string | 是 | - | 视频描述 |
| ratio | string | 否 | 1:1 | 宽高比 |
| resolution | string | 否 | 720p | 分辨率：480p, 720p, 1080p |
| duration | number | 否 | 5 | 时长：4-15 秒（Seedance）、5 或 10 秒（普通） |
| file_paths | array | 否 | [] | 首帧/尾帧/素材图片URL |
| files | file[] | 否 | - | 上传的素材文件（multipart） |

**响应示例：**

```json
{
  "created": 1774778941,
  "task_id": "4f2acc30-2b57-11f1-9361-e959a88411c4",
  "status": "processing",
  "message": "任务已提交，请使用 GET /v1/videos/generations/async/{task_id} 查询结果"
}
```

**调用示例：**

```bash
# 提交普通视频生成任务
curl -X POST http://localhost:8000/v1/videos/generations/async \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_sessionid" \
  -d '{
    "model": "jimeng-video-3.5-pro",
    "prompt": "一只小猫在草地上奔跑",
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5
  }'

# 提交 Seedance 异步任务（JSON + 图片URL）
curl -X POST http://localhost:8000/v1/videos/generations/async \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_sessionid" \
  -d '{
    "model": "seedance-2.0-fast",
    "prompt": "@1 图片中的人物开始微笑",
    "ratio": "4:3",
    "duration": 4,
    "file_paths": ["https://example.com/image.jpg"]
  }'

# 提交 Seedance 异步任务（multipart 文件上传）
curl -X POST http://localhost:8000/v1/videos/generations/async \
  -H "Authorization: Bearer your_sessionid" \
  -F "model=seedance-2.0" \
  -F "prompt=@1 和 @2 两人开始跳舞" \
  -F "ratio=4:3" \
  -F "duration=4" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

#### 查询异步任务结果

**GET /v1/videos/generations/async/:taskId**

传入提交时返回的 `task_id`，服务端会阻塞等待视频生成完成后返回结果，无需客户端轮询。

**成功响应：**

```json
{
  "created": 1774778988,
  "task_id": "4f2acc30-2b57-11f1-9361-e959a88411c4",
  "status": "succeeded",
  "data": [{
    "url": "https://v3-dreamnia.jimeng.com/.../video.mp4",
    "revised_prompt": "一只小猫在草地上奔跑"
  }]
}
```

**失败响应：**

```json
{
  "created": 1774778988,
  "task_id": "4f2acc30-2b57-11f1-9361-e959a88411c4",
  "status": "failed",
  "error": "[API_IMAGE_GENERATION_FAILED] 视频生成超时"
}
```

**调用示例：**

```bash
curl http://localhost:8000/v1/videos/generations/async/4f2acc30-2b57-11f1-9361-e959a88411c4 \
  --header 'Authorization: Bearer your_sessionid'
```

> **注意：**
> - 异步任务最多支持 **10 个并发**，超出限制时提交接口返回错误提示
> - 任务数据持久化存储在 `tmp/async-tasks/` 目录，进程重启不丢失
> - 程序启动时自动恢复未完成的 processing 任务并重新执行轮询
> - 已完成任务 **24 小时**后自动过期清理

### Seedance 2.0 / 2.0-fast / VIP 接口

**POST /v1/videos/generations**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 是 | - | jimeng-video-seedance-2.0（推荐）、jimeng-video-seedance-2.0-fast（快速版）、jimeng-video-seedance-2.0-fast-vip（VIP 极速推理）、jimeng-video-seedance-2.0-vip（VIP 主模态）或 seedance-2.0 |
| prompt | string | 否 | - | 提示词，使用 @1、@2 引用素材（图片/视频/音频） |
| ratio | string | 否 | 4:3 | 宽高比 |
| duration | number | 否 | 4 | 视频时长 4-15 秒 |
| files | file[] | 是* | - | 上传的素材文件（图片/视频/音频，multipart） |
| file_paths | array | 是* | - | 素材URL数组（JSON） |

**支持的素材类型：**
- 图片：jpg, png, webp, gif, bmp
- 视频：mp4, mov, m4v
- 音频：mp3, wav

**提示词占位符：**
- `@1` / `@图1` / `@image1` - 引用第一个素材
- `@2` / `@图2` / `@image2` - 引用第二个素材

### 国际版视频接口

国际版使用 CapCut/Dreamina 国际平台（`mweb-api-sg.capcut.com`），Token 使用区域前缀格式（如 `sg-xxx`、`it-xxx`），支持普通视频与 Seedance。

#### 同步生成

**POST /v1/videos/international/generations**

- 普通视频模型：`jimeng-video-3.0`、`jimeng-video-3.0-pro`、`jimeng-video-3.5-pro`
  - 支持 JSON / multipart
  - `duration` 仅支持 `5` 或 `10`
  - 无素材时走文生视频；传 `file_paths` 时可走首帧/尾帧图生视频
- Seedance 模型：`seedance-2.0-fast`、`seedance-2.0-pro`、`seedance-2.0-fast-vip`、`seedance-2.0-vip` 及对应 `jimeng-video-seedance-*` 名称
  - `duration` 支持 `4-15`
  - 至少需要一个素材（keyed multipart 文件、keyed URL 字段或 `file_paths/filePaths`）

**调用示例：**

```bash
# 国际版普通视频同步生成（JSON）
curl -X POST http://localhost:8000/v1/videos/international/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sg-your_sessionid" \
  -d '{
    "model": "jimeng-video-3.0",
    "prompt": "A cute cat walking slowly on grass, cinematic, natural motion",
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5
  }'

# 国际版 Seedance 同步生成（multipart 文件上传）
curl -X POST http://localhost:8000/v1/videos/international/generations \
  -H "Authorization: Bearer sg-your_sessionid" \
  -F "model=seedance-2.0-fast" \
  -F "prompt=@1 中的人物开始微笑" \
  -F "ratio=4:3" \
  -F "duration=4" \
  -F "image_file=@/path/to/image.jpg"

# 国际版 Seedance 同步生成（JSON + 图片URL）
curl -X POST http://localhost:8000/v1/videos/international/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sg-your_sessionid" \
  -d '{
    "model": "seedance-2.0-fast",
    "prompt": "@1 中的人物开始微笑",
    "ratio": "4:3",
    "duration": 4,
    "file_paths": ["https://example.com/image.jpg"]
  }'

# 国际版 VIP 模型生成
curl -X POST http://localhost:8000/v1/videos/international/generations \
  -H "Authorization: Bearer sg-your_sessionid" \
  -F "model=seedance-2.0-fast-vip" \
  -F "prompt=@1 中的人物开始微笑" \
  -F "ratio=4:3" \
  -F "duration=4" \
  -F "image_file=@/path/to/image.jpg"
```

#### 异步生成（v0.8.9 新增）

**POST /v1/videos/international/generations/async**

请求参数与同步接口完全一致，但立即返回 `task_id`。

**GET /v1/videos/international/generations/async/:taskId**

查询异步任务结果，服务端阻塞等待视频生成完成后返回。

```bash
# 提交国际版异步任务
curl -X POST http://localhost:8000/v1/videos/international/generations/async \
  -H "Authorization: Bearer sg-your_sessionid" \
  -F "model=seedance-2.0-fast" \
  -F "prompt=@1 中的人物开始微笑" \
  -F "ratio=4:3" \
  -F "duration=4" \
  -F "image_file=@/path/to/image.jpg"

# 查询结果
curl http://localhost:8000/v1/videos/international/generations/async/{task_id}
```

国际普通视频已实测通过：`jimeng-video-3.0`、`jimeng-video-3.0-pro`、`jimeng-video-3.5-pro`。

#### 支持的区域前缀

| 前缀 | 区域 | 前缀 | 区域 | 前缀 | 区域 | 前缀 | 区域 |
|------|------|------|------|------|------|------|------|
| `sg-` | 新加坡 | `hk-` | 香港 | `jp-` | 日本 | `it-` | 意大利 |
| `al-` | 阿尔巴尼亚 | `az-` | 阿塞拜疆 | `bh-` | 巴林 | `ca-` | 加拿大 |
| `cl-` | 智利 | `de-` | 德国 | `gb-` | 英国 | `gy-` | 圭亚那 |
| `il-` | 以色列 | `iq-` | 伊拉克 | `jo-` | 约旦 | `kg-` | 吉尔吉斯 |
| `om-` | 阿曼 | `pk-` | 巴基斯坦 | `pt-` | 葡萄牙 | `sa-` | 沙特 |
| `se-` | 瑞典 | `tr-` | 土耳其 | `tz-` | 坦桑尼亚 | `uz-` | 乌兹别克 |
| `ve-` | 委内瑞拉 | `xk-` | 科索沃 | | | | |

> **注意：** US Token（`us-` 前缀）暂不支持当前国际版视频接口。

## 效果展示

![image-20260209234137309](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260209234137309.png)

![image-20260209230221386](https://mypicture-1258720957.cos.ap-nanjing.myqcloud.com/Obsidian/image-20260209230221386.png)

![多图合成](https://mypicture-1258720957.cos.ap-nanjin

[33m... (文档截断)[0m

------------------------------------------------------------


[35m核心代码预览 (Top 100 Lines)[0m

[35m文件: scripts/logout-sessions.py[0m
```py
#!/usr/bin/env python3
"""
即梦 AI (jimeng.jianying.com) 历史 Session 强制退出工具
==========================================================

功能：
  通过 Playwright headless 浏览器模拟登录，点击"设置 → 退出"按钮，
  批量使指定的历史 sessionid 在服务器端失效。

适用场景：
  当 sessionid 泄露或安全审计时，强制注销不再使用的历史 cookie，
  防止被未授权方继续调用 API。

使用方法：
  python3 scripts/logout-sessions.py <sessionid1> [sessionid2] ...

  或在脚本末尾的 SESSION_IDS 列表中填写需要退出的 sessionid，
  然后直接运行：
  python3 scripts/logout-sessions.py

依赖安装：
  pip install playwright
  playwright install chromium

注意：
  - 每个 sessionid 独立启动浏览器实例执行退出，互不影响
  - 已失效的 sessionid 会自动跳过
  - 退出操作不可逆，请确认 sessionid 列表无误后再执行
"""

import sys
import time
import argparse

# -------------------------------------------------------
# 在此填写需要强制退出的历史 sessionid 列表
# 也可通过命令行参数传入（见使用方法）
# -------------------------------------------------------
SESSION_IDS = [
    # 示例（已失效，仅作格式参考）：
    # "aabbddddddddddddddd",
]


def logout_session(session_id: str) -> str:
    """
    对单个 sessionid 执行退出操作。

    返回值：
      "success"        - 退出成功
      "already_invalid"- sessionid 已失效，无需处理
      "error_no_button"- 找不到退出按钮
      "unknown"        - 退出状态不确定
      "error"          - 发生异常
    """
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
            ],
        )

        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/135.0.0.0 Safari/537.36"
            ),
        )

        domain = ".jianying.com"
        context.add_cookies(
            [
                {"name": "_tea_web_id", "value": "7619975442964235802", "domain": domain, "path": "/"},
                {"name": "is_staff_user",   "value": "false",      "domain": domain, "path": "/"},
                {"name": "store-region",    "value": "cn-gd",      "domain": domain, "path": "/"},
                {"name": "uid_tt",          "value": session_id,   "domain": domain, "path": "/"},
                {"name": "uid_tt_ss",       "value": session_id,   "domain": domain, "path": "/"},
                {"name": "sid_tt",          "value": session_id,   "domain": domain, "path": "/"},
                {"name": "sessionid",       "value": session_id,   "domain": domain, "path": "/"},
                {"name": "sessionid_ss",    "value": session_id,   "domain": domain, "path": "/"},
            ]
        )

        page = context.new_page()

        try:
            # 导航到即梦主页，等待页面完全加载
            page.goto(
                "https://jimeng.jianying.com",
                timeout=30000,
                wait_until="networkidle",
            )
            time.sleep(3)
```


[35m文件: src/daemon.ts[0m
```ts
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


[35m文件: src/lib/browser-service.ts[0m
```ts
import { chromium, Browser, BrowserContext, Page, Route } from "playwright-core";
import logger from "@/lib/logger.ts";
import { getCookiesForBrowser, getCookiesForBrowserInternational } from "@/api/controllers/core.ts";

// bdms SDK 相关脚本的白名单域名
const SCRIPT_WHITELIST_DOMAINS = [
  "vlabstatic.com",
  "bytescm.com",
  "jianying.com",
  "byteimg.com",
  "capcutstatic.com",
  "capcut.com",
  "bytegecko.com",
  "bytedance.com",
  "bytegoofy.com",
  "ttwstatic.com",
];

// 需要屏蔽的资源类型（加速加载、减少内存）
const BLOCKED_RESOURCE_TYPES = ["image", "font", "stylesheet", "media"];

// 会话空闲超时时间（毫秒）
const SESSION_IDLE_TIMEOUT = 10 * 60 * 1000;

// bdms SDK 就绪等待超时（毫秒）
const BDMS_READY_TIMEOUT = 30000;

// 国际版 API 域名映射（前端域名 → 实际 API 域名）
const INTERNATIONAL_API_HOST_MAP: Record<string, string> = {
  "dreamina.capcut.com": "mweb-api-sg.capcut.com",
  "dreamina.us.capcut.com": "dreamina-api.us.capcut.com",
};

interface BrowserSession {
  context: BrowserContext;
  page: Page;
  lastUsed: number;
  idleTimer: NodeJS.Timeout | null;
  region?: "cn" | "international"; // 区域标识
}

class BrowserService {
  private browser: Browser | null = null;
  private sessions: Map<string, BrowserSession> = new Map();
  private launching: Promise<Browser> | null = null;

  /**
   * 懒启动浏览器实例
   */
  private async ensureBrowser(): Promise<Browser> {
    if (this.browser?.isConnected()) {
      return this.browser;
    }

    // 防止并发启动
    if (this.launching) {
      return this.launching;
    }

    this.launching = (async () => {
      logger.info("BrowserService: 正在启动 Chromium 浏览器...");
      try {
        this.browser = await chromium.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
          ],
        });

        this.browser.on("disconnected", () => {
          logger.warn("BrowserService: 浏览器已断开连接");
          this.browser = null;
          this.sessions.clear();
        });

        logger.info("BrowserService: Chromium 浏览器启动成功");
        return this.browser;
      } finally {
        this.launching = null;
      }
    })();

    return this.launching;
  }

  /**
   * 获取或创建指定 token 的浏览器会话
   * @param token raw sessionid (不含前缀)
   * @param region "cn" 或 "international"
   */
  async getSession(token: string, region: "cn" | "international" = "cn"): Promise<BrowserSession> {
    const sessionKey = `${region}:${token}`;
    const existing = this.sessions.get(sessionKey);
    if (existing) {
```


[35m文件: src/lib/config.ts[0m
```ts
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


[35m文件: src/lib/environment.ts[0m
```ts
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


[35m文件: src/lib/http-status-codes.ts[0m
```ts
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


[35m文件: src/lib/initialize.ts[0m
```ts
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


[35m文件: src/lib/logger.ts[0m
```ts
下载失败: HTTP Error 429: Too Many Requests
```


[35m文件: src/lib/server.ts[0m
```ts
import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaRange from 'koa-range';
import koaCors from "koa2-cors";
import koaBody from 'koa-body';
import _ from 'lodash';

import Exception from './exceptions/Exception.ts';
import Request from './request/Request.ts';
import Response from './response/Response.js';
import FailureBody from './response/FailureBody.ts';
import EX from './consts/exceptions.ts';
import logger from './logger.ts';
import config from './config.ts';

class Server {

    app;
    router;
    koaBodyMiddleware;

    constructor() {
        this.app = new Koa();
        this.app.use(koaCors());
        // 范围请求支持
        this.app.use(koaRange);
        this.router = new KoaRouter({ prefix: config.service.urlPrefix });

        // 预先创建 koa-body 中间件，支持 multipart 文件上传
        this.koaBodyMiddleware = koaBody({
            multipart: true,
            formidable: {
                maxFileSize: 100 * 1024 * 1024, // 100MB
                keepExtensions: true,
            },
            formLimit: '100mb',
            jsonLimit: '100mb',
            textLimit: '100mb',
            parsedMethods: ['POST', 'PUT', 'PATCH'],
        });

        // 前置处理异常拦截
        this.app.use(async (ctx: any, next: Function) => {
            if(ctx.request.type === "application/xml" || ctx.request.type === "application/ssml+xml")
                ctx.req.headers["content-type"] = "text/xml";
            try { await next() }
            catch (err) {
                logger.error(err);
                const failureBody = new FailureBody(err);
                new Response(failureBody).injectTo(ctx);
            }
        });
        // 自定义 JSON 解析中间件
        this.app.use(async (ctx: any, next: Function) => {
            // 跳过 multipart 请求，让 koa-body 处理
            if (ctx.is('multipart')) {
                await next();
                return;
            }
            if (ctx.is('application/json') && ['POST', 'PUT', 'PATCH'].includes(ctx.method)) {
                logger.debug('开始自定义 JSON 解析');
                const chunks: Buffer[] = [];

                await new Promise((resolve, reject) => {
                    ctx.req.on('data', (chunk: Buffer) => {
                        chunks.push(chunk);
                    });

                    ctx.req.on('end', () => {
                        resolve(null);
                    });

                    ctx.req.on('error', reject);
                });

                const body = Buffer.concat(chunks).toString('utf8');

                // 清理问题字符
                let cleanedBody = body
                    .replace(/\r\n/g, '\n')
                    .replace(/\r/g, '\n')
                    .replace(/\u00A0/g, ' ')
                    .replace(/[\u2000-\u200B]/g, ' ')
                    .replace(/\uFEFF/g, '')
                    .trim();

                const parsedBody = JSON.parse(cleanedBody);

                logger.debug('JSON 解析成功，跳过 koa-body');

                ctx.request.body = parsedBody;
                ctx.request.rawBody = cleanedBody;

                // 标记已处理，避免 koa-body 再次处理
                ctx._jsonProcessed = true;
            }
            await next();
        });

        // 载荷解析器支持（只处理未被自定义解析器处理的请求）
```


[35m文件: src/lib/util.ts[0m
```ts
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
```


[35m入口文件预览 (Top 100 Lines)[0m

[35m文件: src/index.ts[0m
```ts
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


[35m依赖项详情[0m

[35mpackage.json[0m
```
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

```

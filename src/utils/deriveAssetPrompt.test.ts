import * as assert from "node:assert/strict";
import { buildDeriveAssetPromptMessages } from "./deriveAssetPrompt";

const messages = buildDeriveAssetPromptMessages({
  typePrompt: "人物衍生资产生成 · 约束手册",
  assetType: "role",
  parentDescribe: "男性，外门弟子，体格强硬凶狠，青衣劲装，常攥拳堵门或上前威胁，动作粗暴蛮横。",
  describe: "与默认态的差异 · 青色外门劲装束袖收腰，轮廓硬朗，突出凶狠强硬气质",
  hasParentImage: true,
});

assert.equal(messages.system.includes("人物衍生资产生成 · 约束手册"), true);
assert.equal(messages.system.includes("衍生资产必须以父级资产为固定基础"), true);
assert.equal(messages.system.includes("角色身份锁定优先级高于服化妆造"), true);
assert.equal(messages.system.includes("只允许改变当前资产描述明确要求的衍生项"), true);
assert.equal(messages.system.includes("禁止美白"), true);
assert.equal(messages.system.includes("禁止改变发型"), true);
assert.equal(messages.user.includes("父级资产描述：男性，外门弟子"), true);
assert.equal(messages.user.includes("当前资产描述：与默认态的差异"), true);

const noParentImageMessages = buildDeriveAssetPromptMessages({
  typePrompt: "人物衍生资产生成 · 约束手册",
  assetType: "role",
  parentDescribe: "男性，外门弟子。",
  describe: "青色外门劲装",
  hasParentImage: false,
});

assert.equal(noParentImageMessages.system.includes("角色身份锁定优先级高于服化妆造"), false);
assert.equal(noParentImageMessages.system.includes("衍生资产必须以父级资产为固定基础"), false);

const toolMessages = buildDeriveAssetPromptMessages({
  typePrompt: "道具衍生资产生成 · 约束手册",
  assetType: "tool",
  parentDescribe: "一件本该干净的白色衣袍，衣摆沾满干涸暗血。",
  describe: "增加火光下的暗血质感",
  hasParentImage: true,
});

assert.equal(toolMessages.system.includes("衍生资产必须以父级资产为固定基础"), true);
assert.equal(toolMessages.system.includes("锁定父级道具/物体的主体结构"), true);
assert.equal(toolMessages.system.includes("禁止把父级道具改成另一个道具"), true);

const animalMessages = buildDeriveAssetPromptMessages({
  typePrompt: "动物衍生资产生成 · 约束手册",
  assetType: "animal",
  parentDescribe: "一只黑白花纹小狗，左耳有缺口，短腿，圆眼。",
  describe: "戴一条红色小围巾",
  hasParentImage: true,
});

assert.equal(animalMessages.system.includes("衍生资产必须以父级资产为固定基础"), true);
assert.equal(animalMessages.system.includes("锁定父级动物的物种"), true);
assert.equal(animalMessages.system.includes("禁止把父级动物改成另一个物种/品种"), true);

const sceneMessages = buildDeriveAssetPromptMessages({
  typePrompt: "场景衍生资产生成 · 约束手册",
  assetType: "scene",
  parentDescribe: "破败狭窄的杂役木屋，漏风窗纸、昏黄油灯、木床和缺腿木桌。",
  describe: "夜间火把光从门缝压入",
  hasParentImage: true,
});

assert.equal(sceneMessages.system.includes("衍生资产必须以父级资产为固定基础"), true);
assert.equal(sceneMessages.system.includes("锁定父级场景的空间布局"), true);
assert.equal(sceneMessages.system.includes("禁止把父级场景改成另一个场景"), true);

console.log("deriveAssetPrompt tests passed");

export type DeriveAssetType = "role" | "animal" | "tool" | "scene" | "clip";

interface BuildDeriveAssetPromptMessagesOptions {
  typePrompt: string;
  assetType: DeriveAssetType;
  parentDescribe?: string | null;
  describe?: string | null;
  hasParentImage: boolean;
}

interface DeriveAssetPromptMessages {
  system: string;
  user: string;
}

const baseDerivativeLockPrompt = `

## 通用衍生资产锁定规则

当已提供父级资产参考图时，以下规则优先级高于任何风格手册和当前资产描述：
- 衍生资产必须以父级资产为固定基础；它不是重新创作新资产，只能在同一个父资产上做局部衍生变化。
- 必须把父级参考图视为主体、结构、身份和风格的唯一来源；父级资产描述中的显性锚点必须逐项保留。
- 只允许改变当前资产描述明确要求的衍生项；当前资产描述没有要求的主体结构、形状比例、材质、颜色、纹理、空间关系、年龄感、体型和气质均保持不变。
- 若当前资产描述与父级资产冲突，优先保留父级资产，只提取当前资产描述中不破坏父级一致性的局部变化。
- 最终提示词必须明确写出“基于父级参考图做局部衍生，不重新设计为新资产”，并写出需要保留的父级锚点。
- 最终提示词末尾加入通用负向约束：新资产，另一个主体，主体结构改变，比例改变，材质改变，颜色漂移，风格漂移，过度美化，额外装饰，现代元素，文字。
`;

const roleIdentityLockPrompt = `

## 角色衍生身份锁定规则

当当前资产类型为 role 且已提供父级角色参考图时，还必须遵守：
- 角色身份锁定优先级高于服化妆造；这不是重新设计角色，只是在同一个角色基础上做衍生变化。
- 必须把父级参考图视为唯一身份来源，严格保持父级角色的五官、脸型、骨相、肤色、年龄感、体格、发型、发际线、眉眼距离、鼻梁、下颌轮廓、表情气质。
- 只允许改变当前资产描述明确要求的衍生项；若当前资产描述是服装/衣着/制服/盔甲/穿衣类变化，只能换服装和必要腰饰，不得改妆容、发型、肤色、脸型、年龄感、体格和整体气质。
- 当前资产描述没有明确要求时，禁止添加玉冠、金冠、发簪、耳饰、项饰、兵器、手持物、现代道具或额外身份装饰。
- 禁止美白、禁止年轻化、禁止偶像化、禁止精致美男化、禁止改变发型、禁止改变五官、禁止改变脸型、禁止改变肤色、禁止把粗粝/凶狠/虚弱/苍老等原有特质美化掉。
- 最终提示词必须明确写出“只做服装替换/只叠加当前衍生项，不重新设计角色”，并保留父级资产描述中的显性身份锚点。
- 最终提示词末尾加入负向约束：不同人物，新脸，白皙皮肤，年轻化，精致美男，改变发型，改变五官，改变脸型，改变肤色，柔和气质，偶像化。
`;

const animalIdentityLockPrompt = `

## 动物衍生身份锁定规则

当当前资产类型为 animal 且已提供父级动物参考图时，还必须遵守：
- 锁定父级动物的物种、品种、体型、年龄感、毛色/羽色/鳞片颜色、花纹分布、脸部结构、耳朵形状、眼睛颜色、尾巴形态和独特标记。
- 只允许改变当前资产描述明确要求的局部状态，例如服饰、饰品、轻微脏污、湿毛、伤痕、光照或情绪表情。
- 禁止把父级动物改成另一个物种/品种，禁止改毛色花纹、体型比例、脸部结构和关键识别标记。
- 最终提示词末尾加入负向约束：另一个动物，物种变化，品种变化，毛色改变，花纹改变，体型改变，脸部结构改变，过度拟人化。
`;

const toolIdentityLockPrompt = `

## 道具/物体衍生主体锁定规则

当当前资产类型为 tool 且已提供父级道具/物体参考图时，还必须遵守：
- 锁定父级道具/物体的主体结构、轮廓比例、尺寸感、材质、基础颜色、纹理、磨损痕迹和关键识别部件。
- 只允许改变当前资产描述明确要求的局部状态，例如污渍、破损、血迹、光照、摆放角度、局部装饰或使用痕迹。
- 禁止把父级道具改成另一个道具，禁止改换品类、版型、主材质、主颜色和核心结构。
- 最终提示词末尾加入负向约束：另一个道具，品类变化，结构重做，轮廓改变，材质替换，主颜色改变，新增无关装饰。
`;

const sceneIdentityLockPrompt = `

## 场景衍生空间锁定规则

当当前资产类型为 scene 且已提供父级场景参考图时，还必须遵守：
- 锁定父级场景的空间布局、建筑结构、门窗位置、主要家具/物件位置、时代风格、基础色调和透视关系。
- 只允许改变当前资产描述明确要求的局部状态，例如时间、天气、光线、气氛、局部陈设、破损程度或人物不在场的环境痕迹。
- 禁止把父级场景改成另一个场景，禁止改变地点类型、建筑结构、空间尺度、主要物件位置和时代背景。
- 最终提示词末尾加入负向约束：另一个场景，地点变化，空间布局改变，建筑结构改变，主要物件位置改变，时代风格漂移。
`;

const clipIdentityLockPrompt = `

## 片段/镜头衍生锁定规则

当当前资产类型为 clip 且已提供父级参考图时，还必须遵守：
- 锁定父级画面的主体、构图、镜头角度、空间关系、关键角色/物体外观和整体美术风格。
- 只允许改变当前资产描述明确要求的局部镜头状态，例如光线、氛围、局部动作前后帧暗示或画面细节强化。
- 禁止把父级片段改成另一个镜头，禁止改变主体身份、构图中心和关键空间关系。
`;

const lockPromptByType: Record<DeriveAssetType, string> = {
  role: roleIdentityLockPrompt,
  animal: animalIdentityLockPrompt,
  tool: toolIdentityLockPrompt,
  scene: sceneIdentityLockPrompt,
  clip: clipIdentityLockPrompt,
};

export function buildDeriveAssetPromptMessages(options: BuildDeriveAssetPromptMessagesOptions): DeriveAssetPromptMessages {
  const derivativeLockPrompt = options.hasParentImage ? `${baseDerivativeLockPrompt}${lockPromptByType[options.assetType] || ""}` : "";
  const system = `${options.typePrompt}${derivativeLockPrompt}`;

  return {
    system,
    user: `
            父级资产描述：${options.parentDescribe || "无详细描述"}
            当前资产描述：${options.describe || "无详细描述"}`,
  };
}

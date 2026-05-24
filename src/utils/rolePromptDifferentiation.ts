const repeatedRoleTokens = ["国字脸", "剑眉星目", "墨黑长发", "半束长发", "素色古装长衫", "白皙基调", "儒雅英气", "宽阔肩部"];

export interface RoleDifferenceProject {
  intro?: string | null;
}

export interface RoleDifferenceAsset {
  id?: number;
  name?: string;
  describe?: string | null;
  prompt?: string | null;
}

export interface RoleComparisonAsset extends RoleDifferenceAsset {
  id: number;
  name: string;
}

export function getRepeatedTokenHints(text?: string | null): string {
  const hits = repeatedRoleTokens.filter((token) => text?.includes(token));
  return hits.join("、");
}

export function getRoleAnchorHints(describe?: string | null): string {
  const anchors = (describe || "")
    .split(/[，、；。,.]/)
    .map((item) => item.trim())
    .filter((item) => item && !["男性", "女性", "男", "女"].includes(item))
    .slice(0, 10);

  return anchors.length ? anchors.join("、") : "无";
}

export function buildRoleDifferenceContext(project: RoleDifferenceProject, current: RoleDifferenceAsset, roles: RoleComparisonAsset[]): string {
  const otherRoles = roles
    .filter((role) => role.id !== current.id)
    .slice(0, 30)
    .map((role) => {
      const repeatedHints = getRepeatedTokenHints(role.prompt);
      return `- ${role.name}: ${role.describe || "无描述"}；视觉锚点:${getRoleAnchorHints(role.describe)}${repeatedHints ? `；旧提示词高频模板词:${repeatedHints}` : ""}`;
    })
    .join("\n");

  return `

**小说/项目上下文：**
- 项目简介:${project.intro || "无"}

**当前角色已有线索：**
- 名称:${current.name || "无"}
- 描述:${current.describe || "无"}
- 当前角色必须保留的描述锚点:${getRoleAnchorHints(current.describe)}
- 当前旧提示词高频模板词:${getRepeatedTokenHints(current.prompt) || "无"}

**同项目其他角色（用于避免撞脸/撞造型）：**
${otherRoles || "- 暂无其他角色"}

**差异化要求：**
- 当前角色必须逐项保留“描述”里的显性锚点，并把它们写进最终提示词：脸型/骨相、体型、服装身份、神态动作、气质功能不能丢。
- 旧提示词里的高频模板词只作为反例参考；若“描述”没有明确支持，不得继续照抄这些词。
- 同项目其他角色已占用的脸型、眉眼、发型、身高体型、服装颜色不能机械复用；必须给当前角色生成一套一眼可区分的视觉身份。
- 如果视觉手册的默认底模与当前“描述”冲突，当前角色描述优先；手册只保留四视图、材质、光线、背景等技术规范。
- 最终提示词必须至少包含 4 个当前角色独有锚点，且这些锚点不能全部是“国风3D/PBR/四视图/素灰背景”等通用制作词。`;
}

import * as z from "zod";
import { EventEmitter } from "events";
import u from "@/utils";
import { v4 as uuidv4 } from "uuid";
import { ModelMessage } from "ai";
function simpleShortUuid(length = 8) {
  return uuidv4().replace(/-/g, "").slice(0, length);
}
export interface Character {
  name: string;
  relationship: string;
  personality: string;
  description: string;
  type: string;
  sex: "男" | "女" | "其他";
  id: string;
}
export interface EventType {
  chapter: string;
  name: string;
  detail: string;
  state: "已完成" | "进行中" | "未开始";
  id?: string;
  users: {
    name: string;
    id?: string;
    feature: string;
  }[];
  novelBack: string;
  emotionalIndex?: number;
}

export interface Novel {
  novelBack: string;
  character: Character[];
  event: EventType[];
  index: number;
}

const jsonSchema = z.object({
  character: z.array(
    z
      .object({
        name: z.string().describe("人物姓名"),
        id: z.string().describe("人物id，仅在前置信息中已存在该角色时引用，否则必须为null，严禁新建或补填"),
        relationship: z.string().describe("与主角的关系"),
        personality: z.string().describe("人物性格"),
        description: z.string().describe("人物宏观描述,例如:女主角，聪明独立的职场女性；"),
        type: z.string().describe("人物类型（如主角/配角/龙套等）"),
        sex: z.enum(["男", "女", "其他"]).describe("人物性别"),
      })
      .describe("每个人物的详细内容"),
  ),
  event: z.array(
    z
      .object({
        chapter: z
          .string()
          .describe(
            "事件覆盖的章节（如1-3章、4-6章），章节划分必须连续，每个章节范围只能属于一个事件。事件分割不可过细——避免只描述琐碎、日常细节的微小事件。",
          ),
        name: z.string().describe("事件名称"),
        id: z.string().describe("事件id，仅在前置信息中已存在该事件时引用，否则必须为null，不可新建或补填"),
        detail: z.string().describe("事件过程详情（包括起因、经过、结果、场景、人物等）"),
        state: z.enum(["已完成", "进行中", "未开始"]).describe("事件进行状态（仅限：已完成、进行中、未开始）"),
        novelBack: z.string().describe("事件背景"),
        users: z
          .array(
            z.object({
              name: z.string().describe("人物姓名"),
              id: z.string().describe("人物id，仅在全局人物信息存在该角色且有id时引用，否则必须为 null，不可补填"),
              feature: z.string().describe("人物外貌特征，例如：体态、容貌、眼神、着装等"),
            }),
          )
          .describe("参与该事件的所有人物及其特征，严格逐一列出"),
      })
      .describe("事件必须在100-200字说明起因经过结果，不可将单一章节或细小场景独立成事件，"),
  ),
});
function getChapterGroups<T>(chapters: T[], windowSize: number = 5, overlap: number = 1): T[][] {
  const res: T[][] = [];
  if (windowSize < 1 || overlap < 0) return res;
  let i = 0;
  const length = chapters.length;
  while (i < length) {
    if (res.length === 0) {
      // 第一组，直接取 windowSize 个
      res.push(chapters.slice(i, i + windowSize));
      i += windowSize;
    } else {
      // 取上一组最后 overlap 个，加上新的 windowSize 个
      const prevGroup = res[res.length - 1];
      const overlapItems = prevGroup.slice(-overlap);
      const newItems = chapters.slice(i, i + windowSize);
      if (newItems.length === 0) break; // 已经取完，跳出
      res.push([...overlapItems, ...newItems]);
      i += windowSize;
    }
  }
  return res;
}
const keyMap: Record<string, string> = {
  chapter: "事件章节",
  name: "事件名称",
  detail: "事件详情",
  state: "事件状态",
  id: "事件id",
  users: "事件人物特征",
  // users字段所需
  "users.name": "人物姓名",
  "users.id": "人物id",
  "users.feature": "人物外貌特征",
  novelBack: "事件背景",
};
function convertKeysToChinese(obj: any, parentKey: string = "", map = keyMap): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToChinese(item, parentKey, map));
  }
  if (obj && typeof obj === "object") {
    const res: Record<string, any> = {};
    for (const key in obj) {
      // 若是 users 子字段，则用 'users.' 前缀的映射
      const mapKey = parentKey ? `${parentKey}.${key}` : key;
      const newKey = map[mapKey] || map[key] || key;
      // 递归子对象，users 需带上前缀
      if (Array.isArray(obj[key]) && key === "users") {
        res[newKey] = convertKeysToChinese(obj[key], key, map);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        res[newKey] = convertKeysToChinese(obj[key], "", map);
      } else {
        res[newKey] = obj[key];
      }
    }
    return res;
  }
  return obj;
}

/*  文本数据清洗
 * @param textData 需要清洗的文本
 * @param windowSize 每组数量 默认5
 * @param overlap 交叠数量 默认1
 * @returns {totalCharacter:所有人物角色卡,totalEvent:所有事件}
 */
// export default async function (
//   textData: string,
//   windowSize: number = 5,
//   overlap: number = 1
// ): Promise<{ totalCharacter: Character[]; totalEvent: OutEvent[] }> {}

class CleanNovel {
  emitter: EventEmitter;
  windowSize: number;
  overlap: number;
  constructor(windowSize: number = 5, overlap: number = 1) {
    this.emitter = new EventEmitter();
    this.windowSize = windowSize;
    this.overlap = overlap;
  }
  async start(projectId: number): Promise<{ totalCharacter: Character[]; totalEvent: EventType[] }> {
    const allChapters = await u.db("t_novel").where("projectId", projectId);

    const groups = getChapterGroups(allChapters!, this.windowSize, this.overlap);

    let preData: Novel | null = null;
    //所有事件
    let totalEvent: EventType[] = [];
    //所有人物
    let totalCharacter: Character[] = [];

    try {
      for (const group of groups) {
        const cleanText = group
          .map((i: any, index: number) => {
            return {
              role: "user",
              content: `【第${i.index}章 ${i.chapter}】 ${
                i.length > this.windowSize && i.length <= this.overlap - 1 ? `（前置章节内容，仅供参考，严禁并入章节范围）` : ``
              }
            ${i.text}`,
            } as ModelMessage;
          })
          .filter(Boolean);

        const hasNotData = totalEvent.filter((i) => i.state !== "已完成");
        const converted = convertKeysToChinese(hasNotData);
        const output = JSON.stringify(converted, null, 2);
        const userMsg = `
**全局人物信息：**
${totalCharacter && totalCharacter.length ? JSON.stringify(totalCharacter, null, 2) : "无"},
**前置事件信息 未完成 事件补充（严禁遗漏，不可修改开始章节）**:
如有未完成的事件，需要在本轮中尽可能把状态补充完整，事件状态包括：已完成、进行中、未开始等等
${output ? output : "无"}`;
        const apiConfig = await u.getPromptAi("storyboardAgent");
        const resData = await u.ai.text.invoke(
          {
            messages: [
              {
                role: "system",
                content: `
你是小说文本整理专家，需针对用户提供的小说章节（含可能的前置总结）提取并梳理全部事件|情节，严格遵循以下要求：

## 事件拆分核心要点
1. **必须保留**：推动主线的关键事件、主角重大改变、格局变动等强相关事件；标注【核心冲突】（主线关键，改变命运/格局）。
2. **可选保留/合并**：支线、铺垫事件；标注【次级冲突】（推进剧情非关键）。
3. **可删/极缩**：日常、无对立张力事件；标注【过渡冲突】（仅过渡/日常）。
4. **每章节最多1个事件或者多个章节一个事件，内容100-200字，避免过细拆分**。
## 事件分析
- **冲突强度**：每事件标注核心/次级/过渡冲突。
- **无章节遗漏**，严格遵循事件拆分核心要点，按剧情逻辑拆分，事件需含起始章节、名称、事件所处的世界背景、详情（时间、场景、人物、起因经过结果等）、状态（已完成/进行中/未开始）；前置事件需同步状态，关联本轮内容的补全逻辑。

## 前置事件处理
- 无关前置事件同步为已完成；关联前置事件补全逻辑、补全对应章节范围(如果信息足够)、明确状态。

## 人物分析
- 每人单独罗列：姓名+类型（主角/配角/龙套）+外貌（五官、身形体态、服装细节等）。
- 不遗漏任何人物，包括但不限于代号、无名称、妖兽、长老等等人物
- 必须为单个人物角色、严禁出现例如：三位长老、等类似于人数的描述

## 执行优先级
1. 事件需具体，避免笼统概括(严禁出现类似于 xxx复仇之路开启、xxx逆袭之路等)；2. 前置内容无对应人物或事件时，对应 id 必须为null；3. 前置事件优先同步，仅修改结束章节；4. 无章节遗漏；5. 已完成章节不重复；6. 每章节最多1个事件或者多个章节一个事件。
`,
              },
              {
                role: "user",
                content: userMsg,
              },
              ...cleanText,
            ],
            output: {
              character: z.array(
                z
                  .object({
                    name: z.string().describe("人物姓名"),
                    id: z.string().describe("人物id，仅在前置信息中已存在该角色时引用，否则必须为null，严禁新建或补填"),
                    relationship: z.string().describe("与主角的关系"),
                    personality: z.string().describe("人物性格"),
                    description: z.string().describe("人物宏观描述,例如:女主角，聪明独立的职场女性；"),
                    type: z.string().describe("人物类型（如主角/配角/龙套等）"),
                    sex: z.enum(["男", "女", "其他"]).describe("人物性别"),
                  })
                  .describe("每个人物的详细内容"),
              ),
              event: z.array(
                z
                  .object({
                    chapter: z
                      .string()
                      .describe(
                        "事件覆盖的章节（如1-3章、4-6章），章节划分必须连续，每个章节范围只能属于一个事件。事件分割不可过细——避免只描述琐碎、日常细节的微小事件。",
                      ),
                    name: z.string().describe("事件名称"),
                    id: z.string().describe("事件id，仅在前置信息中已存在该事件时引用，否则必须为null，不可新建或补填"),
                    detail: z.string().describe("事件过程详情（包括起因、经过、结果、场景、人物等）"),
                    state: z.enum(["已完成", "进行中", "未开始"]).describe("事件进行状态（仅限：已完成、进行中、未开始）"),
                    novelBack: z.string().describe("事件背景"),
                    users: z
                      .array(
                        z.object({
                          name: z.string().describe("人物姓名"),
                          id: z.string().describe("人物id，仅在全局人物信息存在该角色且有id时引用，否则必须为 null，不可补填"),
                          feature: z.string().describe("人物外貌特征，例如：体态、容貌、眼神、着装等"),
                        }),
                      )
                      .describe("参与该事件的所有人物及其特征，严格逐一列出"),
                  })
                  .describe("事件必须在100-200字说明起因经过结果，不可将单一章节或细小场景独立成事件，"),
              ),
            },
          },
          apiConfig,
        );

        preData = resData as Novel;

        preData.character.forEach((i) => {
          if (!i.id || i.id == "null") {
            i.id = simpleShortUuid();
          }
        });

        preData.event.forEach((i) => {
          if (!i.id || i.id == "null") {
            i.id = simpleShortUuid();
          }
          i.users.forEach((sub) => {
            const char = preData?.character.find((oldItem) => oldItem.name == sub.name);
            if (char) {
              sub.id = char?.id;
            }
          });
        });

        preData.index = groups.indexOf(group) + 1;

        this.emitter.emit("item", preData);

        const newEvents = preData?.event || [];
        const newChapters = preData.character;

        newChapters.forEach((newItem) => {
          const index = totalCharacter.findIndex((oldItem) => oldItem?.id === newItem?.id);
          if (index !== -1) {
            totalCharacter[index] = newItem;
          } else {
            totalCharacter.push(newItem);
          }
        });

        newEvents.forEach((newItem) => {
          const index = totalEvent.findIndex((oldItem) => oldItem?.id === newItem?.id);
          newItem.detail = newItem.detail.trim();
          if (index !== -1) {
            totalEvent[index] = { ...newItem };
          } else {
            totalEvent.push({ ...newItem });
          }
        });
      }
      this.emitter.emit("data", {
        totalEvent: totalEvent,
        totalCharacter: totalCharacter,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
    return { totalEvent: totalEvent, totalCharacter: totalCharacter };
  }
}

export default CleanNovel;

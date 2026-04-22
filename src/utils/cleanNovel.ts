import { EventEmitter } from "events";
import { o_novel } from "@/types/database";
import u from "@/utils";
import { stripThink } from "@/utils/stripThink";
export interface EventType {
  id: number;
  event: string;
}

/*  文本数据清洗
 * @param textData 需要清洗的文本
 * @param windowSize 每组数量 默认5
 * @param overlap 交叠数量 默认1
 * @returns {totalCharacter:所有人物角色卡,totalEvent:所有事件}
 */

class CleanNovel {
  emitter: EventEmitter;
  /** 最大并发数 */
  concurrency: number;

  constructor(concurrency: number = 5) {
    this.emitter = new EventEmitter();
    this.concurrency = concurrency;
  }

  private async processChapter(novel: o_novel): Promise<EventType | null> {
    try {
      const prompt = await u.getPrompts("event");
      const promptData = await u.db("o_prompt").where("type", "eventExtraction").first();
      let eventExtraction = "" as string | undefined;
      if (promptData && promptData.useData) {
        eventExtraction = promptData.useData;
      } else {
        eventExtraction = promptData?.data ?? undefined;
      }
      const resData = await u.Ai.Text("universalAi").invoke({
        system: eventExtraction ? JSON.stringify(eventExtraction) : (prompt as string),
        messages: [
          {
            role: "user",
            content:
              "请根据以下小说章节数：" +
              novel.order +
              "小说章节券：" +
              novel.reel +
              "小说章节名称：" +
              novel.chapter +
              "、小说章节内容生成事件摘要：\n" +
              novel.chapterData!,
          },
        ],
      });
      const preData = stripThink(resData.text);
      this.emitter.emit("item", { id: novel.id, event: preData });
      return { id: novel.id!, event: preData };
    } catch (e) {
      this.emitter.emit("item", { id: novel.id, event: null, errorReason: u.error(e).message });
      return null;
    }
  }

  async start(allChapters: o_novel[], projectId: number): Promise<EventType[]> {
    const totalEvent: EventType[] = [];

    // 并发控制：通过信号量限制同时执行的任务数
    let running = 0;
    let index = 0;
    const results: Promise<void>[] = [];

    const runNext = (): Promise<void> => {
      if (index >= allChapters.length) return Promise.resolve();
      const novel = allChapters[index++];
      running++;

      return this.processChapter(novel).then((result) => {
        if (result) totalEvent.push(result);
        running--;
        return runNext();
      });
    };

    // 启动最多 concurrency 个并发任务
    const workers = Array.from({ length: Math.min(this.concurrency, allChapters.length) }, () => runNext());

    await Promise.all(workers);

    // 保存事件数据到 o_event 和 o_eventChapter 表
    for (const event of totalEvent) {
      if (event.event) {
        // 获取章节信息用于设置 order
        const chapter = allChapters.find((c) => c.id === event.id);

        // 插入 o_event - PostgreSQL 需要使用 returning 获取插入后的 ID
        const insertResult = await u.db("o_event")
          .insert({
            novelId: event.id,
            name: event.event.slice(0, 100) || "事件",
            content: event.event,
            order: chapter?.order || 0,
          })
          .returning("id");
        const eventId = insertResult[0]?.id;

        // 插入 o_eventChapter
        if (eventId) {
          await u.db("o_eventChapter").insert({
            eventId: eventId,
            novelId: event.id,
            name: event.event.slice(0, 100) || "事件章节",
            content: event.event,
            order: chapter?.order || 0,
          });
        }
      }
    }

    return totalEvent;
  }
}

export default CleanNovel;

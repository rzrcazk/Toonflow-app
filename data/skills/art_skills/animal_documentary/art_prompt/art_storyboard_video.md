# 视频提示词 · 视觉风格约束

生成视频提示词时，必须注入以下视觉风格标签：

| 模式 | 风格标签 |
|------|----------|
| **通用多参模式（英文）** | `photorealistic wildlife documentary, natural lighting, 4K ultra detail, cinematic wide angle, shallow depth of field, BBC nature film style` |
| **通用首尾帧模式（英文）** | `photorealistic wildlife documentary, natural lighting, 4K ultra detail, cinematic wide angle, shallow depth of field, BBC nature film style, smooth camera motion` |
| **Seedance 2.0（中文）** | `写实野生动物纪录片风格，自然光照，4K超清细节，纪录片广角镜头，浅景深，BBC自然纪录片美学` |

---

## 5秒生成单元适配规则

所有视频片段默认生成时长为**5秒**，每个镜头只生成一段，提示词必须适配此约束：

| 规则 | 说明 |
|------|------|
| **单一动作原则** | 5秒内只描述一个主体动作，不堆叠多个行为 |
| **动作必须可见** | 动作幅度要足够明显，5秒内观众能看清发生了什么 |
| **开始即动作** | 不要描述"静止后开始动"，直接描述动作进行中的状态 |

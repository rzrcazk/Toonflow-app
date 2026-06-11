# 视频提示词 · 视觉风格约束

生成视频提示词时，必须注入以下视觉风格标签：

| 模式 | 风格标签 |
|------|----------|
| **通用多参模式（英文）** | `Chinese traditional 3D light-comedy fantasy short drama, bright warm color, clear readable image, lively old house but not eerie, PBR materials, clean oriental aesthetic, playful reaction timing` |
| **通用首尾帧模式（英文）** | `Chinese traditional 3D light-comedy fantasy short drama, bright warm color, clear readable image, lively old house but not eerie, PBR materials, clean oriental aesthetic, no horror mood` |
| **Seedance 2.0（中文）** | `明亮暖色国风3D轻喜剧玄幻短剧，画面清晰干净，旧屋但不阴森，人物反应略夸张，狼狈但不惨，中国传统美学，PBR材质` |

## 视频过审友好约束

- 涉及危险或强刺激剧情时，将视觉表达降级为“虚弱、惊醒、不适、梦魇、灵力紊乱、衣襟凌乱、尘痕、暗色旧污痕”。
- 不写具体受伤部位，不写血液颜色、流动、伤口牵动，不强调剧烈生理反应。
- 每条 4-5 秒视频只保留一个主动作：醒来、回头、起身、看向某物、伸手、停顿反应等。
- 镜头保持明亮暖色、旧屋不阴森、轻喜剧反差，角色表情可以错愕、狼狈、尴尬、嘴硬，但不要惨烈。
- 提示词建议控制在 180-300 字，以正向安全约束收尾：`画面健康明亮，无血腥、无惊悚、无危险行为、无新增角色、无文字水印。`


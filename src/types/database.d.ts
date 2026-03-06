// @db-hash 3603ec259d5359d7117b8cdb61bf78a9
//该文件由脚本自动生成，请勿手动修改

export interface o_agentDeploy {
  'id'?: number;
  'name'?: string | null;
  'startTime'?: number | null;
}
export interface o_artStyle {
  'id'?: number;
  'name'?: string | null;
  'styles'?: string | null;
}
export interface o_assets {
  'describe'?: string | null;
  'filePath'?: string | null;
  'id'?: number;
  'name'?: string | null;
  'projectId'?: number | null;
  'prompt'?: string | null;
  'remark'?: string | null;
  'sonId'?: number | null;
  'startTime'?: number | null;
  'state'?: string | null;
  'type'?: string | null;
}
export interface o_event {
  'createTime'?: number | null;
  'detail'?: string | null;
  'id'?: number;
  'name'?: string | null;
}
export interface o_eventChapter {
  'eventId'?: number | null;
  'id'?: number;
  'novelId'?: number | null;
}
export interface o_model {
  'apiKey'?: string | null;
  'baseUrl'?: string | null;
  'createTime'?: number | null;
  'id'?: number;
  'index'?: number | null;
  'manufacturer'?: string | null;
  'model'?: string | null;
  'modelType'?: string | null;
  'type'?: string | null;
}
export interface o_myTasks {
  'describe'?: string | null;
  'id'?: number;
  'model'?: string | null;
  'projectId'?: number | null;
  'reason'?: string | null;
  'relatedObjects'?: string | null;
  'startTime'?: number | null;
  'state'?: string | null;
  'taskClass'?: string | null;
}
export interface o_novel {
  'chapter'?: string | null;
  'chapterData'?: string | null;
  'chapterIndex'?: number | null;
  'createTime'?: number | null;
  'id'?: number;
  'projectId'?: number | null;
  'reel'?: string | null;
}
export interface o_outline {
  'data'?: string | null;
  'episode'?: number | null;
  'id'?: number;
  'projectId'?: number | null;
}
export interface o_outlineNovel {
  'id'?: number;
  'novelId'?: number | null;
  'outlineId'?: number | null;
}
export interface o_project {
  'artStyle'?: string | null;
  'createTime'?: number | null;
  'id'?: number | null;
  'intro'?: string | null;
  'name'?: string | null;
  'projectType'?: string | null;
  'type'?: string | null;
  'userId'?: number | null;
  'videoRatio'?: string | null;
}
export interface o_prompt {
  'code'?: string | null;
  'customValue'?: string | null;
  'defaultValue'?: string | null;
  'id'?: number;
  'name'?: string | null;
  'parentCode'?: string | null;
  'type'?: string | null;
}
export interface o_prompts {
  'code'?: string | null;
  'customValue'?: string | null;
  'defaultValue'?: string | null;
  'id'?: number;
  'name'?: string | null;
  'parentCode'?: string | null;
  'type'?: string | null;
}
export interface o_script {
  'content'?: string | null;
  'createTime'?: number | null;
  'id'?: number;
  'name'?: string | null;
  'projectId'?: number | null;
}
export interface o_scriptAssets {
  'assetsId'?: number | null;
  'id'?: number;
  'scriptId'?: number | null;
}
export interface o_scriptOutline {
  'id'?: number;
  'outlineId'?: number | null;
  'scriptId'?: number | null;
}
export interface o_setting {
  'id'?: number;
  'imageModel'?: string | null;
  'languageModel'?: string | null;
  'projectId'?: number | null;
  'tokenKey'?: string | null;
  'userId'?: number | null;
}
export interface o_skills {
  'id'?: number;
  'name'?: string | null;
  'startTime'?: number | null;
}
export interface o_storyboard {
  'createTime'?: number | null;
  'id'?: number;
  'name'?: string | null;
}
export interface o_storyboardScript {
  'id'?: number;
  'scriptId'?: number | null;
  'storyboardId'?: number | null;
}
export interface o_user {
  'id'?: number;
  'name'?: string | null;
  'password'?: string | null;
  'tokenKey'?: string | null;
}
export interface o_video {
  'createTime'?: number | null;
  'id'?: number;
  'name'?: string | null;
}

export interface DB {
  "o_agentDeploy": o_agentDeploy;
  "o_artStyle": o_artStyle;
  "o_assets": o_assets;
  "o_event": o_event;
  "o_eventChapter": o_eventChapter;
  "o_model": o_model;
  "o_myTasks": o_myTasks;
  "o_novel": o_novel;
  "o_outline": o_outline;
  "o_outlineNovel": o_outlineNovel;
  "o_project": o_project;
  "o_prompt": o_prompt;
  "o_prompts": o_prompts;
  "o_script": o_script;
  "o_scriptAssets": o_scriptAssets;
  "o_scriptOutline": o_scriptOutline;
  "o_setting": o_setting;
  "o_skills": o_skills;
  "o_storyboard": o_storyboard;
  "o_storyboardScript": o_storyboardScript;
  "o_user": o_user;
  "o_video": o_video;
}

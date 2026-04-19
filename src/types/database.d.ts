// @db-hash 1803b0077100d1f9d0300dc776d9b82a
//该文件由脚本自动生成，请勿手动修改

export interface memories {
  'agentId': string;
  'content': string;
  'created_at'?: Date | null;
  'id'?: number;
  'metadata'?: any | null;
  'score'?: string | null;
}
export interface o_agentDeploy {
  'created_at'?: Date | null;
  'desc'?: string | null;
  'disabled'?: boolean | null;
  'id'?: number;
  'key': string;
  'maxOutputTokens'?: number | null;
  'model'?: string | null;
  'modelName'?: string | null;
  'name': string;
  'temperature'?: number | null;
  'type'?: number | null;
  'updated_at'?: Date | null;
  'vendorId'?: number | null;
}
export interface o_agentWorkData {
  'createTime'?: Date | null;
  'data'?: string | null;
  'episodesId'?: number | null;
  'id'?: number;
  'key'?: string | null;
  'projectId'?: number | null;
  'updateTime'?: Date | null;
}
export interface o_artStyle {
  'created_at'?: Date | null;
  'id'?: number;
  'imagePath'?: string | null;
  'name': string;
  'prompt'?: string | null;
  'updated_at'?: Date | null;
}
export interface o_assets {
  'created_at'?: Date | null;
  'describe'?: string | null;
  'id'?: number;
  'imagePath'?: string | null;
  'name': string;
  'projectId': number;
  'prompt'?: string | null;
  'promptErrorReason'?: string | null;
  'promptState'?: string | null;
  'type': string;
  'updated_at'?: Date | null;
}
export interface o_assets2Storyboard {
  'assetsId': number;
  'created_at'?: Date | null;
  'id'?: number;
  'storyboardId': number;
}
export interface o_assetsRole2Audio {
  'assetsId': number;
  'audioPath'?: string | null;
  'created_at'?: Date | null;
  'id'?: number;
}
export interface o_event {
  'content'?: string | null;
  'created_at'?: Date | null;
  'id'?: number;
  'name'?: string | null;
  'novelId': number;
  'order'?: number | null;
  'updated_at'?: Date | null;
}
export interface o_eventChapter {
  'content'?: string | null;
  'created_at'?: Date | null;
  'eventId': number;
  'id'?: number;
  'name'?: string | null;
  'order'?: number | null;
  'updated_at'?: Date | null;
}
export interface o_image {
  'created_at'?: Date | null;
  'errorReason'?: string | null;
  'height'?: number | null;
  'id'?: number;
  'imagePath'?: string | null;
  'projectId': number;
  'prompt'?: string | null;
  'state'?: string | null;
  'type'?: string | null;
  'updated_at'?: Date | null;
  'width'?: number | null;
}
export interface o_imageFlow {
  'created_at'?: Date | null;
  'data'?: string | null;
  'flowType'?: string | null;
  'id'?: number;
  'imageId': number;
}
export interface o_modelPrompt {
  'created_at'?: Date | null;
  'id'?: number;
  'modelId': string;
  'prompt'?: string | null;
  'type': string;
  'updated_at'?: Date | null;
}
export interface o_novel {
  'content'?: string | null;
  'created_at'?: Date | null;
  'errorReason'?: string | null;
  'eventState'?: number | null;
  'id'?: number;
  'level'?: number | null;
  'name'?: string | null;
  'order'?: number | null;
  'parentId'?: number | null;
  'projectId': number;
  'updated_at'?: Date | null;
}
export interface o_project {
  'artStyleId'?: number | null;
  'created_at'?: Date | null;
  'customPrompt'?: string | null;
  'describe'?: string | null;
  'id'?: number;
  'name': string;
  'novelId'?: number | null;
  'updated_at'?: Date | null;
}
export interface o_prompt {
  'created_at'?: Date | null;
  'data'?: string | null;
  'id'?: number;
  'name'?: string | null;
  'type': string;
  'updated_at'?: Date | null;
  'useData'?: string | null;
}
export interface o_script {
  'content'?: string | null;
  'created_at'?: Date | null;
  'errorReason'?: string | null;
  'extractState'?: number | null;
  'id'?: number;
  'name'?: string | null;
  'novelId': number;
  'order'?: number | null;
  'updated_at'?: Date | null;
}
export interface o_scriptAssets {
  'assetsId': number;
  'created_at'?: Date | null;
  'id'?: number;
  'scriptId': number;
}
export interface o_setting {
  'created_at'?: Date | null;
  'id'?: number;
  'key': string;
  'updated_at'?: Date | null;
  'value'?: string | null;
}
export interface o_skillAttribution {
  'created_at'?: Date | null;
  'id'?: number;
  'skillId': number;
  'type': string;
  'value'?: string | null;
}
export interface o_skillList {
  'content'?: string | null;
  'created_at'?: Date | null;
  'description'?: string | null;
  'id'?: number;
  'name': string;
  'updated_at'?: Date | null;
}
export interface o_storyboard {
  'content'?: string | null;
  'created_at'?: Date | null;
  'duration'?: number | null;
  'id'?: number;
  'imageId'?: number | null;
  'prompt'?: string | null;
  'reason'?: string | null;
  'scriptId': number;
  'state'?: string | null;
  'track'?: string | null;
  'updated_at'?: Date | null;
}
export interface o_tasks {
  'created_at'?: Date | null;
  'errorReason'?: string | null;
  'id'?: number;
  'relatedId'?: number | null;
  'state'?: string | null;
  'type': string;
  'updated_at'?: Date | null;
}
export interface o_user {
  'avatar'?: string | null;
  'created_at'?: Date | null;
  'disabled'?: boolean | null;
  'email'?: string | null;
  'id'?: number;
  'password': string;
  'role'?: number | null;
  'updated_at'?: Date | null;
  'username': string;
}
export interface o_vendorConfig {
  'created_at'?: Date | null;
  'enable'?: number | null;
  'id': string;
  'inputValues'?: string | null;
  'models'?: string | null;
  'updated_at'?: Date | null;
}
export interface o_video {
  'created_at'?: Date | null;
  'duration'?: number | null;
  'errorReason'?: string | null;
  'height'?: number | null;
  'id'?: number;
  'projectId': number;
  'prompt'?: string | null;
  'scriptId'?: number | null;
  'state'?: string | null;
  'storyboardId'?: number | null;
  'updated_at'?: Date | null;
  'videoPath'?: string | null;
  'width'?: number | null;
}
export interface o_videoTrack {
  'created_at'?: Date | null;
  'id'?: number;
  'order'?: number | null;
  'trackIndex': number;
  'videoId': number;
}

export interface DB {
  "memories": memories;
  "o_agentDeploy": o_agentDeploy;
  "o_agentWorkData": o_agentWorkData;
  "o_artStyle": o_artStyle;
  "o_assets": o_assets;
  "o_assets2Storyboard": o_assets2Storyboard;
  "o_assetsRole2Audio": o_assetsRole2Audio;
  "o_event": o_event;
  "o_eventChapter": o_eventChapter;
  "o_image": o_image;
  "o_imageFlow": o_imageFlow;
  "o_modelPrompt": o_modelPrompt;
  "o_novel": o_novel;
  "o_project": o_project;
  "o_prompt": o_prompt;
  "o_script": o_script;
  "o_scriptAssets": o_scriptAssets;
  "o_setting": o_setting;
  "o_skillAttribution": o_skillAttribution;
  "o_skillList": o_skillList;
  "o_storyboard": o_storyboard;
  "o_tasks": o_tasks;
  "o_user": o_user;
  "o_vendorConfig": o_vendorConfig;
  "o_video": o_video;
  "o_videoTrack": o_videoTrack;
}

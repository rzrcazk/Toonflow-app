import assert from "node:assert/strict";
import {
  DEFAULT_VIDEO_MODE,
  DEFAULT_VIDEO_MODEL,
  isLegacyJimengSeedanceVipModel,
  resolveDefaultVideoMode,
  resolveDefaultVideoModel,
} from "./defaultVideoModel";

assert.equal(DEFAULT_VIDEO_MODEL, "jimeng:jimeng-video-seedance-2.0-fast-vip");
assert.equal(DEFAULT_VIDEO_MODE, "endFrameOptional");

assert.equal(resolveDefaultVideoModel(undefined), "jimeng:jimeng-video-seedance-2.0-fast-vip");
assert.equal(resolveDefaultVideoModel(null), "jimeng:jimeng-video-seedance-2.0-fast-vip");
assert.equal(resolveDefaultVideoModel(""), "jimeng:jimeng-video-seedance-2.0-fast-vip");
assert.equal(resolveDefaultVideoModel("jimeng:jimeng-video-seedance-2.0-vip"), "jimeng:jimeng-video-seedance-2.0-vip");

assert.equal(resolveDefaultVideoMode(undefined), "endFrameOptional");
assert.equal(resolveDefaultVideoMode(null), "endFrameOptional");
assert.equal(resolveDefaultVideoMode(""), "endFrameOptional");
assert.equal(resolveDefaultVideoMode("text"), "text");

assert.equal(isLegacyJimengSeedanceVipModel("jimeng:jimeng-video-seedance-2.0-vip"), true);
assert.equal(isLegacyJimengSeedanceVipModel("jimeng:jimeng-video-seedance-2.0-fast-vip"), false);

console.log("default video model tests passed");

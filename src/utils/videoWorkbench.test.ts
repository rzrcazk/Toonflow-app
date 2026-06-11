import assert from "node:assert/strict";
import {
  assertReferenceTypesSupported,
  detectMediaType,
  normalizeModeForAi,
  normalizeVideoDuration,
  readVideoBase64Upload,
} from "./videoWorkbench";

assert.equal(normalizeVideoDuration("1"), 2);
assert.equal(normalizeVideoDuration(30), 15);
assert.equal(normalizeVideoDuration("8"), 8);
assert.equal(normalizeVideoDuration(3, [4, 5, 6, 7, 8, 9, 10]), 4);
assert.equal(normalizeVideoDuration(11, [4, 5, 6, 7, 8, 9, 10]), 10);

assert.deepEqual(normalizeModeForAi('["videoReference:1","imageReference:1","audioReference:1"]'), [
  ["videoReference:1", "imageReference:1", "audioReference:1"],
]);
assert.deepEqual(normalizeModeForAi("singleImage"), ["singleImage"]);

assert.equal(detectMediaType("/1/assets/ref.mp4", "clip"), "video");
assert.equal(detectMediaType("/1/assets/ref.wav", "audio"), "audio");
assert.equal(detectMediaType("/1/assets/ref.png", "role"), "image");

assert.doesNotThrow(() => assertReferenceTypesSupported('["videoReference:1","audioReference:1"]', ["video", "audio"]));
assert.throws(() => assertReferenceTypesSupported("singleImage", ["video"]), /不支持 video 参考素材/);

assert.equal(readVideoBase64Upload("data:video/mp4;base64,AAAA").ext, "mp4");
assert.equal(readVideoBase64Upload("data:video/x-msvideo;base64,AAAA").ext, "avi");
assert.throws(() => readVideoBase64Upload("data:image/png;base64,AAAA"), /仅支持/);

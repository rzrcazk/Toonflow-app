import assert from "node:assert/strict";
import { getVideoExtFromBase64, readBase64Payload } from "./videoUploadResult";

assert.equal(getVideoExtFromBase64("data:video/mp4;base64,AAAA"), "mp4");
assert.equal(getVideoExtFromBase64("data:video/webm;base64,AAAA"), "webm");
assert.equal(getVideoExtFromBase64("data:application/octet-stream;base64,AAAA"), "mp4");

assert.equal(readBase64Payload("data:video/mp4;base64,QUJD"), "QUJD");
assert.throws(() => readBase64Payload("not-base64"), /无效的视频 base64 数据/);

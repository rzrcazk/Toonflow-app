import assert from "node:assert/strict";
import { buildVideoUploadPath, readVideoBase64Upload } from "./videoUploadResult";

const tinyPayload = Buffer.from("video").toString("base64");

{
  const upload = readVideoBase64Upload(`data:video/mp4;base64,${tinyPayload}`);
  assert.equal(upload.ext, "mp4");
  assert.equal(upload.mime, "video/mp4");
  assert.equal(upload.buffer.toString(), "video");
}

{
  const upload = readVideoBase64Upload(`data:video/quicktime;base64,${tinyPayload}`);
  assert.equal(upload.ext, "mov");
}

{
  const path = buildVideoUploadPath(12, "webm");
  assert.match(path, /^\/12\/video\/[0-9a-f-]+\.webm$/);
}

assert.throws(() => readVideoBase64Upload("not-base64"), /无效的视频 base64 数据/);
assert.throws(() => readVideoBase64Upload(`data:image/png;base64,${tinyPayload}`), /仅支持/);

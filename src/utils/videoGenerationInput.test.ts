import assert from "node:assert/strict";
import { createVideoReferenceItem, normalizeGenerateVideoInput } from "./videoGenerationInput";

assert.deepEqual(createVideoReferenceItem("image", "data:image/png;base64,AAAA", "http://localhost:10588/oss/1/ref.png"), {
  type: "image",
  sourceType: "base64",
  base64: "data:image/png;base64,AAAA",
  url: "http://localhost:10588/oss/1/ref.png",
});

assert.equal(normalizeGenerateVideoInput("singleImage", 3, [4, 5, 6, 7, 8, 9, 10]).duration, 4);
assert.equal(normalizeGenerateVideoInput("singleImage", 4, [4, 5, 6, 7, 8, 9, 10]).duration, 4);
assert.equal(normalizeGenerateVideoInput("singleImage", 5, [4, 5, 6, 7, 8, 9, 10]).duration, 5);
assert.equal(normalizeGenerateVideoInput("singleImage", 10, [4, 5, 6, 7, 8, 9, 10]).duration, 10);
assert.equal(normalizeGenerateVideoInput("singleImage", 11, [4, 5, 6, 7, 8, 9, 10]).duration, 10);

process.exit(0);

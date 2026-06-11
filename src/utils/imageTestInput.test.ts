import assert from "node:assert/strict";
import { buildImageTestInput } from "./imageTestInput";

const textOnlyInput = buildImageTestInput("a red panda reading", undefined);
assert.equal(textOnlyInput.prompt, "a red panda reading");
assert.equal("referenceList" in textOnlyInput, false);

const imageInput = buildImageTestInput("keep the same character", "data:image/png;base64,abc");
assert.deepEqual(imageInput.referenceList, [{ type: "image", base64: "data:image/png;base64,abc" }]);

const blankImageInput = buildImageTestInput("blank should be text only", "   ");
assert.equal("referenceList" in blankImageInput, false);

console.log("image test input tests passed");

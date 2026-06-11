import assert from "node:assert/strict";
import { DEFAULT_IMAGE_MODEL, isLegacyJimengImageModel, resolveDefaultImageModel } from "./defaultImageModel";

assert.equal(DEFAULT_IMAGE_MODEL, "openai:gpt-image-2");

assert.equal(resolveDefaultImageModel(undefined), "openai:gpt-image-2");
assert.equal(resolveDefaultImageModel(null), "openai:gpt-image-2");
assert.equal(resolveDefaultImageModel(""), "openai:gpt-image-2");
assert.equal(resolveDefaultImageModel("   "), "openai:gpt-image-2");

assert.equal(resolveDefaultImageModel("jimeng:jimeng-5.0"), "openai:gpt-image-2");
assert.equal(resolveDefaultImageModel("jimeng:Doubao-Seedream-5.0-Lite"), "openai:gpt-image-2");
assert.equal(resolveDefaultImageModel("即梦"), "openai:gpt-image-2");

assert.equal(resolveDefaultImageModel("openai:gpt-image-2"), "openai:gpt-image-2");
assert.equal(resolveDefaultImageModel("toonflow:Doubao-Seedream-5.0-Lite"), "toonflow:Doubao-Seedream-5.0-Lite");

assert.equal(isLegacyJimengImageModel("jimeng:jimeng-5.0"), true);
assert.equal(isLegacyJimengImageModel("openai:gpt-image-2"), false);

console.log("default image model tests passed");

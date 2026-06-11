import assert from "node:assert/strict";
import { persistModelTestReferences } from "./modelTestReference";

const writes: Array<{ path: string; data: string }> = [];
const fakeOss = {
  writeFile: async (path: string, data: string) => {
    writes.push({ path, data });
  },
  getFileUrl: async (path: string) => `http://localhost:50188/oss/${path}`,
};

async function main() {
  const refs = await persistModelTestReferences(
    [{ type: "image", base64: "data:image/png;base64,aGVsbG8=" }],
    "image",
    fakeOss,
    () => "fixed-id",
  );

  assert.deepEqual(writes, [{ path: "model-test/image/fixed-id.png", data: "data:image/png;base64,aGVsbG8=" }]);
  assert.deepEqual(refs, [
    {
      type: "image",
      sourceType: "base64",
      base64: "data:image/png;base64,aGVsbG8=",
      url: "http://localhost:50188/oss/model-test/image/fixed-id.png",
    },
  ]);
}

main().then(() => process.exit(0));

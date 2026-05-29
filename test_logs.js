import assert from "node:assert/strict";
import { runEngineSmokeTests } from "./tests/engine.test.js";

await assert.doesNotReject(runEngineSmokeTests());
console.log("headless smoke tests passed");

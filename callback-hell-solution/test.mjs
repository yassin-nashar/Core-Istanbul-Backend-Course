import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const modulePath = process.env.WORKFLOW_MODULE ?? "./async-version.mjs";

function runScenario(scenario) {
  return spawnSync(process.execPath, [modulePath, scenario], {
    cwd: import.meta.dirname,
    encoding: "utf8",
  });
}

function outputLines(output) {
  return output.trim().split(/\r?\n/);
}

test("success completes user, orders, and email operations in order", () => {
  const result = runScenario("success");

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(outputLines(result.stdout), [
    "User loaded: Ada",
    "Orders loaded: 2",
    "Email sent to: ada@example.com",
    "Workflow complete",
  ]);
});

test("orders failure stops the workflow before email is sent", () => {
  const result = runScenario("failure");

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(outputLines(result.stdout), [
    "User loaded: Grace",
    "Workflow failed: Could not load orders for user 2",
  ]);
  assert.doesNotMatch(result.stdout, /Email sent/);
});

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test } from "node:test";

const moduleFile = path.resolve(process.env.APP_MODULE ?? "dist/app.js");
const sourceFile = path.resolve(process.env.APP_SOURCE ?? "src/app.ts");
const tsconfigFile = path.resolve(process.env.TSCONFIG_FILE ?? "tsconfig.json");

function loadApp() {
  return import(pathToFileURL(moduleFile).href);
}

function stripCommentsAndStrings(source) {
  return source.replace(
    /\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g,
    " ",
  );
}

test("valid task data returns its title", async () => {
  const { getTaskTitle } = await loadApp();

  assert.equal(
    getTaskTitle({ id: 101, title: "Review API", completed: false }),
    "Review API",
  );
  assert.equal(
    getTaskTitle({ id: 202, title: "Ship API", completed: true }),
    "Ship API",
  );
});

test("invalid input throws instead of silently succeeding", async () => {
  const { getTaskTitle } = await loadApp();

  assert.equal(typeof getTaskTitle, "function", "Export getTaskTitle for testing");

  for (const invalidValue of [null, "not a task", { id: 101 }]) {
    assert.throws(() => getTaskTitle(invalidValue));
  }
});

test("the solution contains no explicit any type", () => {
  const sourceText = fs.readFileSync(sourceFile, "utf8");
  const codeOnly = stripCommentsAndStrings(sourceText);

  assert.doesNotMatch(codeOnly, /\bany\b/, "Found an explicit any type");
});

test("TypeScript strict mode remains enabled", () => {
  const config = JSON.parse(fs.readFileSync(tsconfigFile, "utf8"));

  assert.equal(config.compilerOptions?.strict, true);
});

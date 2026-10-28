// Each example runs on its own.
// A caught error does not stop the later examples.

function runExample(name, fn) {
  console.log("\n--- " + name + " ---");
  return Promise.resolve()
    .then(fn)
    .catch(function (error) {
      console.log("Caught " + error.name + ": " + error.message);
    });
}

async function main() {
  console.log("Runtime comparison: browser");

  await runExample("console.log", function () {
    console.log("Hello from the browser");
  });

  await runExample("arrays", function () {
    const colors = ["red", "green", "blue"];
    console.log("colors:", colors);
    console.log(
      "uppercase:",
      colors.map(function (color) {
        return color.toUpperCase();
      }),
    );
    console.log("first color:", colors[0]);
    console.log("count:", colors.length);
  });

  await runExample("globalThis", function () {
    console.log("typeof globalThis:", typeof globalThis);
    console.log("globalThis === window:", globalThis === window);
    console.log("has window:", "window" in globalThis);
    console.log("has document:", "document" in globalThis);
    console.log("has process:", "process" in globalThis);
  });

  await runExample("document", function () {
    console.log("document title:", document.title);
    console.log("heading:", document.querySelector("h1").textContent);
  });

  await runExample("window", function () {
    console.log("typeof window:", typeof window);
    console.log("window === globalThis:", window === globalThis);
  });

  await runExample("process", function () {
    console.log("process version:", process.version);
  });

  await runExample("node:fs", async function () {
    await import("node:fs");
    console.log("loaded node:fs");
  });

  console.log("\nDone. Every example ran, including the ones that were caught.");
}

main();

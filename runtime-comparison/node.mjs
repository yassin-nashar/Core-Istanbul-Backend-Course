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
  console.log("Runtime comparison: Node.js");

  await runExample("console.log", function () {
    console.log("Hello from Node.js");
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
    console.log("globalThis === global:", globalThis === global);
    console.log("has window:", "window" in globalThis);
    console.log("has document:", "document" in globalThis);
    console.log("has process:", "process" in globalThis);
  });

  await runExample("document", function () {
    console.log("document title:", document.title);
  });

  await runExample("window", function () {
    console.log("window === globalThis:", window === globalThis);
  });

  await runExample("process", function () {
    console.log("process version:", process.version);
    console.log("process platform:", process.platform);
  });

  await runExample("node:fs", async function () {
    const fs = await import("node:fs");
    const html = fs.readFileSync(
      new URL("./index.html", import.meta.url),
      "utf8",
    );
    console.log("index.html starts with:", JSON.stringify(html.slice(0, 15)));
  });

  console.log("\nDone. Every example ran, including the ones that were caught.");
}

main();

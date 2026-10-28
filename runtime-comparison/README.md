# Runtime comparison

A short instructor-led demo. The same JavaScript ideas run in a browser and in Node.js. Some names exist in only one of those places.

No packages to install. No framework. The browser file and the Node file do not depend on each other.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Opens the browser demo. |
| `browser.js` | The seven examples in the browser. |
| `node.mjs` | The seven examples in Node.js. |
| `README.md` | How to run the demo, and what to discuss. |

`.mjs` tells Node to treat `node.mjs` as a JavaScript module, so `import()` is allowed.

Each example is wrapped in `runExample`. If one example throws, that wrapper catches the error and the next example still runs.

## Run the browser example

1. Open the `runtime-comparison` folder in File Explorer.
2. Double-click `index.html`. It opens in your default browser.
3. Open the DevTools console.
   - Windows or Linux: `Ctrl+Shift+J`
   - macOS: `Command+Option+J`
   - Or press `F12`, then choose the **Console** tab.
4. If the console is empty, reload the page (`Ctrl+R`, or `Command+R` on macOS). The script runs again when the page loads.
5. Read the console from top to bottom.

The page itself only tells you to open the console. The examples are the console messages.

## Expected browser console

Checked by opening `index.html` directly in Chrome. DevTools shows arrays as expandable arrays. The values are what matter.

```text
Runtime comparison: browser

--- console.log ---
Hello from the browser

--- arrays ---
colors:           ["red", "green", "blue"]
uppercase:        ["RED", "GREEN", "BLUE"]
first color: red
count: 3

--- globalThis ---
typeof globalThis: object
globalThis === window: true
has window: true
has document: true
has process: false

--- document ---
document title: Runtime comparison
heading: Runtime comparison

--- window ---
typeof window: object
window === globalThis: true

--- process ---
Caught ReferenceError: process is not defined

--- node:fs ---
Caught TypeError: Failed to fetch dynamically imported module: node:fs

Done. Every example ran, including the ones that were caught.
```

Chrome also prints a red message just before the caught `node:fs` error, because the page was opened as a file:

```text
Access to script at 'node:fs' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-experimental-site-token-provider, chrome-extension, chrome-untrusted, data, http, https, isolated-app.
```

That red line is expected. The script still catches the failure, prints `Caught TypeError...`, and then prints `Done`.

Edge should be close to Chrome. Firefox may word the `node:fs` failure differently. In every browser you should still see the caught error and the final `Done` line.

## Run the Node.js example

1. Install Node.js if `node` is not already available. Check with:

   ```text
   node -v
   ```

   You should see a version such as `v22.19.0`. If the terminal says `node` is not recognized, install Node from [https://nodejs.org](https://nodejs.org) and open a new terminal.

2. Move into this folder. From the repository root:

   ```text
   cd runtime-comparison
   ```

3. Run:

   ```text
   node node.mjs
   ```

## Expected Node.js output

`document` and `window` are caught errors. The examples after them still run.

`process version` matches `node -v` on that computer. `process platform` is `win32` on Windows, `darwin` on macOS, and `linux` on Linux. The sample below is from Node `v22.19.0` on Windows.

```text
Runtime comparison: Node.js

--- console.log ---
Hello from Node.js

--- arrays ---
colors: [ 'red', 'green', 'blue' ]
uppercase: [ 'RED', 'GREEN', 'BLUE' ]
first color: red
count: 3

--- globalThis ---
typeof globalThis: object
globalThis === global: true
has window: false
has document: false
has process: true

--- document ---
Caught ReferenceError: document is not defined

--- window ---
Caught ReferenceError: window is not defined

--- process ---
process version: v22.19.0
process platform: win32

--- node:fs ---
index.html starts with: "<!DOCTYPE html>"

Done. Every example ran, including the ones that were caught.
```

Node prints arrays as text, with square brackets and quotes. The browser console shows the same values as live arrays. The values are the same: `red`, `green`, `blue`, then `RED`, `GREEN`, `BLUE`.

## What each result is showing

| Example | Browser | Node.js |
| --- | --- | --- |
| `console.log` | Prints to DevTools. | Prints to the terminal. |
| arrays | Normal JavaScript arrays. | The same arrays. |
| `globalThis` | The global object is `window`. | The global object is `global`. |
| `document` | The page. The title and heading are readable. | `ReferenceError: document is not defined` |
| `window` | The page's global object. | `ReferenceError: window is not defined` |
| `process` | `ReferenceError: process is not defined` | Node's own process object: version and platform. |
| `node:fs` | The import fails. A browser page cannot load Node's file module. | Reads `index.html` from disk. |

## Instructor discussion questions

1. `console.log` and the array example succeed in both places. Which parts of this demo are the JavaScript language, and which parts are the runtime around it?
2. `globalThis` exists in the browser and in Node, but the `has window` and `has process` answers flip. What is `globalThis` actually pointing at in each runtime?
3. The browser reads `document.title`. Node says `document is not defined`. Does that mean the JavaScript language has no `document`, or that Node has no page?
4. `process.version` is useful in Node and a `ReferenceError` in the browser. Who provides `process`?
5. Node reads `index.html` through `node:fs`. Why is it a good thing that the same call fails in the browser?
6. In `node.mjs`, `document` throws and `process` still prints. What would students lose if the `catch` were removed from `runExample`?

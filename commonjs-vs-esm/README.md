# CommonJS vs ESM

The same `add(a, b)` function, loaded in two Node.js module systems. No packages to install.

`.cjs` is always CommonJS. `.mjs` is always ESM. The file extension decides that, so this folder does not need a `package.json`.

## Files

| File | Role |
| --- | --- |
| `add.cjs` | `add` exported with `module.exports`. |
| `commonjs.cjs` | Loads it with `require`. |
| `add.mjs` | `add` exported with `export`. |
| `esm.mjs` | Loads it with a named `import`. This is the working ESM example. |
| `esm-import-error.mjs` | The same function, imported the wrong way on purpose. |

## Run CommonJS

From this folder:

```text
node commonjs.cjs
```

Expected output:

```text
CommonJS add(2, 3) = 5
```

## Run ESM

```text
node esm.mjs
```

Expected output:

```text
ESM add(2, 3) = 5
```

Both commands print `5` because the function is the same. Only the loading syntax changes.

## Intentional ESM import error

`add.mjs` has a named export:

```js
export function add(a, b) {
  return a + b;
}
```

`esm-import-error.mjs` asks for a default export instead:

```js
import add from "./add.mjs";
```

Run it:

```text
node esm-import-error.mjs
```

Node exits with an error. The important line is:

```text
SyntaxError: The requested module './add.mjs' does not provide an export named 'default'
```

The full message also points at the `import` line and ends with the Node version.

### Fix

Import the name that was exported. That is what `esm.mjs` already does:

```js
import { add } from "./add.mjs";
```

Run `node esm.mjs` again and the result is `ESM add(2, 3) = 5`.

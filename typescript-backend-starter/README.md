# TypeScript Backend Starter

A minimal Node.js backend starter using TypeScript and ECMAScript modules (ESM).

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm start
```

- `npm run dev` runs `src/app.ts` directly with `tsx`.
- `npm run typecheck` checks TypeScript types without creating output files.
- `npm run build` compiles the TypeScript source from `src/` into JavaScript in `dist/`.
- `npm start` runs the compiled `dist/app.js` file with Node.js.

## Files

- `src/app.ts`: the TypeScript application entry point.
- `dist/app.js`: generated JavaScript created by the build command.
- `tsconfig.json`: strict TypeScript and ESM compiler configuration.
- `package.json`: project metadata, scripts, and development dependencies.
- `package-lock.json`: exact installed dependency versions for reproducible installs.
- `.gitignore`: excludes dependencies, build output, logs, and local system files.

import fs from "fs";
import path from "path";
import { mkdirSync } from "fs";

const root = process.cwd();

// Create dummy astro.config.mjs
const astroConfig = path.join(root, "astro.config.mjs");
if (!fs.existsSync(astroConfig)) {
  fs.writeFileSync(
    astroConfig,
    `
// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone'
  })
});
`,
  );
  console.log("Created dummy astro.config.mjs");
}

// Create dist folder if it doesn't exist
const distRoot = path.join(root, "dist");
if (!fs.existsSync(distRoot)) mkdirSync(distRoot);

// copy astro.config.mjs to dist
const astroConfigDist = path.join(distRoot, "astro.config.mjs");
if (!fs.existsSync(astroConfigDist)) {
  fs.copyFileSync(astroConfig, astroConfigDist);
  console.log("Copied astro.config.mjs to dist");
}

// Move existing dist contents to dist/client
const oldDist = path.join(root, "dist");
const clientDir = path.join(distRoot, "dist");
if (!fs.existsSync(clientDir)) mkdirSync(clientDir);

// Move files from old dist to client
for (const f of fs.readdirSync(oldDist)) {
  if (f === "dist") continue; // skip if already exists
  const oldPath = path.join(oldDist, f);
  const newPath = path.join(clientDir, f);
  fs.renameSync(oldPath, newPath);
}
console.log("Moved dist contents to dist/dist");

// Move server folder into dist/server
const serverDir = path.join(root, "server");
const newServerDir = path.join(distRoot, "server");
if (!fs.existsSync(newServerDir)) mkdirSync(newServerDir);

// Move all server files
for (const f of fs.readdirSync(serverDir)) {
  fs.renameSync(path.join(serverDir, f), path.join(newServerDir, f));
}
fs.rmdirSync(serverDir);
console.log("Moved server/ to dist/server");

// Create server/entry.mjs if not exists
const entryMjs = path.join(newServerDir, "entry.mjs");
if (!fs.existsSync(entryMjs)) {
  fs.writeFileSync(entryMjs, `import './entry.fastify.js';\n`);
  console.log("Created dist/server/entry.mjs pointing to entry.fastify.js");
}

// Add dummy SSR placeholder files
const dummyFiles = [
  "_noop-middleware.mjs",
  "manifest_dummy.mjs",
  "renderers.mjs",
];

for (const f of dummyFiles) {
  const filePath = path.join(newServerDir, f);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "// dummy SSR file\n");
    console.log(`Created dist/server/${f}`);
  }
}

console.log("\nDirectory structure after postbuild:");

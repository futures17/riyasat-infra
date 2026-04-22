import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyRecursive(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  const stats = fs.statSync(source);
  if (stats.isDirectory()) {
    ensureDir(destination);
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }

  ensureDir(path.dirname(destination));
  fs.copyFileSync(source, destination);
}

function writeInjectedAiApi() {
  const sourceFile = path.join(root, "ai-chat", "api.js");
  const targetFile = path.join(distDir, "ai-chat", "api.js");

  if (!fs.existsSync(sourceFile)) {
    return;
  }

  let content = fs.readFileSync(sourceFile, "utf8");
  const apiKey = JSON.stringify(process.env.VITE_OPENROUTER_API_KEY || "");

  content = content.replace(
    "const API_KEY = import.meta.env ? import.meta.env.VITE_OPENROUTER_API_KEY : '';",
    `const API_KEY = ${apiKey};`
  );

  ensureDir(path.dirname(targetFile));
  fs.writeFileSync(targetFile, content, "utf8");
}

if (!fs.existsSync(distDir)) {
  throw new Error("dist folder not found. Run Vite build before postbuild.");
}

copyRecursive(path.join(root, "src", "assets"), path.join(distDir, "src", "assets"));
copyRecursive(path.join(root, "ai-chat"), path.join(distDir, "ai-chat"));
writeInjectedAiApi();

console.log("Postbuild runtime assets copied to dist.");

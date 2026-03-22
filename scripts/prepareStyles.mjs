import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const srcStylesDir = path.join(packageRoot, "src", "styles");
const srcStylesEntry = path.join(packageRoot, "src", "styles.css");
const distDir = path.join(packageRoot, "dist");
const distStylesDir = path.join(distDir, "styles");
const distStylesEntry = path.join(distDir, "styles.css");

await mkdir(distDir, { recursive: true });
await cp(srcStylesDir, distStylesDir, { recursive: true });
await cp(srcStylesEntry, distStylesEntry);

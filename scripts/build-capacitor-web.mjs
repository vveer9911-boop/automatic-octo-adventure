import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const backupDir = path.join(root, ".api-tmp-backup");

try {
  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, backupDir);
  }
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, CAPACITOR_BUILD: "1" },
  });
} finally {
  if (fs.existsSync(backupDir)) {
    fs.renameSync(backupDir, apiDir);
  }
}

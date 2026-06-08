import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const watchMode = args.has("--watch");
const onceMode = args.has("--once") || !watchMode;
const debounceMs = Number(process.env.AUTO_PUSH_DEBOUNCE_MS || 3000);
const commitPrefix = process.env.AUTO_PUSH_COMMIT_PREFIX || "auto: update site";

let running = false;
let pending = false;
let timer = null;

const ignoredDirs = new Set([
  ".git",
  "node_modules",
  ".wrangler",
  ".cache",
  "dist"
]);

function run(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: root,
      stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
      shell: false
    });

    let stdout = "";
    let stderr = "";

    if (options.capture) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
    }

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      const details = [stdout.trim(), stderr.trim()].filter(Boolean).join("\n");
      reject(new Error(`${command} ${commandArgs.join(" ")} failed with code ${code}${details ? `\n${details}` : ""}`));
    });
  });
}

async function currentBranch() {
  return run("git", ["branch", "--show-current"], { capture: true });
}

async function hasChanges() {
  const status = await run("git", ["status", "--porcelain"], { capture: true });
  return status.length > 0;
}

async function commitAndPush() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  pending = false;

  try {
    await run(process.execPath, ["scripts/update-content.mjs"]);

    if (!(await hasChanges())) {
      console.log("No local changes to push.");
      return;
    }

    const branch = await currentBranch();
    if (!branch) {
      throw new Error("Cannot auto-push from a detached HEAD.");
    }

    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
    await run("git", ["add", "-A"]);
    await run("git", ["commit", "-m", `${commitPrefix} ${timestamp}`]);
    await run("git", ["push", "origin", branch]);
    console.log(`Pushed ${branch} to origin.`);
  } finally {
    running = false;
    if (pending && watchMode) {
      schedulePush();
    }
  }
}

function schedulePush() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    commitAndPush().catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }, debounceMs);
}

function watchDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      watchDirectory(fullPath);
    }
  }

  fs.watch(dir, { persistent: true }, (_eventType, filename) => {
    if (!filename) return;
    const firstPart = String(filename).split(path.sep)[0];
    if (ignoredDirs.has(firstPart)) return;
    schedulePush();
  });
}

if (watchMode) {
  console.log(`Watching ${root} and auto-pushing changed files after ${debounceMs}ms of quiet time.`);
  watchDirectory(root);
} else if (onceMode) {
  await commitAndPush();
}

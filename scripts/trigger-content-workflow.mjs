import { spawn } from "node:child_process";

const owner = process.env.GITHUB_OWNER || "wzy782762257";
const repo = process.env.GITHUB_REPO || "aibriefnote";
const workflow = process.env.GITHUB_WORKFLOW || "update-content.yml";
const ref = process.env.GITHUB_REF || "main";

function run(command, args, input = "") {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      shell: false
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}: ${stderr.trim() || stdout.trim()}`));
    });

    child.stdin.end(input);
  });
}

async function tokenFromGitCredential() {
  const credential = await run("git", ["credential", "fill"], "protocol=https\nhost=github.com\n\n");
  const passwordLine = credential.split("\n").find((line) => line.startsWith("password="));
  return passwordLine ? passwordLine.slice("password=".length) : "";
}

async function githubFetch(path, options = {}) {
  const token = process.env.GITHUB_TOKEN || await tokenFromGitCredential();

  if (!token) {
    throw new Error("No GitHub token found. Push once with HTTPS or set GITHUB_TOKEN.");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });

  if (!response.ok && response.status !== 204) {
    const text = await response.text();
    throw new Error(`GitHub API returned ${response.status}: ${text}`);
  }

  return response.status === 204 ? null : response.json();
}

await githubFetch(`/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`, {
  method: "POST",
  body: JSON.stringify({ ref })
});

console.log(`Triggered ${owner}/${repo} ${workflow} on ${ref}.`);

const runs = await githubFetch(`/repos/${owner}/${repo}/actions/workflows/${workflow}/runs?branch=${ref}&per_page=1`);
const latest = runs.workflow_runs?.[0];

if (latest) {
  console.log(`Latest run: ${latest.html_url}`);
  console.log(`Status: ${latest.status}${latest.conclusion ? ` / ${latest.conclusion}` : ""}`);
}

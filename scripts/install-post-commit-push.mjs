import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const hookPath = path.join(root, ".git", "hooks", "post-commit");
const hook = `#!/bin/sh
branch="$(git branch --show-current)"

if [ -z "$branch" ]; then
  exit 0
fi

git push origin "$branch"
`;

await fs.writeFile(hookPath, hook, { mode: 0o755 });
await fs.chmod(hookPath, 0o755);

console.log(`Installed post-commit auto-push hook at ${hookPath}`);

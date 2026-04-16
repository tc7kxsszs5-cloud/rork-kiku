#!/usr/bin/env node

const path = require("node:path");
const { execFileSync } = require("node:child_process");

const regressproofRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(regressproofRoot, "..");

function main() {
  const args = process.argv.slice(2);
  const repo = readArg(args, "--repo") || workspaceRoot;
  const format = readArg(args, "--format") || "json";
  const artifactDir =
    readArg(args, "--artifact-dir") || path.join(require("node:os").tmpdir(), "regressproof-workspace-real-repo");
  const ciMode = args.includes("--ci");
  const configPath = path.join(regressproofRoot, "regressproof.workspace-repo.config.json");

  const cliArgs = [
    path.join(regressproofRoot, "src", "cli.js"),
    "run",
    "--repo",
    repo,
    "--config",
    configPath,
    "--format",
    format,
    "--artifact-dir",
    artifactDir,
  ];

  if (ciMode) {
    cliArgs.push("--ci");
  }

  process.stderr.write(
    `RegressProof workspace validation using HEAD vs worktree diff against repo ${repo}\n`,
  );

  execFileSync("node", cliArgs, {
    cwd: regressproofRoot,
    stdio: "inherit",
  });
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

main();

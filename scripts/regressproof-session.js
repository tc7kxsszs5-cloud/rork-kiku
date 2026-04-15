#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const sessionsDir = path.join(repoRoot, "docs", "sessions");
const now = new Date();
const date = now.toISOString().slice(0, 10);
const filePath = path.join(sessionsDir, `${date}-session.md`);
const trackedPrefixes = [
  ".github/workflows/regressproof.yml",
  "AGENTS.md",
  "docs/REGRESSPROOF_",
  "docs/sessions/",
  "regressproof/",
  "scripts/regressproof-session.js",
];

function safeGit(args) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function collectChangedFiles() {
  const output = safeGit(["status", "--short"]);
  if (!output) {
    return [];
  }

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^[A-Z?]+\s+(.+)$/i);
      return match ? match[1] : line;
    })
    .map((file) => normalizeStatusPath(file))
    .filter((file) => isTrackedRegressProofPath(file));
}

function normalizeStatusPath(file) {
  return file
    .replace(/^"+|"+$/g, "")
    .replace(/\\/g, "/")
    .trim();
}

function isTrackedRegressProofPath(file) {
  return trackedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix));
}

function buildTemplate() {
  const branch = safeGit(["rev-parse", "--abbrev-ref", "HEAD"]) || "unknown";
  const head = safeGit(["rev-parse", "--short", "HEAD"]) || "unknown";
  const changedFiles = collectChangedFiles();
  const changedFilesBlock =
    changedFiles.length > 0
      ? changedFiles.map((file) => `- \`${file}\``).join("\n")
      : "- none";

  return `# RegressProof Session Note

**Date:** ${date}
**Focus:** 
**Status:** partial
**Branch:** \`${branch}\`
**Head:** \`${head}\`

## Completed

- 

## Changed Files

${changedFilesBlock}

## Decisions

- 

## Open Questions

- 

## Next Best Step

- 
`;
}

fs.mkdirSync(sessionsDir, { recursive: true });

if (fs.existsSync(filePath)) {
  process.stdout.write(`Session note already exists: ${filePath}\n`);
  process.exit(0);
}

fs.writeFileSync(filePath, buildTemplate(), "utf8");
process.stdout.write(`Created session note: ${filePath}\n`);

#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

async function main() {
  const args = process.argv.slice(2);
  const fixtureArg = readArg(args, "--fixture");

  if (!fixtureArg) {
    throw new Error("Missing required argument: --fixture");
  }

  const fixturePath = path.resolve(process.cwd(), fixtureArg);
  const fixtureConfigPath = path.join(fixturePath, "regressproof.config.json");

  if (!fs.existsSync(path.join(fixturePath, ".git"))) {
    throw new Error("Fixture must currently be an embedded git repo to export a scenario pack.");
  }

  const fixtureConfig = JSON.parse(fs.readFileSync(fixtureConfigPath, "utf8"));
  const baselineRef = fixtureConfig.baselineRef || "HEAD~1";
  const compareRef = readArg(args, "--compare-ref") || "HEAD";
  const baselineDir = path.join(fixturePath, "tracked", "baseline");
  const currentDir = path.join(fixturePath, "tracked", "current");

  await exportRefTree(fixturePath, baselineRef, baselineDir);
  await exportRefTree(fixturePath, compareRef, currentDir);
  await cleanupTrackedTree(baselineDir);
  await cleanupTrackedTree(currentDir);
  await normalizeTrackedConfig(path.join(baselineDir, "regressproof.config.json"), "HEAD~1");
  await normalizeTrackedConfig(path.join(currentDir, "regressproof.config.json"), "HEAD~1");

  const manifest = {
    version: 1,
    configPath: "regressproof.config.json",
    commits: [
      {
        name: "baseline",
        sourceDir: "tracked/baseline",
        message: `${path.basename(fixturePath)}: baseline`,
      },
      {
        name: "current",
        sourceDir: "tracked/current",
        message: `${path.basename(fixturePath)}: current`,
      },
    ],
  };

  await fsp.writeFile(
    path.join(fixturePath, "fixture.materializer.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(
    `${JSON.stringify(
      {
        fixturePath,
        baselineRef,
        compareRef,
        baselineDir,
        currentDir,
        manifestPath: path.join(fixturePath, "fixture.materializer.json"),
      },
      null,
      2,
    )}\n`,
  );
}

async function exportRefTree(repoPath, ref, outputDir) {
  await fsp.rm(outputDir, { recursive: true, force: true });
  await fsp.mkdir(outputDir, { recursive: true });

  const archivePath = path.join(outputDir, "..", `${ref.replace(/[^\w.-]/g, "_")}.tar`);

  execFileSync("git", ["archive", "--format=tar", "-o", archivePath, ref], {
    cwd: repoPath,
    stdio: ["ignore", "ignore", "pipe"],
  });

  execFileSync("tar", ["-xf", archivePath, "-C", outputDir], {
    stdio: ["ignore", "ignore", "pipe"],
  });

  await fsp.rm(archivePath, { force: true });
}

async function normalizeTrackedConfig(configPath, baselineRef) {
  const raw = await fsp.readFile(configPath, "utf8");
  const parsed = JSON.parse(raw);
  parsed.baselineRef = baselineRef;
  await fsp.writeFile(configPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}

async function cleanupTrackedTree(rootDir) {
  await walkAndClean(rootDir);
}

async function walkAndClean(currentDir) {
  const entries = await fsp.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      await walkAndClean(entryPath);
      continue;
    }

    if (entry.isFile() && isAccidentalDuplicate(entry.name)) {
      await fsp.rm(entryPath, { force: true });
    }
  }
}

function isAccidentalDuplicate(fileName) {
  return /^(package|regressproof\.config) \d+\.json$/.test(fileName);
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`RegressProof fixture export error: ${message}\n`);
  process.exitCode = 1;
});

#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

async function main() {
  const args = process.argv.slice(2);
  const fixtureArg = readArg(args, "--fixture");

  if (!fixtureArg) {
    throw new Error("Missing required argument: --fixture");
  }

  const fixturePath = path.resolve(process.cwd(), fixtureArg);
  const outputRoot =
    readArg(args, "--out-dir") ||
    (await fsp.mkdtemp(path.join(os.tmpdir(), "regressproof-fixture-")));
  const outputDir = path.resolve(process.cwd(), outputRoot);
  const manifestPath = path.join(fixturePath, "fixture.materializer.json");

  await fsp.mkdir(outputDir, { recursive: true });

  let result;
  if (fs.existsSync(manifestPath)) {
    result = await materializeScenarioPack(fixturePath, manifestPath, outputDir);
  } else if (fs.existsSync(path.join(fixturePath, ".git"))) {
    result = await materializeEmbeddedFixtureRepo(fixturePath, outputDir);
  } else {
    throw new Error(
      "Fixture is neither an embedded git repo nor a tracked scenario pack with fixture.materializer.json",
    );
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

async function materializeEmbeddedFixtureRepo(fixturePath, outputDir) {
  const repoDir = path.join(outputDir, "repo");
  const fixtureConfigPath = path.join(fixturePath, "regressproof.config.json");
  const fixtureConfig = readJson(fixtureConfigPath);
  const baselineRef = fixtureConfig.baselineRef || "HEAD~1";
  const baselineCommit = git(fixturePath, ["rev-parse", baselineRef]);
  const headCommit = git(fixturePath, ["rev-parse", "HEAD"]);

  await fsp.rm(repoDir, { recursive: true, force: true });
  execFileSync("git", ["clone", "--no-local", fixturePath, repoDir], {
    stdio: ["ignore", "ignore", "pipe"],
  });

  const baselineDir = path.join(outputDir, "baseline");
  const currentDir = path.join(outputDir, "current");
  await exportRefTree(fixturePath, baselineRef, baselineDir);
  await exportRefTree(fixturePath, "HEAD", currentDir);

  return {
    materialization: "embedded_git_repo",
    fixturePath,
    outputDir,
    repoDir,
    baselineRef,
    baselineCommit,
    compareRef: "HEAD",
    compareCommit: headCommit,
    configPath: path.join(repoDir, "regressproof.config.json"),
    baselineDir,
    currentDir,
  };
}

async function materializeScenarioPack(fixturePath, manifestPath, outputDir) {
  const manifest = readJson(manifestPath);
  const commits = Array.isArray(manifest.commits) ? manifest.commits : [];

  if (commits.length < 2) {
    throw new Error("Tracked scenario pack must define at least two commits.");
  }

  const repoDir = path.join(outputDir, "repo");
  await fsp.rm(repoDir, { recursive: true, force: true });
  await fsp.mkdir(repoDir, { recursive: true });

  git(repoDir, ["init"]);
  git(repoDir, ["config", "user.name", "RegressProof Fixture Bot"]);
  git(repoDir, ["config", "user.email", "fixtures@regressproof.local"]);

  const commitRefs = [];

  for (const commit of commits) {
    if (!commit.sourceDir) {
      throw new Error("Each tracked scenario commit must define sourceDir.");
    }

    await resetDirectoryContents(repoDir);
    await copyDirectoryContents(path.join(fixturePath, commit.sourceDir), repoDir);
    git(repoDir, ["add", "-A"]);
    git(repoDir, ["commit", "-m", commit.message || `fixture: ${commit.sourceDir}`]);
    const sha = git(repoDir, ["rev-parse", "HEAD"]);
    commitRefs.push({
      name: commit.name || commit.sourceDir,
      sha,
      sourceDir: commit.sourceDir,
    });
  }

  const baseline = commitRefs[commitRefs.length - 2];
  const current = commitRefs[commitRefs.length - 1];
  const manifestConfigPath = path.join(repoDir, manifest.configPath || "regressproof.config.json");
  const fallbackConfigPath = path.join(repoDir, "regressproof.config.json");
  const configPath = fs.existsSync(manifestConfigPath) ? manifestConfigPath : fallbackConfigPath;

  return {
    materialization: "tracked_scenario_pack",
    fixturePath,
    outputDir,
    repoDir,
    baselineRef: baseline.sha,
    baselineCommit: baseline.sha,
    compareRef: current.sha,
    compareCommit: current.sha,
    configPath,
    commits: commitRefs,
  };
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

async function resetDirectoryContents(targetDir) {
  const entries = await fsp.readdir(targetDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".git") {
      continue;
    }

    await fsp.rm(path.join(targetDir, entry.name), { recursive: true, force: true });
  }
}

async function copyDirectoryContents(sourceDir, targetDir) {
  const entries = await fsp.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await fsp.mkdir(targetPath, { recursive: true });
      await copyDirectoryContents(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      await fsp.mkdir(path.dirname(targetPath), { recursive: true });
      await fsp.copyFile(sourcePath, targetPath);
    }
  }
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }

  return args[index + 1] || "";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`RegressProof fixture materializer error: ${message}\n`);
  process.exitCode = 1;
});

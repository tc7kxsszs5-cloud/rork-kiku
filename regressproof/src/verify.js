const { execFile } = require("node:child_process");
const { lstat, mkdir, mkdtemp, rm, symlink } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

async function executeVerificationFlow(config, gitContext) {
  const baselineWorktreePath = await mkdtemp(path.join(os.tmpdir(), "regressproof-baseline-"));
  const currentSnapshotPath = await mkdtemp(path.join(os.tmpdir(), "regressproof-current-"));
  const timeoutMs = config.checks.commandTimeoutMs || 300000;
  let baselineMode = config.baseline?.mode || "full_snapshot";
  const requestedCurrentMode = resolveCurrentMode(config, gitContext);
  let currentMode = requestedCurrentMode;

  try {
    let baseline = [];
    if (baselineMode !== "skip") {
      try {
        await createSnapshot(
          gitContext.repoRoot,
          gitContext.baselineRef,
          baselineWorktreePath,
          baselineMode,
          gitContext.targetPaths || [],
          config.baseline?.supportPaths || [],
        );
        await mirrorDependencies(gitContext.repoRoot, baselineWorktreePath);
        baseline = await runCheckList(config.checks.quick, baselineWorktreePath, timeoutMs);
      } catch (error) {
        if (baselineMode === "path_snapshot" && isMissingPathspecError(error)) {
          baselineMode = "skip";
          baseline = [];
        } else {
          throw error;
        }
      }
    }

    let currentCwd = gitContext.repoRoot;
    if (currentMode === "snapshot") {
      try {
        await createSnapshot(
          gitContext.repoRoot,
          gitContext.compareRef,
          currentSnapshotPath,
          baselineMode === "skip" ? "path_snapshot" : baselineMode,
          gitContext.targetPaths || [],
          config.baseline?.supportPaths || [],
        );
        await mirrorDependencies(gitContext.repoRoot, currentSnapshotPath);
        currentCwd = currentSnapshotPath;
      } catch (error) {
        if (canFallbackCurrentSnapshotToWorktree(error, gitContext)) {
          currentMode = "worktree_fallback";
          currentCwd = gitContext.repoRoot;
        } else {
          throw error;
        }
      }
    }

    const current = await runCheckList(config.checks.quick, currentCwd, timeoutMs);

    return {
      completed: true,
      baselineWorktree: baselineWorktreePath,
      baselineMode,
      currentMode,
      changedFiles: gitContext.changedFiles,
      baseline,
      current,
    };
  } finally {
    await rm(baselineWorktreePath, { recursive: true, force: true });
    await rm(currentSnapshotPath, { recursive: true, force: true });
  }
}

function isMissingPathspecError(error) {
  const message = typeof error?.message === "string" ? error.message : "";
  const stderr = typeof error?.stderr === "string" ? error.stderr : "";
  return stderr.includes("did not match any files") || message.includes("No target paths exist at ref");
}

async function runCheckList(commands, cwd, timeoutMs) {
  const results = [];

  for (const command of commands) {
    const startedAt = Date.now();
    try {
      await execCommand(command, cwd, timeoutMs);
      results.push({
        command,
        cwd,
        status: "passed",
        exitCode: 0,
        durationMs: Date.now() - startedAt,
      });
    } catch (error) {
      const timedOut = error.killed || error.signal === "SIGTERM";
      results.push({
        command,
        cwd,
        status: timedOut ? "timed_out" : "failed",
        exitCode: typeof error.code === "number" ? error.code : 1,
        durationMs: Date.now() - startedAt,
        stderr: takeSnippet(error.stderr),
        stdout: takeSnippet(error.stdout),
        signal: error.signal || "",
      });
    }
  }

  return results;
}

async function execCommand(command, cwd, timeoutMs) {
  return execFileAsync("/bin/zsh", ["-lc", command], {
    cwd,
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024 * 10,
  });
}

async function createSnapshot(
  repoRoot,
  ref,
  outputDir,
  snapshotMode,
  targetPaths,
  supportPaths = [],
) {
  const archivePath = path.join(outputDir, "snapshot.tar");
  const args = ["archive", "--format=tar", "-o", archivePath, ref];
  if (snapshotMode === "path_snapshot" && Array.isArray(targetPaths) && targetPaths.length > 0) {
    const allPaths = [...new Set([...targetPaths, ...supportPaths])];
    const existingPaths = await resolveExistingPaths(repoRoot, ref, allPaths);
    if (existingPaths.length === 0) {
      throw new Error(`No target paths exist at ref ${ref}`);
    }
    args.push("--", ...existingPaths);
  }

  await execFileAsync("git", args, {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  });

  await execFileAsync("tar", ["-xf", archivePath, "-C", outputDir], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  });

  await rm(archivePath, { force: true });
}

async function resolveExistingPaths(repoRoot, baselineRef, requestedPaths) {
  const existing = [];

  for (const requestedPath of requestedPaths) {
    const output = await gitOptionalLsTree(repoRoot, baselineRef, requestedPath);
    const lines = output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const normalizedRequested = normalizePath(requestedPath);
    const matches = lines.some((line) => {
      const normalizedLine = normalizePath(line);
      return (
        normalizedLine === normalizedRequested ||
        normalizedLine.startsWith(`${normalizedRequested}/`)
      );
    });

    if (matches) {
      existing.push(requestedPath);
    }
  }

  return existing;
}

function resolveCurrentMode(config, gitContext) {
  if (config.current?.mode) {
    return config.current.mode;
  }

  if (gitContext.compareRef !== "HEAD" || gitContext.compareCommit !== gitContext.headCommit) {
    return "snapshot";
  }

  return "worktree";
}

function canFallbackCurrentSnapshotToWorktree(error, gitContext) {
  return (
    isMissingPathspecError(error) &&
    gitContext.compareCommit === gitContext.headCommit
  );
}

async function mirrorDependencies(repoRoot, snapshotRoot) {
  await maybeLink(repoRoot, snapshotRoot, "node_modules");
}

async function maybeLink(repoRoot, snapshotRoot, relativePath) {
  const source = path.join(repoRoot, relativePath);
  const target = path.join(snapshotRoot, relativePath);

  try {
    const stats = await lstat(source);
    if (!stats.isDirectory() && !stats.isSymbolicLink()) {
      return;
    }
  } catch {
    return;
  }

  await mkdir(path.dirname(target), { recursive: true });

  try {
    await symlink(source, target);
  } catch {
    // Best-effort link only.
  }
}

function takeSnippet(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 1200);
}

async function gitOptionalLsTree(repoRoot, baselineRef, requestedPath) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["ls-tree", "-r", "--name-only", baselineRef, "--", requestedPath],
      {
        cwd: repoRoot,
        encoding: "utf8",
        maxBuffer: 1024 * 1024 * 10,
      },
    );
    return stdout.trim();
  } catch {
    return "";
  }
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

module.exports = {
  executeVerificationFlow,
};

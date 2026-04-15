const fs = require("fs/promises");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(projectRoot, "..");

const DOC_FILES = [
  "REGRESSPROOF_INDEX.md",
  "REGRESSPROOF_PRODUCT_BRIEF.md",
  "REGRESSPROOF_SPEC.md",
  "REGRESSPROOF_IMPLEMENTATION_PLAN.md",
  "REGRESSPROOF_MVP_TASK_BREAKDOWN.md",
  "REGRESSPROOF_VALIDATION_PLAN.md",
  "REGRESSPROOF_DECISION_LOG.md",
  "REGRESSPROOF_WORKFLOW_MEMORY.md",
  "REGRESSPROOF_PROTOTYPE_WALKTHROUGH.md",
  "REGRESSPROOF_SESSION_TEMPLATE.md",
];

const ROOT_FILES = [
  ".gitignore",
  "AGENTS.md",
  "README.md",
  "package.json",
  "tsconfig.json",
  "regressproof.config.json",
  "regressproof.demo.config.json",
  "regressproof.real-repo.config.json",
  "regressproof.workspace-repo.config.json",
];

const ROOT_DIRS = ["src", "scripts", "fixtures"];

function parseArgs(argv) {
  const args = { outDir: null };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--out-dir") {
      args.outDir = argv[index + 1];
      index += 1;
    }
  }

  return args;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyFileIfPresent(sourcePath, targetPath) {
  try {
    await fs.access(sourcePath);
  } catch {
    return false;
  }

  await ensureDir(path.dirname(targetPath));
  await fs.copyFile(sourcePath, targetPath);
  return true;
}

async function copyDirIfPresent(sourcePath, targetPath) {
  try {
    await fs.access(sourcePath);
  } catch {
    return false;
  }

  await fs.rm(targetPath, { recursive: true, force: true });
  await ensureDir(targetPath);

  const entries = await fs.readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".git") {
      continue;
    }

    const sourceEntryPath = path.join(sourcePath, entry.name);
    const targetEntryPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      await copyDirIfPresent(sourceEntryPath, targetEntryPath);
      continue;
    }

    if (entry.isFile()) {
      await ensureDir(path.dirname(targetEntryPath));
      await fs.copyFile(sourceEntryPath, targetEntryPath);
    }
  }

  return true;
}

async function writeExportManifest(outDir, copiedFiles, copiedDirs) {
  const lines = [
    "# RegressProof Standalone Export",
    "",
    `Exported from: ${workspaceRoot}`,
    `Source subproject: ${projectRoot}`,
    "",
    "## Included root files",
    ...copiedFiles.map((filePath) => `- ${filePath}`),
    "",
    "## Included directories",
    ...copiedDirs.map((dirPath) => `- ${dirPath}`),
    "",
    "## Notes",
    "- This export is intended to be the closest standalone repository shape for RegressProof.",
    "- Build artifacts are intentionally excluded; run `npm run build` after installing dependencies.",
    "- Canonical RegressProof docs are copied into `docs/` from the parent workspace.",
  ];

  await fs.writeFile(
    path.join(outDir, "STANDALONE_EXPORT.md"),
    `${lines.join("\n")}\n`,
    "utf8"
  );
}

async function main() {
  const { outDir } = parseArgs(process.argv.slice(2));
  const targetDir = path.resolve(
    process.cwd(),
    outDir || "../regressproof-standalone-export"
  );

  await fs.rm(targetDir, { recursive: true, force: true });
  await ensureDir(targetDir);

  const copiedFiles = [];
  const copiedDirs = [];

  for (const fileName of ROOT_FILES) {
    const copied = await copyFileIfPresent(
      path.join(projectRoot, fileName),
      path.join(targetDir, fileName)
    );

    if (copied) {
      copiedFiles.push(fileName);
    }
  }

  for (const dirName of ROOT_DIRS) {
    const copied = await copyDirIfPresent(
      path.join(projectRoot, dirName),
      path.join(targetDir, dirName)
    );

    if (copied) {
      copiedDirs.push(dirName);
    }
  }

  const docsTargetDir = path.join(targetDir, "docs");
  await ensureDir(docsTargetDir);

  for (const docName of DOC_FILES) {
    const copied = await copyFileIfPresent(
      path.join(workspaceRoot, "docs", docName),
      path.join(docsTargetDir, docName)
    );

    if (copied) {
      copiedFiles.push(`docs/${docName}`);
    }
  }

  const sessionsReadmeCopied = await copyFileIfPresent(
    path.join(workspaceRoot, "docs", "sessions", "README.md"),
    path.join(docsTargetDir, "sessions", "README.md")
  );

  if (sessionsReadmeCopied) {
    copiedFiles.push("docs/sessions/README.md");
  }

  await writeExportManifest(targetDir, copiedFiles, copiedDirs);

  console.log(`Standalone export written to ${targetDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

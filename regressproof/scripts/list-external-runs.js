#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const regressproofRoot = path.resolve(__dirname, "..");
const defaultCatalogPath = path.join(regressproofRoot, "examples", "external-runs.json");
const knownVerdicts = new Set([
  "confirmed_agent_fault",
  "possible_agent_fault",
  "preexisting_failure",
  "environment_failure",
  "insufficient_evidence",
  "successful_change",
  "verification_pending",
]);
const knownConfidences = new Set(["low", "medium", "high"]);
const isoLikeTimestampPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

function main() {
  const args = process.argv.slice(2);
  const catalogPath = path.resolve(readArg(args, "--catalog") || defaultCatalogPath);
  const format = readArg(args, "--format") || "text";
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  validateCatalog(catalog);

  if (format === "json") {
    process.stdout.write(`${JSON.stringify(summarizeCatalog(catalog), null, 2)}\n`);
    return;
  }

  process.stdout.write(renderText(catalog));
}

function summarizeCatalog(catalog) {
  const verdictCounts = {};
  const repos = new Set();
  for (const run of catalog.runs) {
    repos.add(run.repo);
    verdictCounts[run.verdict] = (verdictCounts[run.verdict] || 0) + 1;
  }

  return {
    schemaVersion: catalog.schemaVersion,
    runCount: catalog.runs.length,
    repoCount: repos.size,
    verdictCounts,
    runs: catalog.runs,
  };
}

function renderText(catalog) {
  const summary = summarizeCatalog(catalog);
  const lines = [
    "RegressProof External Validation Runs",
    `Runs: ${summary.runCount}`,
    `Repositories: ${summary.repoCount}`,
    `Verdicts: ${Object.entries(summary.verdictCounts).map(([name, count]) => `${name}=${count}`).join(", ")}`,
    "",
  ];

  for (const run of catalog.runs) {
    lines.push(
      `- ${run.id}`,
      `  repo: ${run.repo}`,
      `  range: ${shortSha(run.baselineCommit)}..${shortSha(run.headCommit)}`,
      `  verdict: ${run.verdict} / ${run.confidence}`,
      `  files: ${run.changedFiles.length}`,
      `  artifact: ${run.artifactPath}`,
      `  notes: ${run.notes}`,
    );
  }

  return `${lines.join("\n")}\n`;
}

function validateCatalog(catalog) {
  if (!catalog || !Array.isArray(catalog.runs)) {
    throw new Error("External runs catalog must contain a runs array.");
  }

  const ids = new Set();
  for (const run of catalog.runs) {
    for (const field of [
      "id",
      "repo",
      "url",
      "category",
      "configPath",
      "validatedAt",
      "baselineCommit",
      "headCommit",
      "diffRange",
      "headRef",
      "verdict",
      "confidence",
      "artifactPath",
      "notes",
    ]) {
      if (!run[field] || typeof run[field] !== "string") {
        throw new Error(`External run is missing string field: ${field}`);
      }
    }
    if (ids.has(run.id)) {
      throw new Error(`Duplicate external run id: ${run.id}`);
    }
    ids.add(run.id);
    if (!knownVerdicts.has(run.verdict)) {
      throw new Error(`External run ${run.id} has unknown verdict: ${run.verdict}`);
    }
    if (!knownConfidences.has(run.confidence)) {
      throw new Error(`External run ${run.id} has unknown confidence: ${run.confidence}`);
    }
    if (!isValidIsoLikeTimestamp(run.validatedAt)) {
      throw new Error(`External run ${run.id} has invalid validatedAt timestamp: ${run.validatedAt}`);
    }
    if (!Array.isArray(run.changedFiles) || run.changedFiles.length === 0) {
      throw new Error(`External run ${run.id} must contain a non-empty changedFiles array.`);
    }
    for (const [index, changedFile] of run.changedFiles.entries()) {
      if (!changedFile || typeof changedFile !== "string" || changedFile.trim() !== changedFile) {
        throw new Error(`External run ${run.id} has invalid changedFiles[${index}].`);
      }
    }
    if (run.headRef === "HEAD" && run.category !== "public-runner-smoke") {
      throw new Error(
        `External run ${run.id} uses floating headRef=HEAD outside public-runner-smoke.`,
      );
    }
  }
}

function isValidIsoLikeTimestamp(value) {
  if (typeof value !== "string" || !isoLikeTimestampPattern.test(value)) {
    return false;
  }
  return Number.isFinite(Date.parse(value));
}

function shortSha(value) {
  return String(value || "").slice(0, 7);
}

function readArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return "";
  }
  return args[index + 1] || "";
}

main();

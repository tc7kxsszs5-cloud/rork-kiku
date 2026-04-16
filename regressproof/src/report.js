function renderReport(report, format) {
  if (format === "json") {
    return JSON.stringify(report, null, 2);
  }

  const verdictLabel = getVerdictLabel(report.verdict.classification);
  const changedFiles =
    report.git.changedFiles.length > 0
      ? report.git.changedFiles.map((file) => `  - ${file}`).join("\n")
      : "  - none detected";

  const quickChecks = report.checks.quick.map((check) => `  - ${check}`).join("\n");
  const fullChecks = report.checks.full.map((check) => `  - ${check}`).join("\n");
  const baselineResults = report.verification.baseline
    .map(
      (item) =>
        `  - [${item.status}] ${item.command} (${item.durationMs}ms, exit=${item.exitCode})`,
    )
    .join("\n");
  const currentResults = report.verification.current
    .map(
      (item) =>
        `  - [${item.status}] ${item.command} (${item.durationMs}ms, exit=${item.exitCode})`,
    )
    .join("\n");
  const preexistingFailures = formatFailureList(report.failureSummary.preexistingFailures);
  const introducedFailures = formatFailureList(report.failureSummary.introducedFailures);
  const unchangedFailures = formatFailureList(report.failureSummary.unchangedFailures);
  const fixedFailures = formatFailureList(report.failureSummary.fixedFailures);

  return [
    "RegressProof",
    `Project: ${report.projectName}`,
    `Timestamp: ${report.timestamp}`,
    `Status: ${report.status}`,
    `Verdict: ${verdictLabel} [${report.verdict.classification}] (${report.verdict.confidence})`,
    `Usage Mode: ${report.usage.mode}`,
    `Estimated Cost USD: ${report.usage.estimatedCostUsd}`,
    `Internal Credit USD: ${report.creditLedger.internalCreditUsd}`,
    `Evidence: ${report.verdict.summary}`,
    `Changed File Match: ${report.verdict.changedFileEvidence ? "yes" : "no"}`,
    `Proof Signals: changedFiles=${report.proofSignals.changedFilesCount}, targetPaths=${report.proofSignals.targetPathCount}, committedDiff=${report.proofSignals.hasCommittedDiff ? "yes" : "no"}, pathBaseline=${report.proofSignals.usesPathScopedBaseline ? "yes" : "no"}, snapshotCurrent=${report.proofSignals.usesSnapshotCurrent ? "yes" : "no"}`,
    `Failure Counts: introduced=${report.failureSummary.metrics.introducedCount}, preexisting=${report.failureSummary.metrics.preexistingCount}, unchanged=${report.failureSummary.metrics.unchangedCount}, fixed=${report.failureSummary.metrics.fixedCount}`,
    "",
    "Git Context:",
    `  - repoRoot: ${report.git.repoRoot}`,
    `  - branch: ${report.git.currentBranch}`,
    `  - headCommit: ${report.git.headCommit}`,
    `  - baselineRef: ${report.git.baselineRef}`,
    `  - baselineCommit: ${report.git.baselineCommit}`,
    `  - compareRef: ${report.git.compareRef}`,
    `  - compareCommit: ${report.git.compareCommit}`,
    `  - diffRange: ${report.git.diffRange}`,
    `  - currentMode: ${report.verification.currentMode}`,
    "  - changedFiles:",
    changedFiles,
    "",
    "Quick Checks:",
    quickChecks,
    "",
    "Full Checks:",
    fullChecks,
    "",
    "Baseline Quick Results:",
    baselineResults,
    "",
    "Current Quick Results:",
    currentResults,
    "",
    "Preexisting Failures:",
    preexistingFailures,
    "",
    "Introduced Failures:",
    introducedFailures,
    "",
    "Unchanged Failures:",
    unchangedFailures,
    "",
    "Fixed Failures:",
    fixedFailures,
    "",
    `Next Step: ${report.nextStep}`,
  ].join("\n");
}

function formatFailureList(items) {
  if (!items || items.length === 0) {
    return "  - none";
  }

  return items
    .map((item) => {
      const fileSuffix = item.filePath ? ` file=${item.filePath}` : "";
      const typeSuffix = item.checkType ? ` type=${item.checkType}` : "";
      const changedSuffix = ` changedFileMatch=${item.changedFileMatchKind || "none"}`;
      const matchedFilesSuffix =
        item.matchedChangedFiles && item.matchedChangedFiles.length > 0
          ? ` matched=${item.matchedChangedFiles.join(",")}`
          : "";
      return `  - ${item.command} [${item.status}] exit=${item.exitCode}${typeSuffix}${fileSuffix}${changedSuffix}${matchedFilesSuffix}`;
    })
    .join("\n");
}

function renderMarkdownSummary(report) {
  const verdictLabel = getVerdictLabel(report.verdict.classification);
  const changedFiles =
    report.git.changedFiles.length > 0
      ? report.git.changedFiles.map((file) => `- \`${file}\``).join("\n")
      : "- none";

  const introducedFailures = formatFailureListMarkdown(report.failureSummary.introducedFailures);
  const preexistingFailures = formatFailureListMarkdown(report.failureSummary.preexistingFailures);
  const unchangedFailures = formatFailureListMarkdown(report.failureSummary.unchangedFailures);
  const fixedFailures = formatFailureListMarkdown(report.failureSummary.fixedFailures);

  return [
    "# RegressProof Summary",
    "",
    `## ${verdictLabel}`,
    "",
    report.verdict.summary,
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| Project | \`${report.projectName}\` |`,
    `| Status | \`${report.status}\` |`,
    `| Verdict | \`${report.verdict.classification}\` |`,
    `| Confidence | \`${report.verdict.confidence}\` |`,
    `| Baseline ref | \`${report.git.baselineRef}\` |`,
    `| Compare ref | \`${report.git.compareRef}\` |`,
    `| Current mode | \`${report.verification.currentMode}\` |`,
    `| Usage mode | \`${report.usage.mode}\` |`,
    `| Estimated cost USD | \`${report.usage.estimatedCostUsd}\` |`,
    `| Credit triggered | \`${report.creditLedger.triggered ? "yes" : "no"}\` |`,
    `| Internal credit USD | \`${report.creditLedger.internalCreditUsd}\` |`,
    `| Changed file match | \`${report.verdict.changedFileEvidence ? "yes" : "no"}\` |`,
    `| Changed files in diff | \`${report.proofSignals.changedFilesCount}\` |`,
    `| Target paths | \`${report.proofSignals.targetPathCount}\` |`,
    `| Committed diff | \`${report.proofSignals.hasCommittedDiff ? "yes" : "no"}\` |`,
    `| Path-scoped baseline | \`${report.proofSignals.usesPathScopedBaseline ? "yes" : "no"}\` |`,
    `| Snapshot current | \`${report.proofSignals.usesSnapshotCurrent ? "yes" : "no"}\` |`,
    `| Introduced failures | \`${report.failureSummary.metrics.introducedCount}\` |`,
    `| Preexisting failures | \`${report.failureSummary.metrics.preexistingCount}\` |`,
    `| Unchanged failures | \`${report.failureSummary.metrics.unchangedCount}\` |`,
    `| Fixed failures | \`${report.failureSummary.metrics.fixedCount}\` |`,
    `| Changed-file matched introductions | \`${report.failureSummary.metrics.changedFileMatchedIntroducedCount}\` |`,
    "",
    "## Changed Files",
    "",
    changedFiles,
    "",
    "## Introduced Failures",
    "",
    introducedFailures,
    "",
    "## Preexisting Failures",
    "",
    preexistingFailures,
    "",
    "## Unchanged Failures",
    "",
    unchangedFailures,
    "",
    "## Fixed Failures",
    "",
    fixedFailures,
    "",
    "## Next Step",
    "",
    report.nextStep,
    "",
  ].join("\n");
}

function renderPullRequestSummary(report) {
  const verdictLabel = getVerdictLabel(report.verdict.classification);
  const introducedFailuresCount = report.failureSummary.introducedFailures.length;
  const preexistingFailuresCount = report.failureSummary.preexistingFailures.length;
  const unchangedFailuresCount = report.failureSummary.unchangedFailures.length;
  const fixedFailuresCount = report.failureSummary.fixedFailures.length;

  return [
    "## RegressProof Verdict",
    "",
    `**${verdictLabel}**`,
    "",
    `- Verdict: \`${report.verdict.classification}\``,
    `- Confidence: \`${report.verdict.confidence}\``,
    `- Changed file match: \`${report.verdict.changedFileEvidence ? "yes" : "no"}\``,
    `- Changed files in diff: \`${report.proofSignals.changedFilesCount}\``,
    `- Path-scoped baseline: \`${report.proofSignals.usesPathScopedBaseline ? "yes" : "no"}\``,
    `- Snapshot current: \`${report.proofSignals.usesSnapshotCurrent ? "yes" : "no"}\``,
    `- Diff range: \`${report.git.diffRange}\``,
    `- Current mode: \`${report.verification.currentMode}\``,
    `- Estimated cost USD: \`${report.usage.estimatedCostUsd}\``,
    `- Internal credit USD: \`${report.creditLedger.internalCreditUsd}\``,
    `- Introduced failures: \`${introducedFailuresCount}\``,
    `- Changed-file matched introductions: \`${report.failureSummary.metrics.changedFileMatchedIntroducedCount}\``,
    `- Preexisting failures: \`${preexistingFailuresCount}\``,
    `- Unchanged failures: \`${unchangedFailuresCount}\``,
    `- Fixed failures: \`${fixedFailuresCount}\``,
    "",
    report.verdict.summary,
    "",
  ].join("\n");
}

function renderPullRequestComment(report) {
  const verdictLabel = getVerdictLabel(report.verdict.classification);
  return [
    "<!-- regressproof-comment -->",
    "## RegressProof Review",
    "",
    `**${verdictLabel}**`,
    "",
    `**Verdict:** \`${report.verdict.classification}\``,
    `**Confidence:** \`${report.verdict.confidence}\``,
    `**Diff range:** \`${report.git.diffRange}\``,
    `**Current mode:** \`${report.verification.currentMode}\``,
    `**Changed files in diff:** \`${report.proofSignals.changedFilesCount}\``,
    `**Path-scoped baseline:** \`${report.proofSignals.usesPathScopedBaseline ? "yes" : "no"}\``,
    `**Snapshot current:** \`${report.proofSignals.usesSnapshotCurrent ? "yes" : "no"}\``,
    `**Estimated cost:** \`$${report.usage.estimatedCostUsd}\``,
    `**Internal credit:** \`$${report.creditLedger.internalCreditUsd}\``,
    `**Introduced failures:** \`${report.failureSummary.metrics.introducedCount}\``,
    `**Preexisting failures:** \`${report.failureSummary.metrics.preexistingCount}\``,
    `**Unchanged failures:** \`${report.failureSummary.metrics.unchangedCount}\``,
    `**Fixed failures:** \`${report.failureSummary.metrics.fixedCount}\``,
    `**Changed-file matched introductions:** \`${report.failureSummary.metrics.changedFileMatchedIntroducedCount}\``,
    "",
    report.verdict.summary,
    "",
    "### Introduced Failures",
    "",
    formatFailureListMarkdown(report.failureSummary.introducedFailures),
    "",
    "### Preexisting Failures",
    "",
    formatFailureListMarkdown(report.failureSummary.preexistingFailures),
    "",
    "### Fixed Failures",
    "",
    formatFailureListMarkdown(report.failureSummary.fixedFailures),
    "",
  ].join("\n");
}

function formatFailureListMarkdown(items) {
  return formatFailureList(items).replace(/^  - /gm, "- ");
}

function getVerdictLabel(classification) {
  switch (classification) {
    case "confirmed_agent_fault":
      return "Confirmed Agent Fault";
    case "possible_agent_fault":
      return "Possible Agent Fault";
    case "preexisting_failure":
      return "Pre-existing Failure";
    case "environment_failure":
      return "Environment Failure";
    case "insufficient_evidence":
      return "Insufficient Evidence";
    case "successful_change":
      return "Successful Change";
    case "verification_pending":
      return "Verification Pending";
    default:
      return "RegressProof Verdict";
  }
}

module.exports = {
  renderReport,
  renderMarkdownSummary,
  renderPullRequestComment,
  renderPullRequestSummary,
};

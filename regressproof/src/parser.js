function parseFailureRecords(item) {
  const rawEvidence = item.stderr || item.stdout || "";
  const checkType = inferCheckType(item.command);
  const evidenceParts = splitEvidence(rawEvidence);

  return evidenceParts.map((evidence) => {
    const filePath = extractFilePath(evidence);
    const normalizedEvidence = normalizeEvidence(evidence);

    return {
      command: item.command,
      checkType,
      status: item.status,
      exitCode: item.exitCode,
      evidence,
      normalizedEvidence,
      filePath,
      fingerprint: buildFailureFingerprint({ checkType, filePath, normalizedEvidence, status: item.status }),
      touchesChangedFile: false,
      changedFileMatchKind: "none",
      matchedChangedFiles: [],
    };
  });
}

function extractFilePath(evidence) {
  if (!evidence) {
    return "";
  }

  const patterns = [
    /((?:[A-Za-z0-9@_\-.]+\/)+[A-Za-z0-9_\-.]+\.[A-Za-z0-9_\-.]+):\d+(?::\d+)?/,
    /((?:[A-Za-z0-9_\-.]+\/)+[A-Za-z0-9_\-.]+\.[A-Za-z0-9_\-.]+)/,
    /in\s+((?:[A-Za-z0-9_\-.]+\/)+[A-Za-z0-9_\-.]+\.[A-Za-z0-9_\-.]+)/,
  ];

  for (const pattern of patterns) {
    const match = evidence.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
    if (match?.[0]) {
      return match[0];
    }
  }

  return "";
}

function inferCheckType(command) {
  const normalized = command.toLowerCase();

  if (normalized.includes("lint")) {
    return "lint";
  }

  if (normalized.includes("type")) {
    return "typecheck";
  }

  if (normalized.includes("test")) {
    return "test";
  }

  if (normalized.includes("build")) {
    return "build";
  }

  return "unknown";
}

function enrichFailureRecords(records, changedFiles) {
  return records.map((record) => ({
    ...record,
    ...resolveChangedFileMatch(record, changedFiles),
  }));
}

function splitEvidence(rawEvidence) {
  if (!rawEvidence || typeof rawEvidence !== "string") {
    return [""];
  }

  const lines = rawEvidence
    .split("\n")
    .map((line) => line.replace(/\r/g, "").trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [rawEvidence.trim()];
  }

  const grouped = [];
  let current = [];

  for (const line of lines) {
    if (current.length === 0) {
      current.push(line);
      continue;
    }

    if (startsNewEvidenceBlock(line)) {
      grouped.push(current.join("\n"));
      current = [line];
      continue;
    }

    current.push(line);
  }

  if (current.length > 0) {
    grouped.push(current.join("\n"));
  }

  return grouped;
}

function resolveChangedFileMatch(record, changedFiles) {
  if (!changedFiles || changedFiles.length === 0) {
    return {
      touchesChangedFile: false,
      changedFileMatchKind: "none",
      matchedChangedFiles: [],
    };
  }

  const normalizedRecordFile = normalizePath(record.filePath);
  const evidenceHaystack = `${record.evidence}\n${record.command}`;
  const exactMatches = changedFiles.filter((file) => {
    const normalizedChangedFile = normalizePath(file);
    return (
      normalizedRecordFile &&
      (normalizedRecordFile === normalizedChangedFile ||
        normalizedRecordFile.endsWith(`/${normalizedChangedFile}`) ||
        normalizedChangedFile.endsWith(`/${normalizedRecordFile}`))
    );
  });

  if (exactMatches.length > 0) {
    return {
      touchesChangedFile: true,
      changedFileMatchKind: "exact",
      matchedChangedFiles: exactMatches,
    };
  }

  const evidenceMatches = changedFiles.filter((file) => evidenceHaystack.includes(file));
  if (evidenceMatches.length > 0) {
    return {
      touchesChangedFile: true,
      changedFileMatchKind: "evidence",
      matchedChangedFiles: evidenceMatches,
    };
  }

  return {
    touchesChangedFile: false,
    changedFileMatchKind: "none",
    matchedChangedFiles: [],
  };
}

function buildFailureFingerprint({ checkType, filePath, normalizedEvidence, status }) {
  return [
    checkType || "unknown",
    normalizePath(filePath) || "no-file",
    normalizedEvidence || "no-evidence",
    status || "unknown",
  ].join("::");
}

function normalizeEvidence(evidence) {
  if (!evidence || typeof evidence !== "string") {
    return "";
  }

  return evidence
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/:\d+:\d+/g, ":line:col")
    .replace(/:\d+/g, ":line")
    .slice(0, 300);
}

function startsNewEvidenceBlock(line) {
  if (!line) {
    return false;
  }

  const normalized = line.toLowerCase();
  return (
    normalized.startsWith("lint failed") ||
    normalized.startsWith("typecheck failed") ||
    normalized.startsWith("test failed") ||
    normalized.startsWith("build failed") ||
    normalized.startsWith("failure:") ||
    normalized.startsWith("failed:")
  );
}

function normalizePath(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

module.exports = {
  parseFailureRecords,
  enrichFailureRecords,
  buildFailureFingerprint,
};

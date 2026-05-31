const ERROR_PATTERNS = [/error/i, /exception/i, /failed/i, /fatal/i, /traceback/i];
const WARNING_PATTERNS = [/warn/i, /timeout/i, /deprecated/i];

function countMatches(lines, patterns) {
  return lines.filter((line) => patterns.some((pattern) => pattern.test(line))).length;
}

export function summarizeLogMetadata(logs) {
  const lines = logs.split(/\r?\n/).filter(Boolean);
  const errorCount = countMatches(lines, ERROR_PATTERNS);
  const warningCount = countMatches(lines, WARNING_PATTERNS);

  let suggestedSeverity = "Low";
  if (errorCount >= 5 || /fatal|outofmemory|database down/i.test(logs)) {
    suggestedSeverity = "Critical";
  } else if (errorCount >= 2 || /payment|checkout|auth|login/i.test(logs)) {
    suggestedSeverity = "High";
  } else if (errorCount === 1 || warningCount >= 3) {
    suggestedSeverity = "Medium";
  }

  return {
    lineCount: lines.length,
    errorCount,
    warningCount,
    suggestedSeverity
  };
}

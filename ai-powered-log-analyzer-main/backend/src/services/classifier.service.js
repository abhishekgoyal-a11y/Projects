const classifyLogs = (logs) => {
  const summary = {
    totalLogs: logs.length,
    errors: 0,
    warnings: 0,
    infos: 0,
    critical: 0,
    topIssues: {},
    samples: {
      errors: [],
      warnings: [],
    },
  };

  logs.forEach((log) => {
    const lower = log.toLowerCase();

    if (lower.includes("critical") || lower.includes("fatal")) {
      summary.critical++;
    }

    if (lower.includes("error") || lower.includes("exception") || lower.includes("failed")) {
      summary.errors++;

      if (summary.samples.errors.length < 5) {
        summary.samples.errors.push(log);
      }
    }

    if (lower.includes("warn")) {
      summary.warnings++;

      if (summary.samples.warnings.length < 5) {
        summary.samples.warnings.push(log);
      }
    }

    if (lower.includes("info")) summary.infos++;

    if (lower.includes("timeout")) {
      summary.topIssues["Timeout"] = (summary.topIssues["Timeout"] || 0) + 1;
    }

    if (lower.includes("500") || lower.includes("internal server error")) {
      summary.topIssues["HTTP 500"] = (summary.topIssues["HTTP 500"] || 0) + 1;
    }

    if (lower.includes("database") || lower.includes("db")) {
      summary.topIssues["Database"] = (summary.topIssues["Database"] || 0) + 1;
    }

    if (lower.includes("auth") || lower.includes("unauthorized")) {
      summary.topIssues["Authentication"] =
        (summary.topIssues["Authentication"] || 0) + 1;
    }

    if (lower.includes("exception") || lower.includes("stack trace")) {
      summary.topIssues["Exception"] = (summary.topIssues["Exception"] || 0) + 1;
    }
  });

  summary.topIssues = Object.entries(summary.topIssues)
    .sort((first, second) => second[1] - first[1])
    .reduce((issues, [issue, count]) => {
      issues[issue] = count;
      return issues;
    }, {});

  return summary;
};

module.exports = {
  classifyLogs,
};

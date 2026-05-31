const parseLogs = (logContent) => {
  const lines = logContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines;
};

module.exports = {
  parseLogs,
};

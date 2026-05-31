export const extractErrorInfo = (
  errorMessage
) => {

  const lineMatch =
    errorMessage.match(/line (\d+)/i);

  const columnMatch =
    errorMessage.match(/column (\d+)/i);

  return {
    line: lineMatch
      ? Number(lineMatch[1])
      : 1,

    column: columnMatch
      ? Number(columnMatch[1])
      : 1,
  };
};
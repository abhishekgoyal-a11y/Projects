export const copyToClipboard =
  async (text) => {

    await navigator.clipboard.writeText(
      text
    );
  };

export const downloadFile = (
  content,
  format
) => {

  if (!content) return;

  const blob = new Blob(
    [content],
    {
      type: "text/plain",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    format === "json"
      ? "formatted-data.json"
      : "formatted-data.yaml";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
};
import yaml from "js-yaml";

export const formatData = (
  text,
  format
) => {
  if (format === "json") {
    return JSON.stringify(
      JSON.parse(text),
      null,
      2
    );
  }

  const data = yaml.load(text);

  return yaml.dump(data);
};

export const minifyData = (
  text,
  format
) => {
  if (format === "json") {
    return JSON.stringify(
      JSON.parse(text)
    );
  }

  const data = yaml.load(text);

  return yaml.dump(data, {
    indent: 0,
  });
};
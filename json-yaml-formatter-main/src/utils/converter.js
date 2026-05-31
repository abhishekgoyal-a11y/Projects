import yaml from "js-yaml";

export const convertData = (
  text,
  format
) => {
  if (format === "json") {
    const obj = JSON.parse(text);

    return yaml.dump(obj);
  }

  const obj = yaml.load(text);

  return JSON.stringify(
    obj,
    null,
    2
  );
};
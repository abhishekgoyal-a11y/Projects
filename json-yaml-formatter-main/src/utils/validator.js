import yaml from "js-yaml";

export const validateData = (
  text,
  format
) => {
  try {
    if (format === "json") {
      JSON.parse(text);
    } else {
      yaml.load(text);
    }

    return {
      valid: true,
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};
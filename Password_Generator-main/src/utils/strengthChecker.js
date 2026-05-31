export function checkStrength(entropy) {

  if (entropy < 40) {
    return {
      label: "Weak",
      className: "weak",
    };
  }

  if (entropy < 60) {
    return {
      label: "Medium",
      className: "medium",
    };
  }

  if (entropy < 80) {
    return {
      label: "Strong",
      className: "strong",
    };
  }

  return {
    label: "Very Strong",
    className: "very-strong",
  };
}
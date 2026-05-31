export function validateOptions({
  uppercase,
  lowercase,
  numbers,
  symbols,
}) {

  if (
    !uppercase &&
    !lowercase &&
    !numbers &&
    !symbols
  ) {

    return {
      valid: false,
      message:
        "Select at least one character type.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}
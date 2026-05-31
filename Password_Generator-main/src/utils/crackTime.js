export function estimateCrackTime(
  entropy
) {

  if (entropy < 28) {
    return "Can be cracked instantly";
  }

  if (entropy < 36) {
    return "Could be cracked in minutes";
  }

  if (entropy < 60) {
    return "Could take years to crack";
  }

  if (entropy < 80) {
    return "Would take thousands of years";
  }

  if (entropy < 100) {
    return "Would take millions of years";
  }

  return "Practically uncrackable";
}
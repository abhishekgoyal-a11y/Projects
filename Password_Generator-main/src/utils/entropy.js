import {
  UPPERCASE,
  LOWERCASE,
  NUMBERS,
  SYMBOLS,
} from "./charset";

export function calculateEntropy({
  length,
  uppercase,
  lowercase,
  numbers,
  symbols,
}) {

  let poolSize = 0;

  if (uppercase) {
    poolSize += UPPERCASE.length;
  }

  if (lowercase) {
    poolSize += LOWERCASE.length;
  }

  if (numbers) {
    poolSize += NUMBERS.length;
  }

  if (symbols) {
    poolSize += SYMBOLS.length;
  }

  if (poolSize === 0) {
    return 0;
  }

  const entropy =
    length * Math.log2(poolSize);

  return Math.round(entropy);
}
import { words } from "../data/wordlist";

export function generatePassphrase(
  options
) {

  const {
    wordCount,
    separator,
    capitalize,
    includeNumber,
  } = options;

  let selectedWords = [];

  for (
    let i = 0;
    i < wordCount;
    i++
  ) {

    const randomIndex =
      Math.floor(
        Math.random() *
        words.length
      );

    let word =
      words[randomIndex];

    // CAPITALIZE
    if (capitalize) {

      word =
        word.charAt(0)
          .toUpperCase() +
        word.slice(1);
    }

    selectedWords.push(word);
  }

  let passphrase =
    selectedWords.join(separator);

  // RANDOM NUMBER
  if (includeNumber) {

    const randomNumber =
      Math.floor(
        1000 +
        Math.random() * 9000
      );

    passphrase +=
      separator +
      randomNumber;
  }

  return passphrase;
}
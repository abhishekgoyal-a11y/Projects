import {

  UPPERCASE,
  LOWERCASE,
  NUMBERS,
  SYMBOLS,

  SAFE_UPPERCASE,
  SAFE_LOWERCASE,
  SAFE_NUMBERS,

} from "./charset";

/* SECURE RANDOM */

function getSecureRandom(max) {

  const array =
    new Uint32Array(1);

  crypto.getRandomValues(array);

  return array[0] % max;
}

/* SHUFFLE */

function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j =
      getSecureRandom(i + 1);

    [
      array[i],
      array[j],
    ] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

export function generatePassword({

  length,

  uppercase,
  lowercase,
  numbers,
  symbols,

  avoidAmbiguous,

}) {

  let charset = "";

  let guaranteedChars = [];

  /* SAFE CHARSETS */

  const upperCharset =

    avoidAmbiguous
      ? SAFE_UPPERCASE
      : UPPERCASE;

  const lowerCharset =

    avoidAmbiguous
      ? SAFE_LOWERCASE
      : LOWERCASE;

  const numberCharset =

    avoidAmbiguous
      ? SAFE_NUMBERS
      : NUMBERS;

  /* BUILD CHARSET */

  if (uppercase) {

    charset += upperCharset;

    guaranteedChars.push(

      upperCharset[
        getSecureRandom(
          upperCharset.length
        )
      ]
    );
  }

  if (lowercase) {

    charset += lowerCharset;

    guaranteedChars.push(

      lowerCharset[
        getSecureRandom(
          lowerCharset.length
        )
      ]
    );
  }

  if (numbers) {

    charset += numberCharset;

    guaranteedChars.push(

      numberCharset[
        getSecureRandom(
          numberCharset.length
        )
      ]
    );
  }

  if (symbols) {

    charset += SYMBOLS;

    guaranteedChars.push(

      SYMBOLS[
        getSecureRandom(
          SYMBOLS.length
        )
      ]
    );
  }

  /* INVALID */

  if (!charset) {

    return "";
  }

  let password = [
    ...guaranteedChars
  ];

  /* GENERATE REMAINING */

  while (
    password.length < length
  ) {

    const randomChar =

      charset[
        getSecureRandom(
          charset.length
        )
      ];

    const lastChar =

      password[
        password.length - 1
      ];

    /* PREVENT REPEATS */

    if (
      randomChar === lastChar
    ) {

      continue;
    }

    /* PREVENT SEQUENTIAL */

    if (lastChar) {

      const lastCode =
        lastChar.charCodeAt(0);

      const currentCode =
        randomChar.charCodeAt(0);

      /* FORWARD */

      if (
        currentCode ===
        lastCode + 1
      ) {

        continue;
      }

      /* BACKWARD */

      if (
        currentCode ===
        lastCode - 1
      ) {

        continue;
      }
    }

    password.push(randomChar);
  }

  /* SHUFFLE */

  password =
    shuffleArray(password);

  return password.join("");
}
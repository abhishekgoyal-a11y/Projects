import { askGroq } from './groqService'

export const generateTheme = async (
  themeName
) => {

  const prompt = `
Return EXACTLY 8 emojis for:

${themeName}

ONLY emojis.
No text.
Space separated.
`

  const response =
    await askGroq(prompt)

  console.log(
    'RAW AI RESPONSE:',
    response
  )

  const emojis =
    response.match(
      /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu
    )

  console.log(
    'EXTRACTED EMOJIS:',
    emojis
  )

  if (!emojis) {
    return []
  }

  return emojis.slice(0, 8)
}
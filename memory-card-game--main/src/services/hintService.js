import { askGroq } from './groqService'

export const generateHint = async (
  moves,
  matches,
  difficulty
) => {

  const prompt = `
  You are an AI memory game assistant.

  Player stats:
  Moves: ${moves}
  Matches: ${matches}
  Difficulty: ${difficulty}

  Give ONE short helpful memory tip.
  `

  return await askGroq(prompt)
}
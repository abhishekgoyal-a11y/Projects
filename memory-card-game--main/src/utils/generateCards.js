import { shuffleArray } from './shuffle'

export const generateCards = (
  themeIcons,
  pairCount
) => {

  const selectedIcons =
    themeIcons.slice(0, pairCount)

  const duplicatedCards = [
    ...selectedIcons,
    ...selectedIcons
  ]

  const cards = duplicatedCards.map(
    (icon, index) => ({
      id: index,
      icon,
      flipped: false,
      matched: false
    })
  )

  return shuffleArray(cards)
}
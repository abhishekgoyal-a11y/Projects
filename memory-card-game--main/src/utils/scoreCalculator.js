export const calculateScore = (matches, moves, time) => {
  return (matches * 100) - (moves * 2) - time
}
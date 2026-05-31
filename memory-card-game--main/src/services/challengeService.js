export const getDailyChallenge = () => {

  const challenges = [

    'Win within 20 moves',

    'Complete game under 60 seconds',

    'Finish without mistakes',

    'Match 5 pairs in a row',

    'Play hard mode only'
  ]

  const day =
    new Date().getDate()

  return challenges[
    day % challenges.length
  ]
}
import { CIRCLE, CROSS, EMPTY } from "@/lib/constants/content.js"
import { WINNER_DETECTION_PATHS } from "@/lib/constants/gameLogic.js"
import { InvalidUserError } from "@/lib/errors/InvalidUserError";


function findWinner(matrix, position = undefined) {
  for (const positions of WINNER_DETECTION_PATHS) {
    for (const path of positions) {
      if (!path.includes(position)) {
        continue
      }
      const symbols = new Set(path.map(where => matrix[where]))
      console.debug(JSON.stringify(path))
      console.debug(symbols)
      if (symbols.size === 1 && !symbols.has(EMPTY)) {
        return symbols.keys().next().value
      }
    }
  }
  return EMPTY
}


function otherPlayer(currentActivePlayer) {
  switch (currentActivePlayer) {
    case CIRCLE:
      return CROSS
    case CROSS:
      return CIRCLE
    default:
      throw new InvalidUserError(currentActivePlayer)
  }
}


export { findWinner, otherPlayer }
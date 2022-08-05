import {
  EMPTY,
  POSITIONS_BY_COL,
  POSITIONS_BY_ROW,
  DIAGONALS, CIRCLE, CROSS
} from "@/lib/constants.js"

import { InvalidUserError } from "@/lib/errors/InvalidUserError.js"


const WINNER_DETECTION_PATHS = [POSITIONS_BY_COL, POSITIONS_BY_ROW, DIAGONALS]


function cellContentToClass(cellContent) {
  switch (cellContent) {
    case EMPTY:
      return "empty"
    case CIRCLE:
      return "circle"
    case CROSS:
      return "cross"
    default:
      throw new InvalidUserError(cellContent)
  }
}


function findWinner(matrix, position = undefined) {
  for (let positions of WINNER_DETECTION_PATHS) {
    for (let path of positions) {
      if (position && !path.includes(position)) {
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


function swapActivePlayer(currentActivePlayer) {
  switch (currentActivePlayer) {
    case CIRCLE:
      return CROSS
    case CROSS:
      return CIRCLE
    default:
      throw new InvalidUserError(currentActivePlayer)
  }
}


export { cellContentToClass, findWinner, swapActivePlayer }

import {
  EMPTY,
  POSITIONS_BY_COL,
  POSITIONS_BY_ROW,
  DIAGONALS, CIRCLE, CROSS
} from "@/constants.js"


function cellContentToClass(cellContent) {
  switch (cellContent) {
    case EMPTY:
      return "empty"
    case CIRCLE:
      return "circle"
    case CROSS:
      return "cross"
    default:
      throw new ReferenceError(cellContent.value)
  }
}


function findWinner(matrix, position = null) {
  for (let positions of [POSITIONS_BY_COL, POSITIONS_BY_ROW, DIAGONALS]) {
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


function singleBoardWinner(gameStore, singleBoardPosition, cellPosition = null) {
  console.debug(JSON.stringify({cellPosition, cells: gameStore.cells[singleBoardPosition]}))
  return findWinner(gameStore.cells[singleBoardPosition], cellPosition)
}


function tt9BoardsWinner(gameStore, singleBoardPosition = null) {
  console.debug(JSON.stringify({singleBoardPosition, boards: gameStore.wonBoards}))
  return findWinner(gameStore.wonBoards, singleBoardPosition)
}


export { cellContentToClass, singleBoardWinner, tt9BoardsWinner, findWinner }

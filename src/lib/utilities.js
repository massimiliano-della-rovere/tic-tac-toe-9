import { CIRCLE, CROSS, EMPTY } from "@/lib/constants/content.js"

import { InvalidUserError } from "@/lib/errors/InvalidUserError.js"


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


const takeEmpty = (iterable, container) => iterable.filter(
    item => container[item] === EMPTY)


export { cellContentToClass, takeEmpty }

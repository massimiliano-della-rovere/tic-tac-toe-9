const POSITIONS = {
  o:  [ 0,  0],
  e:  [+1,  0],
  n:  [ 0, +1],
  ne: [+1, +1],
  nw: [-1, +1],
  s:  [ 0, -1],
  se: [+1, -1],
  sw: [-1, -1],
  w:  [-1,  0]}
const POSITIONS_BY_ROW = [["nw", "n", "ne"], ["w", "o", "e"], ["sw", "s", "se"]]
const POSITIONS_BY_COL = [["nw", "w", "sw"], ["n", "o", "s"], ["ne", "e", "se"]]
const DIAGONALS = [["nw", "o", "se"], ["ne", "o", "sw"]]
const CORNERS = ["ne", "nw", "se", "sw"]
const SIDES = ["n", "e", "w", "s"]
const OPPOSITE_CORNER = {
  sw: "ne",
  se: "nw",
  nw: "se",
  ne: "sw"
}

export {
  POSITIONS,
  POSITIONS_BY_COL, POSITIONS_BY_ROW, DIAGONALS,
  CORNERS, SIDES, OPPOSITE_CORNER
}
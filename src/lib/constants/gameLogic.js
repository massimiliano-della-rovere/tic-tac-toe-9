import { CIRCLE, CROSS, EMPTY } from "@/lib/constants/content.js"
import { DIAGONALS, POSITIONS_BY_COL, POSITIONS_BY_ROW } from "@/lib/constants/position.js"


const WINNER_DETECTION_PATHS = [POSITIONS_BY_COL, POSITIONS_BY_ROW, DIAGONALS]
const FORK_DETECTION_PATHS = [
  {controlled: ["nw", "se"], tests: ["ne", "sw"]},
  {controlled: ["ne", "sw"], tests: ["nw", "se"]},
  {controlled: ["e", "n"], tests: ["o"]},
  {controlled: ["w", "n"], tests: ["o"]},
  {controlled: ["e", "s"], tests: ["o"]},
  {controlled: ["w", "s"], tests: ["o"]},
]

const SYMBOL_TO_SIGN = {
  [CIRCLE]: +1,
  [CROSS]: -1
}
const ACTION_RATINGS = {
  "win": 100,
  "block_win": 90,
  "fork": 80,
  "block_fork": 70,
  "center_1st_move": 50,
  "center_generic_move": 45,
  "corner": 40,
  "opposite_corner": 30,
  "side": 10
}
const SITUATION_INIT = [[CIRCLE, []], [CROSS, []], [EMPTY, []]]

export {
  FORK_DETECTION_PATHS, WINNER_DETECTION_PATHS,
  ACTION_RATINGS, SITUATION_INIT, SYMBOL_TO_SIGN
}
const CIRCLE = "🞆" // https://www.compart.com/en/unicode/U+2B58
const CROSS = "🗙" // https://en.wikipedia.org/wiki/X_mark
const EMPTY = "·"
const SYMBOLS = [CIRCLE, CROSS]

const RESTART_GAME = Symbol("restartGame")
const CONTINUE_GAME = Symbol("continueGame")

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

const LIGHT_DARK_MODE_OPTIONS = {
  selector: "body",
  valueDark: "dark",
  valueLight: "light"
}

const LOCAL_PLAYERS = {
  key: "number-of-local-players",
  values: {
    onePlayer: 1,
    bothPlayers: 2
  }
}
LOCAL_PLAYERS.defaultValue = LOCAL_PLAYERS.values.bothPlayers


const REMOTE_OPPONENT_TYPE = {
  key: "non-local-opponent",
  values: {
    aiOpponent: "aiOpponent",
    remoteHumanOpponent: "remoteHumanOpponent"
  }
}
REMOTE_OPPONENT_TYPE.defaultValue = REMOTE_OPPONENT_TYPE.values.aiOpponent

export {
  CIRCLE, CROSS, EMPTY, SYMBOLS,
  POSITIONS, POSITIONS_BY_COL, POSITIONS_BY_ROW, DIAGONALS,
  CONTINUE_GAME, RESTART_GAME,
  LIGHT_DARK_MODE_OPTIONS,
  LOCAL_PLAYERS, REMOTE_OPPONENT_TYPE
}

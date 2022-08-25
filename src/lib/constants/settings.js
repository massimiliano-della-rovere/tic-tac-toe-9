const LIGHT_DARK_MODE_OPTIONS = {
  selector: "body",
  valueDark: "dark",
  valueLight: "light"
}

const NUMBER_OF_LOCAL_PLAYERS = {
  key: "number-of-local-players",
  values: {
    onePlayer: 1,
    bothPlayers: 2
  }
}
NUMBER_OF_LOCAL_PLAYERS.defaultValue = NUMBER_OF_LOCAL_PLAYERS.values.bothPlayers


const AI_DEPTH = {
  key: "ai-depth",
  defaultValue: 12
}
const OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER = {
  key: "opponent-type-for-one-local-player",
  values: {
    aiOpponent: "aiOpponent",
    remoteHumanOpponent: "remoteHumanOpponent"
  }
}
OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.defaultValue = OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER.values.aiOpponent

export {
  LIGHT_DARK_MODE_OPTIONS,
  AI_DEPTH, NUMBER_OF_LOCAL_PLAYERS, OPPONENT_TYPE_FOR_ONE_LOCAL_PLAYER
}
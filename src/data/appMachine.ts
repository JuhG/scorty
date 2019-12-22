import { Plugins } from '@capacitor/core'
import { assign, Machine } from 'xstate'
import { Game, GameSchema } from './Game'
import { Play, PlaySchema } from './Play'
import { Player, PlayerSchema } from './Player'

const { Storage } = Plugins

export interface AppStateSchema {
  states: {
    loading: {}
    idle: {}
    open_game: {}
  }
}

export interface AppContext {
  history: Array<PlaySchema>
  games: Array<GameSchema>
  players: Array<PlayerSchema>
}

interface LoadedEvent {
  type: 'LOADED'
  data: AppContext
}

interface MakeGameEvent {
  type: 'MAKE_GAME'
  data: GameSchema
}

interface AddGameEvent {
  type: 'ADD_GAME'
  data: GameSchema
}

interface MakePlayerEvent {
  type: 'MAKE_PLAYER'
  data: PlayerSchema
}

interface AddPlayerEvent {
  type: 'ADD_PLAYER'
  data: {
    playId: number
    id: number
    name: string
  }
}

interface AddScoreEvent {
  type: 'ADD_SCORE'
  data: {
    playId: number
    playerId: number
    score: number
  }
}

interface DeletePlayEvent {
  type: 'DELETE_PLAY'
  data: {
    playId: number
  }
}

interface DeleteGameEvent {
  type: 'DELETE_GAME'
  data: {
    gameId: number
  }
}

interface DeletePlayerEvent {
  type: 'DELETE_PLAYER'
  data: {
    playerId: number
  }
}

export type AppEvent =
  | LoadedEvent
  | { type: 'FAILED' }
  | { type: 'RESET' }
  | AddGameEvent
  | { type: 'RESTART' }
  | AddPlayerEvent
  | AddScoreEvent
  | DeletePlayEvent
  | DeleteGameEvent
  | DeletePlayerEvent
  | MakePlayerEvent
  | MakeGameEvent

const addGame = (ctx: AppContext, { data }: AddGameEvent) => {
  ctx = Game.make(ctx, data)
  const game = Game.find(ctx, data.id)

  ctx = Play.make(ctx, {
    id: -1,
    date: Date.now(),
    gameId: game.id,
    players: [],
  })

  return ctx
}

const makeGame = (ctx: AppContext, { data }: MakeGameEvent) => {
  ctx = Game.make(ctx, data)

  return ctx
}

const addPlayer = (ctx: AppContext, { data }: AddPlayerEvent) => {
  const { playId, ...playerData } = data

  ctx = Player.make(ctx, playerData)
  const player = Player.find(ctx, playerData.id)

  ctx = Play.makePlayer(ctx, {
    playId,
    data: { id: -1, playerId: player.id, color: '', blocks: [] },
  })

  ctx = Play.addBlock(ctx, {
    playId,
    playerId: player.id,
  })

  return ctx
}

const makePlayer = (ctx: AppContext, { data }: MakePlayerEvent) => {
  ctx = Player.make(ctx, data)

  return ctx
}

const addScore = (ctx: AppContext, { data }: AddScoreEvent) => {
  ctx = Play.makeScore(ctx, data)

  return ctx
}

const deletePlay = (ctx: AppContext, { data }: DeletePlayEvent) => {
  ctx = Play.delete(ctx, data.playId)

  return ctx
}

const deleteGame = (ctx: AppContext, { data }: DeleteGameEvent) => {
  ctx = Game.delete(ctx, data.gameId)

  return ctx
}

const deletePlayer = (ctx: AppContext, { data }: DeletePlayerEvent) => {
  ctx = Player.delete(ctx, data.playerId)

  return ctx
}

export const appMachine = Machine<AppContext, AppStateSchema, AppEvent>({
  id: 'game',
  initial: 'loading',
  context: {
    history: [],
    games: [],
    players: [],
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: 'idle',
          actions: assign((_, { data }: LoadedEvent) => data),
        },
        FAILED: 'idle',
      },
    },
    idle: {
      on: {
        ADD_GAME: {
          target: 'open_game',
          actions: assign(addGame),
        },
        RESET: {
          actions: assign(ctx => {
            const newState = {
              history: [],
              games: ctx.games,
              players: ctx.players,
            }

            Storage.set({
              key: 'DD_STATE',
              value: JSON.stringify(newState),
            })

            return newState
          }),
        },
        DELETE_PLAY: {
          actions: assign(deletePlay),
        },
        DELETE_GAME: {
          actions: assign(deleteGame),
        },
        ADD_PLAYER: {
          actions: assign(addPlayer),
        },
        ADD_SCORE: {
          actions: assign(addScore),
        },
        DELETE_PLAYER: {
          actions: assign(deletePlayer),
        },
        MAKE_PLAYER: {
          actions: assign(makePlayer),
        },
        MAKE_GAME: {
          actions: assign(makeGame),
        },
      },
    },
    open_game: {
      on: {
        RESTART: 'idle',
      },
    },
  },
})

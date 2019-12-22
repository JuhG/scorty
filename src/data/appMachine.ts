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

interface AddGameEvent {
  type: 'ADD_GAME'
  data: GameSchema
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

interface DeleteGameEvent {
  type: 'DELETE_GAME'
  gameId: number
}

export type AppEvent =
  | { type: 'LOADED'; data: AppContext }
  | { type: 'FAILED' }
  | { type: 'RESET' }
  | AddGameEvent
  | DeleteGameEvent
  | { type: 'RESTART' }
  | AddPlayerEvent
  | AddScoreEvent

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

const addScore = (ctx: AppContext, { data }: AddScoreEvent) => {
  ctx = Play.makeScore(ctx, data)

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
          actions: assign((_, { data }) => data),
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
        DELETE_GAME: {
          actions: assign((ctx: AppContext, { gameId }: DeleteGameEvent) => {
            const newState = {
              history: ctx.history.filter(g => g.id !== gameId),
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
        ADD_PLAYER: {
          actions: assign(addPlayer),
        },
        ADD_SCORE: {
          actions: assign(addScore),
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

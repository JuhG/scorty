import { Plugins } from '@capacitor/core'
import { assign, Machine } from 'xstate'

const { Storage } = Plugins

const addGame = (context: AppContext, { data }: AddGameEvent) => {
  let game = null

  if (data.game === -1) {
    game = {
      id: context.games.length
        ? context.games[context.games.length - 1].id + 1
        : 0,
      name: data.name,
    }

    context.games = [...context.games, game]
  } else {
    game = context.games.find(game => game.id === data.game)
  }

  if (!game) return

  context.history = [
    ...context.history,
    {
      id: context.history.length
        ? context.history[context.history.length - 1].id + 1
        : 0,
      date: Date.now(),
      game: game.id,
    },
  ]

  Storage.set({
    key: 'DD_STATE',
    value: JSON.stringify(context),
  })

  assign({
    games: context.games,
    history: context.history,
  })
}

export interface AppStateSchema {
  states: {
    loading: {}
    idle: {}
    adding_game: {}
    open_game: {}
  }
}

interface AddGameEvent {
  type: 'GAME_ADDED'
  data: {
    game: number
    name: string
  }
}

export type AppEvent =
  | { type: 'LOADED'; data: object }
  | { type: 'FAILED' }
  | { type: 'ADD_GAME' }
  | AddGameEvent
  | { type: 'CANCEL' }

export interface AppContext {
  history: Array<{
    id: number
    date: number
    game: number
  }>
  games: Array<{
    id: number
    name: string
  }>
  players: Array<object>
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
        ADD_GAME: 'adding_game',
      },
    },
    adding_game: {
      on: {
        GAME_ADDED: {
          target: 'open_game',
          actions: addGame,
        },
        CANCEL: 'idle',
      },
    },
    open_game: {},
  },
})

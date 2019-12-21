import { Plugins } from '@capacitor/core'
import { assign, Machine } from 'xstate'

const { Storage } = Plugins

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

interface AddPlayerEvent {
  type: 'ADD_PLAYER'
  data: {
    item: number
    player: number
    name: string
  }
}

interface AddScoreEvent {
  type: 'ADD_SCORE'
  data: {
    item: number
    player: Player | null | undefined
    score: number
  }
}

interface DeleteGameEvent {
  type: 'DELETE_GAME'
  game: number
}

export type AppEvent =
  | { type: 'LOADED'; data: object }
  | { type: 'FAILED' }
  | { type: 'ADD_GAME' }
  | { type: 'RESET' }
  | DeleteGameEvent
  | AddGameEvent
  | { type: 'CANCEL' }
  | { type: 'RESTART' }
  | AddPlayerEvent
  | AddScoreEvent

export interface Player {
  id: number
  name: string
}

export interface AppContext {
  history: Array<{
    id: number
    date: number
    game: number
    scores: Array<{
      player: number
      color: string
      blocks: Array<Array<number>>
    }>
  }>
  games: Array<{
    id: number
    name: string
  }>
  players: Array<Player>
}

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
      scores: [],
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

const addPlayer = (ctx: AppContext, { data }: AddPlayerEvent) => {
  let player: Player | undefined = undefined

  if (data.player === -1) {
    player = {
      id: ctx.players.length ? ctx.players[ctx.players.length - 1].id + 1 : 0,
      name: data.name,
    }

    ctx.players = [...ctx.players, player]
  } else {
    player = ctx.players.find(player => player.id === data.player)
  }

  ctx.history = ctx.history.map(i => {
    if (i.id !== data.item) return i

    if (!player) return i

    i.scores.push({
      player: player.id,
      color: '',
      blocks: [[]],
    })

    return i
  })

  Storage.set({
    key: 'DD_STATE',
    value: JSON.stringify(ctx),
  })

  assign({
    history: ctx.history,
    players: ctx.players,
  })
}

const addScore = (ctx: AppContext, { data }: AddScoreEvent) => {
  if (!data.player) return

  ctx.history = ctx.history.map(i => {
    if (i.id !== data.item) return i

    i.scores.map(s => {
      if (!data.player) return s
      if (s.player !== data.player.id) return s

      s.blocks[s.blocks.length - 1].push(data.score)
      return s
    })

    return i
  })

  Storage.set({
    key: 'DD_STATE',
    value: JSON.stringify(ctx),
  })

  assign({
    history: ctx.history,
  })
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
        RESET: {
          target: 'idle',
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
          target: 'idle',
          actions: assign((ctx: AppContext, { game }: DeleteGameEvent) => {
            const newState = {
              history: ctx.history.filter(g => g.id !== game),
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
          target: 'idle',
          actions: addPlayer,
        },
        ADD_SCORE: {
          target: 'idle',
          actions: addScore,
        },
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
    open_game: {
      on: {
        RESTART: 'idle',
      },
    },
  },
})

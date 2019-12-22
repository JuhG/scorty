import { AppContext } from './appMachine'
import { DB } from './DB'

export interface PlayPlayerSchema {
  id: number
  playerId: number
  color: string
  blocks: Array<{
    id: number
    scores: Array<{
      id: number
      score: number
    }>
  }>
}

export interface PlaySchema {
  id: number
  date: number
  gameId: number
  players: Array<PlayPlayerSchema>
}

export class Play {
  id: number
  date: number
  gameId: number
  players: Array<PlayPlayerSchema>

  constructor(data: PlaySchema) {
    this.id = data.id
    this.date = data.date
    this.gameId = data.gameId
    this.players = data.players
  }

  static find(ctx: AppContext, id: number): Play {
    const item = ctx.history.find(item => item.id === id)
    if (item) return new Play({ ...item })

    const backup = ctx.history[ctx.history.length - 1]
    return new Play({ ...backup })
  }

  static make(ctx: AppContext, data: PlaySchema) {
    return DB.update(ctx, {
      history: DB.add(ctx.history, data),
    })
  }

  static makePlayer(
    ctx: AppContext,
    {
      playId,
      data,
    }: {
      playId: number
      data: PlayPlayerSchema
    }
  ) {
    return DB.update(ctx, {
      history: ctx.history.map(play => {
        if (play.id !== playId) return play

        const p = this.find(ctx, playId)

        return {
          ...p,
          players: DB.add(p.players, data),
        }
      }),
    })
  }

  static addBlock(
    ctx: AppContext,
    {
      playId,
      playerId,
    }: {
      playId: number
      playerId: number
    }
  ) {
    return DB.update(ctx, {
      history: ctx.history.map(play => {
        if (play.id !== playId) return play

        const players = play.players.map(player => {
          if (player.playerId !== playerId) return player

          return {
            ...player,
            blocks: DB.add(player.blocks, {
              scores: [],
            }),
          }
        })

        return {
          ...play,
          players,
        }
      }),
    })
  }

  static makeScore(
    ctx: AppContext,
    {
      playId,
      playerId,
      score,
    }: {
      playId: number
      playerId: number
      score: number
    }
  ) {
    return DB.update(ctx, {
      history: ctx.history.map(play => {
        if (play.id !== playId) return play

        const players = play.players.map(player => {
          if (player.playerId !== playerId) return player

          const blocks = player.blocks.map((block, index) => {
            if (index !== player.blocks.length - 1) return block

            return {
              ...block,
              scores: DB.add(block.scores, { score }),
            }
          })

          return {
            ...player,
            blocks,
          }
        })

        return {
          ...play,
          players,
        }
      }),
    })
  }
}

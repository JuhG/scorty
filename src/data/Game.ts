import { AppContext } from './appMachine'
import { DB } from './DB'

export interface GameSchema {
  id: number
  name: string
}

export class Game {
  id: number
  name: string

  constructor(data: GameSchema) {
    this.id = data.id
    this.name = data.name
  }

  static find(ctx: AppContext, id: number): Game {
    const game = ctx.games.find(game => game.id === id)
    if (game) return new Game({ ...game })

    const backup = ctx.games[ctx.games.length - 1]
    return new Game({ ...backup })
  }

  static make(ctx: AppContext, { id, ...data }: GameSchema) {
    if (id > -1) return ctx

    return DB.update(ctx, {
      games: DB.add(ctx.games, data),
    })
  }
}

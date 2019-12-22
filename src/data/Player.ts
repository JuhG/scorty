import { AppContext } from './appMachine'
import { DB } from './DB'

export interface PlayerSchema {
  id: number
  name: string
}

export class Player {
  id: number
  name: string

  constructor(data: PlayerSchema) {
    this.id = data.id
    this.name = data.name
  }

  static find(ctx: AppContext, id: number): Player {
    const player = ctx.players.find(player => player.id === id)
    if (player) return new Player({ ...player })

    const backup = ctx.players[ctx.players.length - 1]
    return new Player({ ...backup })
  }

  static make(ctx: AppContext, { id, ...data }: PlayerSchema) {
    if (id > -1) return ctx

    return DB.update(ctx, {
      players: DB.add(ctx.players, data),
    })
  }
}

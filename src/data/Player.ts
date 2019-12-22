import { AppContext } from './appMachine'
import { DB } from './DB'

export interface PlayerSchema {
  id: number
  name: string
  disabled?: boolean
}

export class Player {
  id: number
  name: string

  constructor(data: PlayerSchema) {
    this.id = data.id
    this.name = data.name
  }

  static all(ctx: AppContext) {
    return ctx.players.filter(p => !p.disabled)
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
      players: DB.add(ctx.players, { ...data, disabled: false }),
    })
  }

  static delete(ctx: AppContext, id: number) {
    return DB.update(ctx, {
      players: ctx.players.map(p => {
        if (p.id !== id) return p

        p.disabled = true
        return p
      }),
    })
  }
}

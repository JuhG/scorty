import { Plugins } from '@capacitor/core'
import { AppContext } from './appMachine'

const { Storage } = Plugins

const getNewIndex = (list: Array<{ id: number; [key: string]: any }>) => {
  if (!list.length) return 0

  const sortedList = list.sort(
    (a: { id: number }, b: { id: number }) => b.id - a.id
  )

  return sortedList[0].id + 1
}

export class DB {
  static add(list: Array<{ id: number }>, item: object) {
    const index = getNewIndex(list)

    return [
      ...list,
      {
        ...item,
        id: index,
      },
    ]
  }

  static update(ctx: AppContext, data: object) {
    const newState = { ...ctx, ...data }

    Storage.set({
      key: 'DD_STATE',
      value: JSON.stringify(newState),
    })

    return newState
  }
}

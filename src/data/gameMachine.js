import { Plugins } from '@capacitor/core'
import { assign, Machine } from 'xstate'

const { Storage } = Plugins

export const gameMachine = Machine({
  id: 'game',
  initial: 'loading',
  context: {
    name: '',
    game: null,
    players: [],
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: 'initial',
          actions: assign((_, event) => {
            return event.data
          }),
        },
        FAILED: 'initial',
      },
    },
    initial: {
      on: {
        '': [
          { target: 'renaming', cond: c => c.name === '' },
          { target: 'idle' },
        ],
      },
    },
    renaming: {
      on: {
        NAMED: {
          target: 'idle',
          actions: assign({
            name: (_, event) => {
              Storage.set({
                key: 'name',
                value: event.name,
              })

              return event.name
            },
          }),
        },
      },
    },
    idle: {
      on: {
        RENAME: 'renaming',
        POPULATE: 'populating',
      },
    },
    populating: {
      on: {
        POPULATED: 'idle',
        CANCEL: 'idle',
      },
    },
  },
})

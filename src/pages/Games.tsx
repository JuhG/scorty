import { useService } from '@xstate/react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Interpreter } from 'xstate'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'
import { Game } from '../data/Game'
import { List } from './List'

interface ListProps extends RouteComponentProps<{}> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

export const Games: React.FC<ListProps> = ({ appService, ...props }) => {
  const [current, send] = useService(appService)

  const data = Game.all(current.context)

  return (
    <List
      {...props}
      title="Games"
      data={data}
      onDelete={(id: number) => {
        send({
          type: 'DELETE_GAME',
          data: {
            gameId: id,
          },
        })
      }}
      onAdd={(id: number, name: string) => {
        send({
          type: 'MAKE_GAME',
          data: {
            id,
            name,
          },
        })
      }}
    />
  )
}

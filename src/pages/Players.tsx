import { useService } from '@xstate/react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Interpreter } from 'xstate'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'
import { Player } from '../data/Player'
import { List } from './List'

interface ListProps extends RouteComponentProps<{}> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

export const Players: React.FC<ListProps> = ({ appService, ...props }) => {
  const [current, send] = useService(appService)

  const data = Player.all(current.context)

  return (
    <List
      {...props}
      title="Players"
      data={data}
      onDelete={(id: number) => {
        send({
          type: 'DELETE_PLAYER',
          data: {
            playerId: id,
          },
        })
      }}
      onAdd={(id: number, name: string) => {
        send({
          type: 'MAKE_PLAYER',
          data: {
            id,
            name,
          },
        })
      }}
    />
  )
}

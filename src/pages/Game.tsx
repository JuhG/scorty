import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Interpreter } from 'xstate'

interface AppStateSchema {
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

type AppEvent =
  | { type: 'LOADED'; data: object }
  | { type: 'FAILED' }
  | { type: 'ADD_GAME' }
  | AddGameEvent
  | { type: 'CANCEL' }

interface AppContext {
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

interface GameProps
  extends RouteComponentProps<{
    id: string
  }> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Game: React.FC<GameProps> = ({ appService, match, history }) => {
  const [current] = useService(appService)

  const item = current.context.history.find(
    item => item.id === parseInt(match.params.id, 10)
  )

  if (!item) {
    history.push('/')
    return null
  }

  const game = current.context.games.find(game => game.id === item.game)

  if (!game) {
    history.push('/')
    return null
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>{game.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
      <IonFooter></IonFooter>
    </IonPage>
  )
}

export default Game

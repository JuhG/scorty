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
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'

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

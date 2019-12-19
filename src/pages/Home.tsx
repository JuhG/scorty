import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Interpreter } from 'xstate'
import AddGame from '../components/AddGame'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'

interface HomeProps extends RouteComponentProps<{}> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Home: React.FC<HomeProps> = ({ appService, history }) => {
  const [current, send] = useService(appService)
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)

  console.log(current)

  useEffect(() => {
    console.log(current)

    switch (current.value) {
      case 'adding_game':
        setIsAddGameOpen(true)
        break

      case 'idle':
        setIsAddGameOpen(false)
        break

      case 'open_game':
        setIsAddGameOpen(false)
        break

      default:
        setIsAddGameOpen(false)
        break
    }
  }, [current, history])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Board Game Counter</IonTitle>
          <IonButtons slot="primary">
            <IonButton>
              <IonIcon name="menu" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isAddGameOpen ? (
          <AddGame
            games={current.context.games}
            isOpen={isAddGameOpen}
            onDismiss={() => send('CANCEL')}
            onSuccess={(game: number, name: string) => {
              send({
                type: 'GAME_ADDED',
                data: { game, name },
              })
            }}
          />
        ) : null}

        <IonList>
          {current.context.history.map(item => {
            const game = current.context.games.find(
              game => game.id === item.game
            )
            return (
              <IonItem routerLink={`/game/${item.id}`} key={item.id}>
                <IonLabel>
                  <h2>{game ? game.name : ''}</h2>
                  <p>{new Date(item.date).toLocaleDateString()}</p>
                </IonLabel>
              </IonItem>
            )
          })}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color="secondary"
            onClick={() => {
              send('ADD_GAME')
            }}
          >
            <IonIcon class="dd-plus" name="close" />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Home

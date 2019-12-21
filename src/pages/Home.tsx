import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Interpreter } from 'xstate'
import AddGame from '../components/AddGame'
import Menu from '../components/Menu'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'

interface HomeProps extends RouteComponentProps<{}> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Home: React.FC<HomeProps> = ({ appService, history }) => {
  const [current, send] = useService(appService)
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)

  useEffect(() => {
    console.log(current)

    switch (current.value) {
      case 'adding_game':
        setIsAddGameOpen(true)
        break

      case 'open_game':
        history.push(
          `/game/${
            current.context.history[current.context.history.length - 1].id
          }`
        )
        send('RESTART')
        break

      default:
        setIsAddGameOpen(false)
        break
    }
  }, [current, history, send])

  return (
    <>
      <Menu appService={appService} />

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

      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Board Game Counter</IonTitle>

            <IonButtons slot="end">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent id="main">
          {current.context.history.length === 0 ? (
            <div className="ion-padding">
              <h4>You don't have any games yet.</h4>
              <p>Click the plus sign to start one!</p>
            </div>
          ) : (
            <IonList>
              <IonListHeader>
                <h1>Games</h1>
              </IonListHeader>

              {current.context.history.map(item => {
                const game = current.context.games.find(
                  game => game.id === item.game
                )
                return (
                  <IonItemSliding key={item.id}>
                    <IonItem routerLink={`/game/${item.id}`}>
                      <IonLabel>
                        <h2>{game ? game.name : ''}</h2>
                        <p>{new Date(item.date).toLocaleDateString()}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItemOptions side="end">
                      <IonItemOption
                        color="secondary"
                        onClick={() => {
                          send({
                            type: 'DELETE_GAME',
                            game: item.id,
                          })
                        }}
                      >
                        DELETE
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                )
              })}
            </IonList>
          )}

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
    </>
  )
}

export default Home

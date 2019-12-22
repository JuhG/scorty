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
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import { add } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Interpreter } from 'xstate'
import AddGame from '../components/AddGame'
import Menu from '../components/Menu'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'
import { Game } from '../data/Game'
import { Play } from '../data/Play'

interface HomeProps extends RouteComponentProps<{}> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Home: React.FC<HomeProps> = ({ appService, history }) => {
  const [current, send] = useService(appService)
  const [isAddGameOpen, setIsAddGameOpen] = useState(false)

  useEffect(() => {
    if ('open_game' === current.value) {
      setIsAddGameOpen(false)
      send('RESTART')
      history.push(`/game/${Play.find(current.context, -1).id}`)
    }
  }, [current, history, send])

  return (
    <>
      <Menu appService={appService} />

      <AddGame
        games={Game.all(current.context)}
        isOpen={isAddGameOpen}
        onDismiss={() => setIsAddGameOpen(false)}
        onSuccess={(gameId: number, name: string) => {
          send({
            type: 'ADD_GAME',
            data: { id: gameId, name },
          })
        }}
      />

      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Scorty</IonTitle>

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
              {current.context.history.map(item => {
                const game = Game.find(current.context, item.gameId)
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
                            type: 'DELETE_PLAY',
                            data: {
                              playId: item.id,
                            },
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
                setIsAddGameOpen(true)
              }}
            >
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    </>
  )
}

export default Home

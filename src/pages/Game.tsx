import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Interpreter } from 'xstate'
import AddPlayer from '../components/AddPlayer'
import Menu from '../components/Menu'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'

interface GameProps
  extends RouteComponentProps<{
    id: string
  }> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Game: React.FC<GameProps> = ({ appService, match, history }) => {
  const [current, send] = useService(appService)
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)

  const item = current.context.history.find(
    item => item.id === parseInt(match.params.id, 10)
  )

  useEffect(() => {
    if (!item) return

    if (item.scores.length === 0) {
      setIsAddPlayerOpen(true)
    }
  }, [item])

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
    <>
      <Menu appService={appService} />

      <AddPlayer
        players={current.context.players.filter(p => {
          return item.scores.map(sc => sc.player).indexOf(p.id) === -1
        })}
        isOpen={isAddPlayerOpen}
        onDismiss={() => setIsAddPlayerOpen(false)}
        onSuccess={(player: number, name: string) => {
          setIsAddPlayerOpen(false)

          send({
            type: 'ADD_PLAYER',
            data: {
              item: item.id,
              player,
              name,
            },
          })
        }}
      />

      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/"></IonBackButton>
            </IonButtons>
            <IonTitle>{game.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent id="main">
          <IonList>
            {item.scores.map(score => {
              const player = current.context.players.find(
                player => player.id === score.player
              )
              return (
                <IonItem key={player ? player.id : 0}>
                  {player ? player.name : ''}
                </IonItem>
              )
            })}
          </IonList>

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              color="secondary"
              onClick={() => {
                setIsAddPlayerOpen(true)
              }}
            >
              <IonIcon class="dd-plus" name="close" />
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonFooter></IonFooter>
      </IonPage>
    </>
  )
}

export default Game

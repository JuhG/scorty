import {
  IonBackButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonHeader,
  IonIcon,
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
import AddPlayer from '../components/AddPlayer'
import AddScore from '../components/AddScore'
import Menu from '../components/Menu'
import {
  AppContext,
  AppEvent,
  AppStateSchema,
  Player,
} from '../data/appMachine'

interface GameProps
  extends RouteComponentProps<{
    id: string
  }> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Game: React.FC<GameProps> = ({ appService, match, history }) => {
  const [current, send] = useService(appService)
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isAddScoreOpen, setIsAddScoreOpen] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null | undefined>(
    null
  )

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

      <AddScore
        isOpen={isAddScoreOpen}
        player={currentPlayer}
        onDismiss={() => setIsAddScoreOpen(false)}
        onSuccess={(score: number) => {
          setIsAddScoreOpen(false)

          send({
            type: 'ADD_SCORE',
            data: {
              item: item.id,
              player: currentPlayer,
              score,
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
          <IonList style={{ display: 'flex' }}>
            {item.scores.map(score => {
              const player = current.context.players.find(
                player => player.id === score.player
              )
              return (
                <div
                  key={player ? player.id : 0}
                  style={{
                    flex: 1,
                    maxWidth: '50vw',
                  }}
                  className="dd-col"
                >
                  <IonChip color="primary">
                    <IonLabel>{player ? player.name : ''}</IonLabel>
                  </IonChip>
                  <div className="dd-add">
                    <IonChip
                      color="secondary"
                      onClick={() => {
                        setCurrentPlayer(player)
                        setIsAddScoreOpen(true)
                      }}
                    >
                      <IonLabel>
                        <IonIcon class="dd-plus" name="close" />
                      </IonLabel>
                    </IonChip>
                  </div>
                  {score.blocks.map((block, i) => {
                    return (
                      <div key={i} className="dd-col dd-block">
                        {block.map((number, j) => {
                          return (
                            <IonChip key={j} outline={true}>
                              <IonLabel>{number}</IonLabel>
                            </IonChip>
                          )
                        })}
                      </div>
                    )
                  })}

                  {score.blocks.some(b => b.length) ? (
                    <div className="dd-sum">
                      <IonChip>
                        <IonLabel>
                          {score.blocks.reduce(
                            (a, b) => a + b.reduce((c, d) => c + d, 0),
                            0
                          )}
                        </IonLabel>
                      </IonChip>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
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

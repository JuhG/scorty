import {
  IonBackButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
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
import AddPlayer from '../components/AddPlayer'
import AddScore from '../components/AddScore'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'
import { Game as GameClass } from '../data/Game'
import { Play } from '../data/Play'
import { Player, PlayerSchema } from '../data/Player'

interface GameProps
  extends RouteComponentProps<{
    id: string
  }> {
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}

const Game: React.FC<GameProps> = ({ appService, match }) => {
  const [current, send] = useService(appService)
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isAddScoreOpen, setIsAddScoreOpen] = useState(false)

  const [currentPlayer, setCurrentPlayer] = useState<PlayerSchema>(
    Player.find(current.context, -1)
  )

  const item = Play.find(current.context, parseInt(match.params.id, 10))
  const game = GameClass.find(current.context, item.gameId)

  useEffect(() => {
    if (item.players.length === 0) {
      setIsAddPlayerOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <AddPlayer
        players={Player.all(current.context).filter(p => {
          return item.players.map(sc => sc.playerId).indexOf(p.id) === -1
        })}
        isOpen={isAddPlayerOpen}
        onDismiss={() => setIsAddPlayerOpen(false)}
        onSuccess={(player: number, name: string) => {
          send({
            type: 'ADD_PLAYER',
            data: {
              playId: item.id,
              id: player,
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

          if (0 === score) return

          send({
            type: 'ADD_SCORE',
            data: {
              playId: item.id,
              playerId: currentPlayer.id,
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

            <IonButtons slot="end">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent id="main">
          <IonList style={{ display: 'flex' }}>
            {item.players.map(score => {
              const player = Player.find(current.context, score.playerId)

              return (
                <div
                  key={player.id}
                  style={{
                    flex: 1,
                    maxWidth: '50vw',
                  }}
                  className="dd-col"
                >
                  <IonChip color="primary">
                    <IonLabel>{player.name}</IonLabel>
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
                        <IonIcon icon={add} />
                      </IonLabel>
                    </IonChip>
                  </div>
                  {score.blocks.map(block => {
                    return (
                      <div key={block.id} className="dd-col dd-block">
                        {block.scores.map(b => {
                          return (
                            <IonChip key={b.id} outline={true}>
                              <IonLabel>{b.score}</IonLabel>
                            </IonChip>
                          )
                        })}
                      </div>
                    )
                  })}

                  {score.blocks.some(b => b.scores.length) ? (
                    <div className="dd-sum">
                      <IonChip>
                        <IonLabel>
                          {score.blocks.reduce(
                            (a, b) =>
                              a + b.scores.reduce((c, d) => c + d.score, 0),
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

          {item.players.some(sc => {
            return sc.blocks.some(b => b.scores.length)
          }) ? (
            ''
          ) : (
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton
                color="secondary"
                onClick={() => {
                  setIsAddPlayerOpen(true)
                }}
              >
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
          )}
        </IonContent>
      </IonPage>
    </>
  )
}

export default Game

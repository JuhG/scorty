import {
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { GameSchema } from '../data/Game'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  games: Array<GameSchema>
  onSuccess: (gameId: number, name: string) => void
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
  games,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [game, setGame] = useState<number>(-1)

  return (
    <IonModal
      cssClass="dd-add-game"
      isOpen={isOpen}
      onDidDismiss={() => {
        setGame(-1)
        setName('')

        onDismiss()
      }}
    >
      <IonToolbar color="secondary">
        <IonTitle slot="start">Start a new game</IonTitle>
      </IonToolbar>

      <div
        style={{
          overflowY: 'auto',
        }}
      >
        <IonList>
          <IonRadioGroup
            value={game}
            onIonChange={e => {
              if ('undefined' === typeof e.detail.value) return
              if (null === e.detail.value) return
              setGame(e.detail.value)
            }}
          >
            {games.map(p => (
              <IonItem key={p.id}>
                <IonLabel>{p.name}</IonLabel>
                <IonRadio slot="start" value={p.id} />
              </IonItem>
            ))}

            <IonItem>
              <IonLabel>Add new game</IonLabel>
              <IonRadio slot="start" value={-1} />
            </IonItem>
          </IonRadioGroup>
        </IonList>

        {-1 === game ? (
          <IonItem>
            <IonLabel>Name of the game: </IonLabel>
            <IonInput
              class="ion-text-end"
              value={name}
              onIonChange={e => {
                if ('undefined' === typeof e.detail.value) return
                if (null === e.detail.value) return
                setName(e.detail.value)
              }}
            />
          </IonItem>
        ) : (
          ''
        )}
      </div>

      <IonToolbar color="light">
        <IonButtons slot="start">
          <IonButton
            onClick={() => {
              setGame(-1)
              setName('')

              onDismiss()
            }}
          >
            Cancel
          </IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton
            class="dd-button"
            fill="solid"
            size="large"
            disabled={game === -1 && !name}
            onClick={() => {
              onSuccess(game, name)

              setGame(-1)
              setName('')
            }}
          >
            Add
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonModal>
  )
}

export default Modal

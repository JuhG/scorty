import {
  IonButton,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  games: Array<{ id: number; name: string }>
  onSuccess: (game: number, name: string) => void
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
  games,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [game, setGame] = useState<number | null>(null)

  return (
    <IonModal
      cssClass="dd-add-game"
      isOpen={isOpen}
      onDidDismiss={() => onDismiss()}
    >
      <IonToolbar>
        <IonTitle slot="start">Create a new game</IonTitle>
      </IonToolbar>

      <IonList>
        <IonItem>
          <IonLabel>Game</IonLabel>
          <IonSelect
            value={game}
            onIonChange={e => setGame(e.detail.value)}
            name="dd_game"
            placeholder="Select One"
          >
            <IonSelectOption value={-1}>Add new game</IonSelectOption>
            {games.map(game => (
              <IonSelectOption key={game.id} value={game.id}>
                {game.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        {-1 === game ? (
          <IonItem>
            <IonLabel>New game</IonLabel>
            <IonInput
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
      </IonList>

      <IonToolbar color="light">
        <IonButtons slot="start">
          <IonButton
            onClick={() => {
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
            disabled={!game || (game === -1 && !name)}
            onClick={() => {
              if (null === game) return

              setGame(null)
              setName('')

              onSuccess(game, name)
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

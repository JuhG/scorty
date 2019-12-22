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

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  players: Array<{ id: number; name: string }>
  onSuccess: (playerId: number, name: string) => void
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onDismiss,
  players,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [player, setPlayer] = useState<number>(-1)

  const reset = () => {
    onDismiss()
    setPlayer(-1)
    setName('')
  }

  return (
    <IonModal
      cssClass="dd-add-game"
      isOpen={isOpen}
      onDidDismiss={() => reset()}
    >
      <IonToolbar color="secondary">
        <IonTitle slot="start">Add a player</IonTitle>
      </IonToolbar>

      <div
        style={{
          overflowY: 'auto',
        }}
      >
        <IonList>
          <IonRadioGroup
            value={player}
            onIonChange={e => {
              if ('undefined' === typeof e.detail.value) return
              if (null === e.detail.value) return
              setPlayer(e.detail.value)
            }}
          >
            {players.map(p => (
              <IonItem key={p.id}>
                <IonLabel>{p.name}</IonLabel>
                <IonRadio slot="start" value={p.id} />
              </IonItem>
            ))}

            <IonItem>
              <IonLabel>Add a new player</IonLabel>
              <IonRadio slot="start" value={-1} />
            </IonItem>
          </IonRadioGroup>
        </IonList>

        {-1 === player ? (
          <IonItem>
            <IonLabel>Player name</IonLabel>
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
          <IonButton onClick={() => reset()}>Cancel</IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton
            class="dd-button"
            fill="solid"
            size="large"
            disabled={player === -1 && !name}
            onClick={() => {
              onSuccess(player, name)
              reset()
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

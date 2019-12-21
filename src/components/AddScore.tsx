import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { Player } from '../data/appMachine'

interface ButtonProps {
  val: number
  onSuccess: Function
  onDismiss: Function
}

const Button: React.FC<ButtonProps> = ({ val, onSuccess, onDismiss }) => {
  return (
    <IonCol>
      <IonButton
        color="secondary"
        fill="solid"
        expand="block"
        size="large"
        onClick={() => onSuccess(val)}
      >
        {val}
      </IonButton>
    </IonCol>
  )
}

interface RowProps {
  values: Array<number>
  onSuccess: Function
  onDismiss: Function
}

const Row: React.FC<RowProps> = ({ values, onSuccess, onDismiss }) => {
  return (
    <IonRow class="ion-nowrap">
      {values.map(val => (
        <Button
          key={val}
          onSuccess={onSuccess}
          onDismiss={onDismiss}
          val={val}
        />
      ))}
    </IonRow>
  )
}

const allValues = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]]

interface ModalProps {
  isOpen: boolean
  onSuccess: (number: number) => void
  onDismiss: Function
  player: Player | null | undefined
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onSuccess,
  onDismiss,
  player,
}) => {
  const [count, setCount] = useState('')

  return (
    <IonModal
      cssClass="dd-modal"
      isOpen={isOpen}
      onDidDismiss={() => onDismiss()}
    >
      <IonToolbar color="light">
        <IonTitle style={{ padding: 20, textAlign: 'left' }} slot="start">
          {player ? player.name : ''}
        </IonTitle>
        <IonTitle style={{ padding: 20 }} slot="end">
          {count}
        </IonTitle>
      </IonToolbar>

      <IonGrid>
        {allValues.map(values => (
          <Row
            key={values[0]}
            onSuccess={(number: number) => setCount('' + count + number)}
            onDismiss={onDismiss}
            values={values}
          />
        ))}
      </IonGrid>

      <IonToolbar>
        <IonButtons slot="start">
          <IonButton
            onClick={() => {
              onDismiss()
              setCount('')
            }}
          >
            Cancel
          </IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton
            class="dd-button"
            disabled={'' === count}
            fill="solid"
            size="large"
            onClick={() => {
              onSuccess(parseInt(count, 10) || 0)
              setCount('')
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

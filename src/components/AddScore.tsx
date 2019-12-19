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

interface ButtonProps {
  val: number
  onAdd: Function
  onDismiss: Function
}

const Button: React.FC<ButtonProps> = ({ val, onAdd, onDismiss }) => {
  return (
    <IonCol>
      <IonButton
        color="secondary"
        fill="solid"
        expand="block"
        onClick={() => onAdd(val)}
      >
        {val}
      </IonButton>
    </IonCol>
  )
}

interface RowProps {
  values: Array<number>
  onAdd: Function
  onDismiss: Function
}

const Row: React.FC<RowProps> = ({ values, onAdd, onDismiss }) => {
  return (
    <IonRow class="ion-nowrap">
      {values.map(val => (
        <Button key={val} onAdd={onAdd} onDismiss={onDismiss} val={val} />
      ))}
    </IonRow>
  )
}

const allValues = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]]

interface ModalProps {
  open: boolean
  onAdd: (number: number) => void
  onDismiss: Function
}

const Modal: React.FC<ModalProps> = ({ open, onAdd, onDismiss }) => {
  const [count, setCount] = useState('')

  return (
    <IonModal
      cssClass="dd-modal"
      isOpen={open}
      onDidDismiss={() => onDismiss()}
    >
      <IonToolbar color="light">
        <IonTitle slot="start">Name</IonTitle>
        <IonTitle slot="end">{count}</IonTitle>
      </IonToolbar>

      <IonGrid>
        {allValues.map(values => (
          <Row
            key={values[0]}
            onAdd={(number: number) => setCount('' + count + number)}
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
              onAdd(parseInt(count, 10) || 0)
              onDismiss()
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

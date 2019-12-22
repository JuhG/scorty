import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { arrowBack, remove } from 'ionicons/icons'
import React, { ReactElement, useState } from 'react'
import { PlayerSchema } from '../data/Player'

interface ButtonProps {
  val: number | ReactElement | string
  onSuccess: Function
  onDismiss: Function
}

const Button: React.FC<ButtonProps> = ({ val, onSuccess }) => {
  return (
    <IonCol>
      <IonButton
        onClick={() => ('number' === typeof val ? onSuccess(val) : onSuccess())}
        color="secondary"
        fill="solid"
        expand="block"
        size="large"
      >
        <div
          style={{
            width: 28,
          }}
        >
          {val}
        </div>
      </IonButton>
    </IonCol>
  )
}

interface RowProps {
  values: Array<
    | number
    | {
        index: string
        content: ReactElement | string
        handler: Function
      }
  >
  onSuccess: Function
  onDismiss: Function
  count: string
  setCount: (count: string) => void
}

const Row: React.FC<RowProps> = ({
  values,
  onSuccess,
  onDismiss,
  count,
  setCount,
}) => {
  return (
    <IonRow class="ion-nowrap">
      {values.map(val =>
        'number' === typeof val ? (
          <Button
            key={val}
            onSuccess={onSuccess}
            onDismiss={onDismiss}
            val={val}
          />
        ) : (
          <Button
            key={val.index}
            onSuccess={() => val.handler(count, setCount)}
            onDismiss={onDismiss}
            val={val.content}
          />
        )
      )}
    </IonRow>
  )
}

const allValues = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [
    {
      index: 'minus',
      content: <IonIcon icon={remove} />,
      handler: (count: string, setCount: (count: string) => void) => {
        var sign = count.charAt(0)
        if ('-' === sign) {
          setCount(count.substring(1))
        } else {
          setCount('-' + count)
        }
      },
    },
    0,
    {
      index: 'delete',
      content: <IonIcon icon={arrowBack} />,
      handler: (count: string, setCount: (count: string) => void) => {
        setCount(count.slice(0, -1))
      },
    },
  ],
]

interface ModalProps {
  isOpen: boolean
  onSuccess: (number: number) => void
  onDismiss: Function
  player: PlayerSchema
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
          {player.name}
        </IonTitle>
        <IonTitle style={{ padding: 20 }} slot="end">
          {count}
        </IonTitle>
      </IonToolbar>

      <IonGrid>
        {allValues.map(values => (
          <Row
            key={'number' === typeof values[0] ? values[0] : values[0].index}
            onSuccess={(number: number) => setCount('' + count + number)}
            onDismiss={onDismiss}
            values={values}
            count={count}
            setCount={setCount}
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

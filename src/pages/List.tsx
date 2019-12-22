import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonReorder,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { add, trash } from 'ionicons/icons'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import AddPlayer from '../components/AddPlayer'
import { GameSchema } from '../data/Game'
import { PlayerSchema } from '../data/Player'

interface ListProps extends RouteComponentProps<{}> {
  data: Array<PlayerSchema | GameSchema>
  title: string
  onDelete: (id: number) => void
  onAdd: (id: number, name: string) => void
}

export const List: React.FC<ListProps> = ({ title, data, onDelete, onAdd }) => {
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)

  return (
    <>
      <AddPlayer
        players={[]}
        isOpen={isAddPlayerOpen}
        onDismiss={() => setIsAddPlayerOpen(false)}
        onSuccess={(id: number, name: string) => {
          onAdd(id, name)
        }}
      />

      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/"></IonBackButton>
            </IonButtons>

            <IonTitle>{title}</IonTitle>

            <IonButtons slot="end">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent id="main">
          <IonList>
            {data.map(item => {
              return (
                <IonItem key={item.id} onClick={() => onDelete(item.id)}>
                  <IonReorder slot="start" />
                  <IonLabel>{item.name}</IonLabel>
                  <IonIcon icon={trash} />
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
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    </>
  )
}

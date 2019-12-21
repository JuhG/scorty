import {
  IonAlert,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import React, { useState } from 'react'
import { Interpreter } from 'xstate'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'

const Menu: React.FC<{
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}> = ({ appService, ...props }) => {
  const [_, send] = useService(appService)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  return (
    <>
      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header={'Reset data'}
        subHeader={'Are you sure? All your game history will be lost.'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Reset data',
            cssClass: 'secondary',
            handler: () => {
              send('RESET')
            },
          },
        ]}
      />

      <IonMenu {...props} side="end" contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem onClick={() => setIsAlertOpen(true)}>
              <IonLabel>Delete history</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  )
}

export default Menu

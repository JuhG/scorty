import {
  IonAlert,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useService } from '@xstate/react'
import { contacts, logoGameControllerB, trash } from 'ionicons/icons'
import React, { useState } from 'react'
import { Interpreter } from 'xstate'
import { AppContext, AppEvent, AppStateSchema } from '../data/appMachine'

const Menu: React.FC<{
  appService: Interpreter<AppContext, AppStateSchema, AppEvent>
}> = ({ appService, ...props }) => {
  const [, send] = useService(appService)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  return (
    <>
      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header={'Delete all data'}
        subHeader={'Are you sure? All your game history will be lost.'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            cssClass: 'secondary',
            handler: () => {
              send('RESET')
            },
          },
        ]}
      />

      <IonMenu {...props} side="end" contentId="main">
        <IonHeader>
          <IonToolbar color="secondary">
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonMenuToggle>
              <IonItem routerLink="/games">
                <IonIcon slot="start" icon={logoGameControllerB} />
                <IonLabel>Games</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle>
              <IonItem routerLink="/players">
                <IonIcon slot="start" icon={contacts} />
                <IonLabel>Players</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>

        <IonFooter>
          <IonList>
            <IonMenuToggle>
              <IonItem onClick={() => setIsAlertOpen(true)}>
                <IonIcon slot="start" icon={trash} />
                <IonLabel>Delete played games</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonFooter>
      </IonMenu>
    </>
  )
}

export default Menu

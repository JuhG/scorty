import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonActionSheet,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonText,
  IonFooter
} from "@ionic/react";

export default () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [number, setNumber] = useState(0);

  const add = (n: number) => setNumber(number + n);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle>Ionic Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonText color="primary">
          <h1 className="ion-padding">Number: {number}</h1>
        </IonText>

        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: "Add 1",
              handler: () => {
                add(1);
              }
            },
            {
              text: "Add 5",
              handler: () => {
                add(5);
              }
            },
            {
              text: "Cancel",
              icon: "close",
              role: "cancel"
            }
          ]}
        ></IonActionSheet>
      </IonContent>
      <IonFooter>
        <IonButton onClick={() => setShowActionSheet(true)} expand="block">
          Show Action Sheet
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

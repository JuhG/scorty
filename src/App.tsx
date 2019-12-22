import { Plugins } from '@capacitor/core'
import { IonApp, IonLoading, IonRouterOutlet } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'
import '@ionic/react/css/display.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/float-elements.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/typography.css'
import { useMachine } from '@xstate/react'
import React, { useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { appMachine } from './data/appMachine'
import Game from './pages/Game'
import { Games } from './pages/Games'
import Home from './pages/Home'
import { Players } from './pages/Players'
/* Theme variables */
import './theme/variables.css'

const App: React.FC = () => {
  const { Storage } = Plugins
  const [current, send, appService] = useMachine(appMachine)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (current.value !== 'loading') {
      setLoading(false)
      return
    }

    const func = async () => {
      const { value } = await Storage.get({ key: 'DD_STATE' })
      if (null === value) return send('FAILED')

      send({
        type: 'LOADED',
        data: JSON.parse(value),
      })
    }

    func()
  }, [Storage, current, send])

  return (
    <IonApp
      style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        with: '100%',
        maxWidth: 425,
      }}
    >
      {loading ? (
        <IonLoading isOpen={true} message={'Loading...'} />
      ) : (
        <IonReactRouter>
          <IonRouterOutlet>
            <Route
              path="/game/:id"
              render={props => <Game {...props} appService={appService} />}
              exact={true}
            />
            <Route
              path="/home"
              render={props => <Home {...props} appService={appService} />}
              exact={true}
            />
            <Route
              path="/players"
              render={props => <Players {...props} appService={appService} />}
              exact={true}
            />
            <Route
              path="/games"
              render={props => <Games {...props} appService={appService} />}
              exact={true}
            />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      )}
    </IonApp>
  )
}

export default App

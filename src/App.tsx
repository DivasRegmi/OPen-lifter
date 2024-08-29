import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter, Route, Routes } from "react-router-dom";

import OpenLifterIntlProvider from "./components/translations/OpenLifterIntlProvider";

import RootContainer from "./containers/RootContainer";
import MeetSetupContainer from "./containers/MeetSetupContainer";
import RegistrationContainer from "./containers/RegistrationContainer";
import WeighinsContainer from "./containers/WeighinsContainer";
import LiftingContainer from "./containers/LiftingContainer";
import FlightOrderContainer from "./containers/FlightOrderContainer";
import ResultsContainer from "./containers/ResultsContainer";
import DebugContainer from "./containers/DebugContainer";
import AboutContainer from "./containers/AboutContainer";
import Navigation from "./components/Navigation";

import configureStore from "./store";

import { getDefaultLanguage } from "./logic/strings";

class App extends React.Component {
  render() {
    const { store, persistor } = configureStore({ language: getDefaultLanguage() });

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <OpenLifterIntlProvider>
            <HashRouter basename={process.env.REACT_APP_ROUTER_BASENAME}>
              <div>
                <Navigation />
                <Routes>
                  <Route path="/" element={<RootContainer />} />
                  <Route path="/meet-setup" element={<MeetSetupContainer />} />
                  <Route path="/registration" element={<RegistrationContainer />} />
                  <Route path="/weigh-ins" element={<WeighinsContainer />} />
                  <Route path="/flight-order" element={<FlightOrderContainer />} />
                  <Route path="/lifting" element={<LiftingContainer />} />
                  <Route path="/results" element={<ResultsContainer />} />
                  <Route path="/debug" element={<DebugContainer />} />
                  <Route path="/about" element={<AboutContainer />} />
                </Routes>
              </div>
            </HashRouter>
          </OpenLifterIntlProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

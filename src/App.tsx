import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Map from "./components/Map";
import "toastify-js/src/toastify.css";
import "./styles/Map.scss";
import "./styles/Main.scss";
import "./styles/Animations.scss";
import Incidents from "./components/Incidents";
import Advisories from "./components/Advisories";
import Devices from "./components/Devices";
import DeviceDemo from "./components/DeviceDemo";

function App() {
  return (
    <>
      <Router>
        <div>
          <Switch>
            <Route path="/" exact>
              <Landing />
            </Route>

            <Route path="/map">
              <Map />
            </Route>

            <Route path="/incidents">
              <Incidents />
            </Route>

            <Route path="/advisories">
              <Advisories />
            </Route>

            <Route path="/device-list">
              <Devices />
            </Route>

            <Route path="/report/demo">
              <DeviceDemo />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;

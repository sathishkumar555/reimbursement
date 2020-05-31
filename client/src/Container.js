
import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";
import AppL from './App';
import Login from './Login';

function Container() {
  return (
        <HashRouter>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={AppL} />
          <Route path="/login" component={Login} />

        </HashRouter>
  );
}

export default Container;
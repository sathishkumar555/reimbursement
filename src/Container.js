
import React from "react";
import { Switch, Route } from "react-router-dom";
import AppL from './App';
import Login from './Login';

function Container() {
  return (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={AppL} />
          <Route path="/login" component={Login} />

        </Switch>
  );
}

export default Container;
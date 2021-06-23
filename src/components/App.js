import React from "react";
import { Route, Switch } from "react-router";
import RegleriForm from "./RegleriForm";
import RegleriList from "./RegleriList";
import Login from "./Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "../protected-route";

function App() {
  return (
    <div className="container-fluid">
      <ToastContainer autoClose={2000} hideProgressBar />
      <Switch>
        <Route path="/" exact component={Login} />
        <ProtectedRoute path="/reglerilist" exact component={RegleriList} />
        <ProtectedRoute path="/regleriform" exact component={RegleriForm} />
      </Switch>
    </div>
  );
}

export default App;

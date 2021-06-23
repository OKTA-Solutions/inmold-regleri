import React from "react";
import { Route, Redirect } from "react-router-dom";
import cookie from "react-cookies";

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  let getAccess = cookie.load("jwtToken");
  let isAuthenticated = false;

  if (getAccess !== "" && getAccess !== undefined) {
    isAuthenticated = true;
  } else {
  }
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        return isAuthenticated ? (
          <Comp {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        );
      }}
    />
  );
};

export default ProtectedRoute;

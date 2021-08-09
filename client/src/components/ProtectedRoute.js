import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...reactRouterProps }) => {
  const token = sessionStorage.getItem("token");
  console.log(reactRouterProps);
  return (
    <Route
      {...reactRouterProps}
      render={(routeProps) =>
        !token ? <Redirect to="/login" /> : <Component {...routeProps} />
      }
    />
  );
};

export default ProtectedRoute;

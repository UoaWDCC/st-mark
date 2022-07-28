import React, { ComponentType } from "react";
import { Route, RouteProps } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Spinner from "../components/common/Spinner";

const loading = () => <Spinner />;

const ProtectedRoute: React.FC<RouteProps> = ({
  component,
  ...args
}: RouteProps) => (
  <Route
    component={withAuthenticationRequired(component as ComponentType, {
      onRedirecting: loading,
    })}
    {...args}
  />
);

export default ProtectedRoute;

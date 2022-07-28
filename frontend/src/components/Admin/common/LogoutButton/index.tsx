import React from "react";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton: React.FC = () => {
  const { isAuthenticated, logout } = useAuth0();

  return isAuthenticated ? (
    <Button
      variant="contained"
      color="secondary"
      data-testid="logout-button"
      onClick={() => {
        logout({ returnTo: `${window.location.origin}/admin` });
      }}
    >
      Logout
    </Button>
  ) : null;
};

export default LogoutButton;

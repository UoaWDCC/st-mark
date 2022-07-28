import React from "react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { Route, Switch } from "react-router-dom";
import ProfilesPage from "../pages/Admin/ProfilesPage";
import ProfileEditorPage from "../pages/Admin/ProfileEditorPage";
import "./constants.css";

const AdminApp: React.FC = () => {
  let adminTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#ffffff",
        contrastText: "#12593e",
      },
      secondary: {
        main: "#12593e",
        contrastText: "#ffffff",
      },
      background: {
        paper: "rgba(255,255,255,0.8)",
      },
    },
  });
  adminTheme = responsiveFontSizes(adminTheme);

  let opaquePaperAdminTheme = createTheme({
    palette: {
      ...adminTheme.palette,
      background: {
        paper: "white",
      },
    },
  });
  opaquePaperAdminTheme = responsiveFontSizes(opaquePaperAdminTheme);

  return (
    <ThemeProvider theme={adminTheme}>
      <Switch>
        <Route exact path="/admin">
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={opaquePaperAdminTheme}>
              <ProfilesPage />
            </ThemeProvider>
          </StyledEngineProvider>
        </Route>
        <Route path="/admin/edit/profile/:id">
          <ProfileEditorPage />
        </Route>
      </Switch>
    </ThemeProvider>
  );
};

export default AdminApp;

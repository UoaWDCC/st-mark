import React from "react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { Redirect, Route, Switch } from "react-router-dom";
import DirectoryPage from "../pages/DirectoryPage";
import ProfilePage from "../pages/ProfilePage";
import LandingPage from "../pages/LandingPage";
import MapPage from "../pages/MapPage";
import {
  landingPageTitle,
  landingPageDescription,
  landingPageMobileDescription,
} from "./messages";
import SubmissionPage from "../pages/SubmissionPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminApp from "../AdminApp";
import "./constants.css";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff",
      contrastText: "#04335B",
    },
    secondary: {
      main: "#04335B",
      contrastText: "#ffffff",
    },
    background: {
      paper: "rgba(255,255,255,0.85)",
    },
  },
  typography: {
    fontFamily: "'Playfair Display', Times, serif",
    button: {
      fontFamily: "Arial, Helvetica, sans-serif",
    },
  },
});
theme = responsiveFontSizes(theme);

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/">
            <LandingPage
              title={landingPageTitle}
              description={landingPageDescription}
              mobileDescription={landingPageMobileDescription}
            />
          </Route>
          <Route path="/directory">
            <DirectoryPage />
          </Route>
          <Route path={["/map/:plotNumber", "/map"]}>
            <MapPage />
          </Route>
          <Route path="/profile/:id/submission">
            <SubmissionPage />
          </Route>
          <Route path="/profile/:id">
            <ProfilePage />
          </Route>
          <Route path="/profile">
            <Redirect to="/directory" />
          </Route>
          <ProtectedRoute path="/admin" component={AdminApp} />
        </Switch>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

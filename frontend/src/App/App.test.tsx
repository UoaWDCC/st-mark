import React, { ComponentType } from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../utils/renderWithRouter";
import App from "./index";

jest.mock("../pages/DirectoryPage");
jest.mock("../pages/ProfilePage");
jest.mock("../pages/LandingPage");
jest.mock("../pages/MapPage");
jest.mock("../pages/Admin/ProfilesPage");

jest.mock("@auth0/auth0-react", () => ({
  withAuthenticationRequired: (component: ComponentType) => component,
}));

describe("App", () => {
  it("Displays ProfilesPage when route is '/admin'", () => {
    renderWithRouter(<App />, "/admin");

    expect(screen.getByTestId("profiles-page")).toBeTruthy();
  });

  it("Displays LandingPage when route is exactly '/'", () => {
    renderWithRouter(<App />, "/");

    expect(screen.getByTestId("landing-page")).toBeTruthy();
  });

  it("Displays DirectoryPage when route is '/directory'", () => {
    renderWithRouter(<App />, "/directory");

    expect(screen.getByTestId("directory-page")).toBeTruthy();
  });

  it("Displays MapPage when route is '/map'", () => {
    renderWithRouter(<App />, "/map");

    expect(screen.getByTestId("map-page")).toBeTruthy();
  });

  it("Displays MapPage when route is '/map/10'", () => {
    renderWithRouter(<App />, "/map/10");

    expect(screen.getByTestId("map-page")).toBeTruthy();
  });

  it("Displays ProfilePage when route is '/profile/:id'", () => {
    renderWithRouter(<App />, "/profile/10");

    expect(screen.getByTestId("profile-page")).toBeTruthy();
  });

  it("Redirects to '/directory' when route is '/profile'", () => {
    const { history } = renderWithRouter(<App />, "/profile");

    expect(history.location.pathname).toBe("/directory");
  });
});

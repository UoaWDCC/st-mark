import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import NavBar from "../NavBar";

describe("NavBar", () => {
  it("Routes to '/ when the home button is clicked", () => {
    const { history } = renderWithRouter(<NavBar />, "/not-home");

    fireEvent.click(screen.getByTestId("home-button"));
    expect(history.location.pathname).toBe("/");
  });

  it("Routes to '/map' when the map button is clicked", () => {
    const { history } = renderWithRouter(<NavBar />);

    fireEvent.click(screen.getByTestId("map-button"));
    expect(history.location.pathname).toBe("/map");
  });

  it("Routes to '/directory' when the directory button is clicked", () => {
    const { history } = renderWithRouter(<NavBar />);

    fireEvent.click(screen.getByTestId("directory-button"));
    expect(history.location.pathname).toBe("/directory");
  });
});

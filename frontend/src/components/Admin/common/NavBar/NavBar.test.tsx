import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import NavBar from "./index";

describe("NavBar", () => {
  it("Doesn't render title text when title prop is not provided", () => {
    renderWithRouter(<NavBar />, "/not-admin");

    expect(screen.queryByTestId("admin-nav-title")).toBeFalsy();
  });
  it("Renders title text when title prop provided", () => {
    renderWithRouter(<NavBar title="My Title" />, "/not-admin");

    expect(screen.getByText("My Title")).toBeTruthy();
  });
  it("Doesn't render back button when backDestination prop is not provided", () => {
    renderWithRouter(<NavBar />, "/not-admin");

    expect(screen.queryByTestId("admin-nav-back-button")).toBeFalsy();
  });
  it("Routes to provided destination when back button clicked", () => {
    const { history } = renderWithRouter(
      <NavBar backDestination="/admin" />,
      "/not-admin"
    );

    fireEvent.click(screen.getByTestId("admin-nav-back-button"));
    expect(history.location.pathname).toBe("/admin");
  });
});

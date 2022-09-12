import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../utils/renderWithRouter";
import LandingPage from "../LandingPage";

describe("LandingPage", () => {
  it("renders the landing page and displays the given title and description", () => {
    renderWithRouter(
      <LandingPage title="yee" description="haw" mobileDescription="haw" />
    );

    expect(screen.getByText("yee")).toBeTruthy();
    expect(screen.getByText("haw")).toBeTruthy();
  });

  it("Routes to '/directory' when the directory button is clicked", () => {
    const { history } = renderWithRouter(
      <LandingPage title="yee" description="haw" mobileDescription="haw" />
    );

    fireEvent.click(screen.getByTestId("directory-button"));
    expect(history.location.pathname).toBe("/directory");
  });
});

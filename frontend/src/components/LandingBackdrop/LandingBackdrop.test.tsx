import React from "react";
import { render, screen } from "@testing-library/react";
import LandingBackdrop from "./index";

describe("LandingBackdrop", () => {
  it("renders the backdrop image", () => {
    render(<LandingBackdrop />);

    expect(screen.getByTestId("backdropImage")).toBeTruthy();
  });
});

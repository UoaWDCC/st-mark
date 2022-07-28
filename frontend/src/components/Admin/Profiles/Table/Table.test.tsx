import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import ProfilesTable from "./index";

describe("Table", () => {
  it("Renders some of the correct table headers :/", () => {
    renderWithRouter(<ProfilesTable people={[]} />, "/admin");
    expect(screen.getByText("First Name")).toBeTruthy();
    expect(screen.getByText("Middle Name(s)")).toBeTruthy();
  });
});

import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import { IPersonAll, IPlot } from "../../../types/schema";
import ProfileSummary from "./index";

const mockPlot = {
  plotNumber: 2,
} as unknown as IPlot;

const mockPerson = {
  fullName: "John Johnson",
  plot: mockPlot,
} as unknown as IPersonAll;

describe("BasicInfo", () => {
  it("displays the name correctly", () => {
    renderWithRouter(<ProfileSummary person={mockPerson} />);
    expect(screen.getByText("John Johnson")).toBeTruthy();
  });

  it("displays the profile picture correctly", () => {
    renderWithRouter(<ProfileSummary person={mockPerson} />);
    expect(screen.getByAltText("Profile Picture")).toBeTruthy();
  });
});

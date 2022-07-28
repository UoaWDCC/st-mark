import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import PlotMemberDisplay from "./index";

const noPlotAltMessage = "Unknown burial location.";
const plotAltMessage = "No other known plot members.";
const plotHeader = "Plot Members";

const plotMembers = [
  {
    _id: "0",
    name: { first: "Eliza", last: "Kelly" },
    fullName: "Eliza Kelly",
  },
  {
    _id: "1",
    name: { first: "Alice", last: "Kelly" },
    fullName: "Alice Kelly",
  },
  {
    _id: "2",
    name: { first: "Robert", last: "Kelly" },
    fullName: "Robert Kelly",
  },
];

describe("PlotMemberDisplay", () => {
  it("displays alt message when not assigned a plot", () => {
    renderWithRouter(
      <PlotMemberDisplay plotMembers={[]} plotNumber={undefined} />
    );
    expect(screen.getByText(noPlotAltMessage)).toBeTruthy();
  });

  it("displays alt message and header for registered plot when supplied with empty relative list but is assigned a plot", () => {
    renderWithRouter(<PlotMemberDisplay plotMembers={[]} plotNumber={1} />);
    expect(screen.getByText(plotHeader)).toBeTruthy();
    expect(screen.getByText(plotAltMessage)).toBeTruthy();
  });

  it("displays plot members of the plot they are assigned to", () => {
    renderWithRouter(
      <PlotMemberDisplay plotMembers={plotMembers} plotNumber={1} />
    );
    expect(screen.getByText(plotHeader)).toBeTruthy();

    expect(screen.getByText("Eliza Kelly")).toBeTruthy();
    expect(screen.getByText("Alice Kelly")).toBeTruthy();
    expect(screen.getByText("Robert Kelly")).toBeTruthy();
  });

  it("navigates to plot members profile when clicked", () => {
    const { history } = renderWithRouter(
      <PlotMemberDisplay plotMembers={plotMembers} plotNumber={1} />
    );

    fireEvent.click(screen.getByText("Robert Kelly"));
    expect(history.location.pathname).toBe("/profile/2");
  });

  it("displays the plot icon when the person has an associated plot", () => {
    renderWithRouter(
      <PlotMemberDisplay plotMembers={plotMembers} plotNumber={1} />
    );
    expect(screen.getByTestId("plot-icon")).toBeTruthy();
  });

  it("does not display the plot icon when the person does not have an associated plot", () => {
    renderWithRouter(
      <PlotMemberDisplay plotMembers={[]} plotNumber={undefined} />
    );
    expect(screen.queryByTestId("plot-icon")).toBeFalsy();
  });

  it("redirects to `/map/:plotNumber` when the plot icon is clicked on", () => {
    const { history } = renderWithRouter(
      <PlotMemberDisplay plotMembers={plotMembers} plotNumber={1} />
    );

    fireEvent.click(screen.getByTestId("plot-icon"));
    expect(history.location.pathname).toBe("/map/1");
  });
});

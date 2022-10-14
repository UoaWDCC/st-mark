import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import { IPerson, IPlot } from "../../../types/schema";
import Sidebar from "./index";

const mockPlot = {
  _id: "1",
  plotNumber: 1,
  registeredName: "Whisker",
  buried: [
    {
      _id: "2",
      name: {
        first: "A",
        last: "B",
      },
      fullName: "AB",
    },
    {
      _id: "3",
      name: {
        first: "C",
        last: "D",
      },
      fullName: "CD",
    },
    {
      _id: "4",
      name: {
        first: "E",
        last: "F",
      },
      fullName: "EF",
    },
  ],
} as unknown as IPlot;

const locationKnown = [
  { _id: "456", fullName: "Crawford", plot: { plotNumber: 3 } },
] as unknown as IPerson[];

const locationUnknown = [
  { _id: "123", fullName: "Walt Whisker" },
] as unknown as IPerson[];

describe("Sidebar", () => {
  describe("Search view", () => {
    it("Displays search view when no plot is selected", () => {
      renderWithRouter(
        <Sidebar
          selectedPlot={undefined}
          searchInput=""
          onChangeSearchInput={jest.fn()}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      expect(screen.getByTestId("sidebar-search")).toBeTruthy();
    });

    it("Displays people when no plot is selected", () => {
      renderWithRouter(
        <Sidebar
          selectedPlot={undefined}
          searchInput=""
          onChangeSearchInput={jest.fn()}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      expect(screen.getByText("Crawford")).toBeTruthy();
      expect(screen.getByText("Walt Whisker")).toBeTruthy();
    });

    it("Calls onChangeSearchInput when something is searched", () => {
      const handleChangeSearchInput = jest.fn();

      renderWithRouter(
        <Sidebar
          selectedPlot={undefined}
          searchInput=""
          onChangeSearchInput={handleChangeSearchInput}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      fireEvent.change(screen.getByTestId("desktop-search-input"), {
        target: { value: "Whisker" },
      });
      expect(handleChangeSearchInput).toHaveBeenCalledTimes(1);
    });
  });

  describe("Plot view", () => {
    it("Displays plot view when plot is selected", () => {
      renderWithRouter(
        <Sidebar
          selectedPlot={mockPlot}
          searchInput=""
          onChangeSearchInput={jest.fn()}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      expect(screen.getByTestId("sidebar-plot"));
    });

    it("populates registered name correctly", () => {
      renderWithRouter(
        <Sidebar
          selectedPlot={mockPlot}
          searchInput=""
          onChangeSearchInput={jest.fn()}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      expect(screen.getByText("Whisker Plot")).toBeTruthy();
    });

    it("populates buried members correctly", () => {
      renderWithRouter(
        <Sidebar
          selectedPlot={mockPlot}
          searchInput=""
          onChangeSearchInput={jest.fn()}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      expect(screen.getByText("AB")).toBeTruthy();
      expect(screen.getByText("CD")).toBeTruthy();
      expect(screen.getByText("EF")).toBeTruthy();
    });

    it("redirects to the buried member's profile when clicked", () => {
      const { history } = renderWithRouter(
        <Sidebar
          selectedPlot={mockPlot}
          searchInput=""
          onChangeSearchInput={jest.fn()}
          onDeathDateChange={jest.fn()}
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={true}
        />
      );

      fireEvent.click(screen.getByText("CD"));
      expect(history.location.pathname).toBe("/profile/3");
    });
  });
});

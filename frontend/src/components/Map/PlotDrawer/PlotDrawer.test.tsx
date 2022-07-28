import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import { IPlot } from "../../../types/schema";
import PlotDrawer from "./index";

describe("PlotDrawer", () => {
  it("renders the map drawer correctly", () => {
    renderWithRouter(
      <PlotDrawer
        open={true}
        closeDrawer={jest.fn()}
        onOpenMobileSearch={jest.fn()}
      />
    );

    expect(screen.getByTestId("bottom-panel-drawer")).toBeTruthy();
    expect(screen.getByTestId("drawer-close-button")).toBeTruthy();
    expect(screen.getByTestId("drawer-search-button")).toBeTruthy();
  });

  it("calls open mobile search on search button click", () => {
    const handleOpenMobileSearch = jest.fn();
    renderWithRouter(
      <PlotDrawer
        open={true}
        closeDrawer={jest.fn()}
        onOpenMobileSearch={handleOpenMobileSearch}
      />
    );

    fireEvent.click(screen.getByTestId("drawer-search-button"));
    expect(handleOpenMobileSearch).toBeCalledTimes(1);
  });

  describe("Population of data inside drawer", () => {
    const plot: IPlot = {
      _id: "1",
      plotNumber: 1,
      registeredName: "Whisker",
      coordinates: [
        {
          lat: 0,
          lng: 0,
        },
        {
          lat: 0,
          lng: 0,
        },
        {
          lat: 0,
          lng: 0,
        },
      ],
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
    };

    it("populates registered name correctly", () => {
      renderWithRouter(
        <PlotDrawer
          open={true}
          closeDrawer={jest.fn()}
          selectedPlot={plot}
          onOpenMobileSearch={jest.fn()}
        />
      );

      expect(screen.getByText("Whisker Plot")).toBeTruthy();
    });

    it("populates buried members correctly", () => {
      renderWithRouter(
        <PlotDrawer
          open={true}
          closeDrawer={jest.fn()}
          selectedPlot={plot}
          onOpenMobileSearch={jest.fn()}
        />
      );

      expect(screen.getByText("AB")).toBeTruthy();
      expect(screen.getByText("CD")).toBeTruthy();
      expect(screen.getByText("EF")).toBeTruthy();
    });

    it("redirects to the buried member's profile when clicked", () => {
      const { history } = renderWithRouter(
        <PlotDrawer
          open={true}
          closeDrawer={jest.fn()}
          selectedPlot={plot}
          onOpenMobileSearch={jest.fn()}
        />
      );

      fireEvent.click(screen.getByText("CD"));
      expect(history.location.pathname).toBe("/profile/3");
    });

    it("displays burials unknown when no individuals are assigned to the plot", () => {
      const emptyPlot = { ...plot, buried: [] };
      renderWithRouter(
        <PlotDrawer
          open={true}
          closeDrawer={jest.fn()}
          selectedPlot={emptyPlot}
          onOpenMobileSearch={jest.fn()}
        />
      );

      expect(screen.getByText("Burials Unknown")).toBeTruthy();
    });
  });
});

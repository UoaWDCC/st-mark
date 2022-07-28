import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPerson } from "../../../../types/schema";
import SearchResults from "./index";

const locationKnown = [
  { _id: "456", fullName: "Crawford", plot: { plotNumber: 3 } },
] as unknown as IPerson[];

const locationUnknown = [
  { _id: "123", fullName: "Walt Whisker" },
] as unknown as IPerson[];

describe("SearchResults", () => {
  it("Shows No Results when both lists are empty", () => {
    renderWithRouter(
      <SearchResults
        locationKnown={[]}
        locationUnknown={[]}
        isPeopleLoading={false}
        onSelectLocationKnown={jest.fn()}
      />
    );

    expect(screen.getByText("No Results")).toBeTruthy();
  });

  it("Shows a loading spinner if results are still being fetched", () => {
    renderWithRouter(
      <SearchResults
        locationKnown={[]}
        locationUnknown={[]}
        isPeopleLoading={true}
        onSelectLocationKnown={jest.fn()}
      />
    );

    expect(screen.getByTestId("loading-search-spinner")).toBeTruthy();
  });

  it("Does not show divider when locationUnknown list is empty", () => {
    renderWithRouter(
      <SearchResults
        locationKnown={locationKnown}
        locationUnknown={[]}
        isPeopleLoading={false}
        onSelectLocationKnown={jest.fn()}
      />
    );

    expect(screen.queryByText("Unknown Location")).toBeNull();
    expect(screen.queryByTestId("search-result-divider")).toBeNull();
  });

  it("Shows divider and results when locationUnknown list is populated", () => {
    renderWithRouter(
      <SearchResults
        locationKnown={[]}
        locationUnknown={locationUnknown}
        isPeopleLoading={false}
        onSelectLocationKnown={jest.fn()}
      />
    );

    expect(screen.getByText("Unknown Location")).toBeTruthy();
    expect(screen.getByTestId("search-result-divider")).toBeTruthy();
    expect(screen.getByText("Walt Whisker")).toBeTruthy();
  });

  it("Shows all results when both lists are populated", () => {
    renderWithRouter(
      <SearchResults
        locationKnown={locationKnown}
        locationUnknown={locationUnknown}
        isPeopleLoading={false}
        onSelectLocationKnown={jest.fn()}
      />
    );

    expect(screen.getByText("Crawford")).toBeTruthy();
    expect(screen.getByText("Walt Whisker")).toBeTruthy();
  });

  it("Routes to /profile/:id when a location unknown result is clicked", () => {
    const onSelectLocationKnown = jest.fn();

    const { history } = renderWithRouter(
      <SearchResults
        locationKnown={locationKnown}
        locationUnknown={locationUnknown}
        isPeopleLoading={false}
        onSelectLocationKnown={jest.fn()}
      />
    );

    fireEvent.click(screen.queryAllByTestId("person-link")[1]);
    expect(history.location.pathname).toBe("/profile/123");
    expect(onSelectLocationKnown).toBeCalledTimes(0);
  });

  it("Routes to /map/:plotNumber and calls onSelectLocationKnown when a location known result is clicked", () => {
    const onSelectLocationKnown = jest.fn();

    const { history } = renderWithRouter(
      <SearchResults
        locationKnown={locationKnown}
        locationUnknown={locationUnknown}
        isPeopleLoading={false}
        onSelectLocationKnown={onSelectLocationKnown}
      />
    );

    fireEvent.click(screen.queryAllByTestId("person-link")[0]);
    expect(history.location.pathname).toBe("/map/3");
    expect(onSelectLocationKnown).toBeCalledTimes(1);
  });
});

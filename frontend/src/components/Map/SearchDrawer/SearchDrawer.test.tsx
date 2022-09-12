import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchDrawer from "./index";

describe("SearchDrawer", () => {
  it("Calls setSearchInput when something is searched", () => {
    const handleClose = jest.fn();
    const handleChangeSearchInput = jest.fn();

    render(
      <SearchDrawer
        open={true}
        closeDrawer={handleClose}
        searchInput=""
        onChangeSearchInput={handleChangeSearchInput}
        locationKnown={[]}
        locationUnknown={[]}
        isPeopleLoading={true}
        onSelectLocationKnownSearchResult={jest.fn()}
      />
    );
    fireEvent.change(screen.getByTestId("mobile-search-input"), {
      target: { value: "Whisker" },
    });
    expect(handleChangeSearchInput).toHaveBeenCalled();
    expect(handleChangeSearchInput).toHaveBeenCalledWith("Whisker");
  });

  it("Calls close when close button is pressed", () => {
    const handleClose = jest.fn();
    const handleChangeSearchInput = jest.fn();

    render(
      <SearchDrawer
        open={true}
        closeDrawer={handleClose}
        searchInput=""
        onChangeSearchInput={handleChangeSearchInput}
        locationKnown={[]}
        locationUnknown={[]}
        isPeopleLoading={true}
        onSelectLocationKnownSearchResult={jest.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("mobile-search-close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

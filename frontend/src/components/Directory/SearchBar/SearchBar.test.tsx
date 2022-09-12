import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "./index";

describe("SearchBar", () => {
  const mockCallback = jest.fn();

  it("Calls 'onSearchTermChange' when something is searched", () => {
    render(
      <SearchBar
        onSearchTermChange={mockCallback}
        onDeathDateChange={mockCallback}
      />
    );

    const elem = screen.getByLabelText("search");
    fireEvent.change(elem, { target: { value: "A" } });

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

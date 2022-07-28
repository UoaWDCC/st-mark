import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import NavigationBar from "../NavigationBar";

describe("NavigationBar", () => {
  const tabNames = ["biography", "images", "anecdotes", "links"];
  let setValue: (value: number) => void;

  beforeEach(() => {
    setValue = jest.fn();
  });

  it("should render the bar and checks that all the tabs are there", () => {
    render(<NavigationBar tabNames={tabNames} value={0} setValue={setValue} />);

    expect(screen.getByText(tabNames[0])).toBeTruthy();
    expect(screen.getByText(tabNames[1])).toBeTruthy();
    expect(screen.getByText(tabNames[2])).toBeTruthy();
    expect(screen.getByText(tabNames[3])).toBeTruthy();

    // tabs should not have been switched between
    expect(setValue).toHaveBeenCalledTimes(0);
  });

  it("tests that the tab switches when a different tab is clicked on", () => {
    render(<NavigationBar tabNames={tabNames} value={0} setValue={setValue} />);

    const tab = screen.getByTestId("anecdotes-tab");
    fireEvent.click(tab);
    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith(2);
  });
});

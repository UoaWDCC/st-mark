import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../../../utils/renderWithRouter";
import { IDate } from "../../../../../types/schema";
import DateSelector from "./index";

// The value that is mapped to the 'None' option in the dropdown.
const noneValue = "None";

const mockDate: IDate = {
  year: 1999,
  month: 1,
  day: 11,
};

const mockCallback = jest.fn();

describe("DateSelector", () => {
  it("Calls onChange when user changes day", () => {
    renderWithRouter(<DateSelector date={mockDate} onChange={mockCallback} />);

    fireEvent.change(screen.getByLabelText("day-select"), {
      target: { value: 20 },
    });

    expect(mockCallback).toHaveBeenCalledWith({
      year: 1999,
      month: 1,
      day: 20,
    });
  });

  it("Calls onChange when user changes month", () => {
    renderWithRouter(<DateSelector date={mockDate} onChange={mockCallback} />);

    fireEvent.change(screen.getByLabelText("month-select"), {
      target: { value: 4 },
    });
    expect(mockCallback).toHaveBeenCalledWith({
      year: 1999,
      month: 4,
      day: 11,
    });
  });

  it("Calls onChange when user changes year", () => {
    renderWithRouter(<DateSelector date={mockDate} onChange={mockCallback} />);

    // Have to offset the desired year by (minYear - 1) to get the actual index of the year in the options
    fireEvent.change(screen.getByLabelText("year-select"), {
      target: { value: 1995 },
    });

    expect(mockCallback).toHaveBeenCalledWith({
      year: 1995,
      month: 1,
      day: 11,
    });
  });

  it("Correctly calls onChange with 'undefined' values when 'none' options are selected", () => {
    renderWithRouter(<DateSelector date={mockDate} onChange={mockCallback} />);

    ["day-select", "month-select", "year-select"].forEach((label) => {
      fireEvent.change(screen.getByLabelText(label), {
        target: { value: noneValue },
      });
    });

    expect(mockCallback).toHaveBeenCalledWith({
      year: undefined,
      month: undefined,
      day: undefined,
    });
  });
});

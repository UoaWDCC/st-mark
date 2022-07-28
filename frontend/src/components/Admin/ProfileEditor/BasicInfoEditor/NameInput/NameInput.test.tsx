import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../../../utils/renderWithRouter";
import { IName } from "../../../../../types/schema";
import NameInput from "./index";

const mockName: IName = {
  first: "Jimbo",
  middles: "G.",
  last: "Whisker",
};

const mockCallback = jest.fn();

describe("NameInput", () => {
  it("Populates text fields with given name when passed as props", () => {
    renderWithRouter(<NameInput name={mockName} onChange={mockCallback} />);
    expect(screen.getByDisplayValue("Jimbo")).toBeTruthy();
    expect(screen.getByDisplayValue("G.")).toBeTruthy();
    expect(screen.getByDisplayValue("Whisker")).toBeTruthy();
  });

  it("Calls onChange when user types in first name field", () => {
    renderWithRouter(<NameInput name={mockName} onChange={mockCallback} />);

    const firstNameField = screen.getByLabelText("first-name-field");
    fireEvent.change(firstNameField, { target: { value: "Michael" } });
    expect(mockCallback).toHaveBeenCalledWith({
      first: "Michael",
      middles: "G.",
      last: "Whisker",
    });
  });

  it("Calls onChange when user types in middle name field", () => {
    renderWithRouter(<NameInput name={mockName} onChange={mockCallback} />);

    const middleNameField = screen.getByLabelText("middle-name-field");
    fireEvent.change(middleNameField, { target: { value: "Jeffrey" } });
    expect(mockCallback).toHaveBeenCalledWith({
      first: "Jimbo",
      middles: "Jeffrey",
      last: "Whisker",
    });
  });

  it("Calls onChange when user types in last name field", () => {
    renderWithRouter(<NameInput name={mockName} onChange={mockCallback} />);

    const lastNameField = screen.getByLabelText("last-name-field");
    fireEvent.change(lastNameField, { target: { value: "Jordan" } });
    expect(mockCallback).toHaveBeenCalledWith({
      first: "Jimbo",
      middles: "G.",
      last: "Jordan",
    });
  });
});

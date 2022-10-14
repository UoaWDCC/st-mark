import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import { IPerson } from "../../../types/schema";
import ProfileCard from "./index";

const mockPerson = {
  name: { first: "John", middles: "H.", last: "Jackson" },
  fullName: "John H. Jackson",
  dateOfBirth: {
    year: 1900,
    month: 5,
    day: 2,
  },
  dateOfDeath: {
    year: 1944,
    month: 1,
    day: 1,
  },
  _id: "0",
} as IPerson;

describe("ProfileCard", () => {
  it("Renders the directory page with the mocked people", () => {
    renderWithRouter(
      <ProfileCard person={mockPerson} onClick={jest.fn()} isStyled={true} />
    );
    // check if main components are rendered
    expect(screen.getByTestId("name-area")).toBeTruthy();
    expect(screen.getByText("John H. Jackson")).toBeTruthy();
    expect(screen.getByTestId("dob-d")).toBeTruthy();
    expect(screen.getByTestId("dob-d").firstChild?.textContent).toBeTruthy();
  });

  it("Invokes 'handleClick' when clicked", () => {
    const handleClick = jest.fn();
    renderWithRouter(
      <ProfileCard person={mockPerson} onClick={handleClick} isStyled={true} />
    );

    expect(handleClick).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByTestId("profile-card-target"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

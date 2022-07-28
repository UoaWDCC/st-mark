import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPerson } from "../../../../types/schema";
import PersonLink from "./index";

const person = { fullName: "Crawford" } as unknown as IPerson;

describe("PersonLink", () => {
  it("Displays a persons full name", () => {
    renderWithRouter(
      <PersonLink person={person} to="/some-location" variant="map" />
    );

    expect(screen.getByText("Crawford")).toBeTruthy();
  });

  it("Redirects to `to` when clicked", () => {
    const { history } = renderWithRouter(
      <PersonLink person={person} to="/some-location" variant="map" />
    );

    fireEvent.click(screen.getByTestId("person-link"));
    expect(history.location.pathname).toBe("/some-location");
  });

  it("Calls `onClick` when clicked", () => {
    const handleClick = jest.fn();

    renderWithRouter(
      <PersonLink
        person={person}
        to="/some-location"
        variant="map"
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByTestId("person-link"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

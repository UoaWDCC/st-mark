import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "./index";

const mockedLogout = jest.fn();
jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => {
    return {
      isAuthenticated: true,
      logout: mockedLogout,
    };
  },
}));

describe("LogoutButton", () => {
  it("Calls Auth0 logout function when clicked", async () => {
    render(<LogoutButton />);
    fireEvent.click(screen.getByTestId("logout-button"));

    expect(mockedLogout).toBeCalledTimes(1);
  });
});

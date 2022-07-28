import React from "react";
import axios from "axios";
import { waitFor, screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import ProfilesPage from "./index";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => {
    return {
      isAuthenticated: true,
      logout: jest.fn(),
    };
  },
}));

describe("ProfilesPage", () => {
  it("Calls the API to fetch list of people", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<ProfilesPage />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });

  it("Renders the admin nav bar with a Profiles title", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<ProfilesPage />);
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText("Profiles")).toBeTruthy();
  });

  it("Renders a Create Button", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<ProfilesPage />);
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId("create-new-button")).toBeTruthy();
  });

  it("Renders a Logout Button", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<ProfilesPage />);
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId("logout-button")).toBeTruthy();
  });

  it("Renders a create modal when create button clicked", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<ProfilesPage />);
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId("create-new-button"));

    expect(screen.getByTestId("create-button")).toBeTruthy();
  });

  it("renders loading spinner before axios request completes", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<ProfilesPage />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });
});

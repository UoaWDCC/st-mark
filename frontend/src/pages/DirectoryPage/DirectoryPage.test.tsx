import React from "react";
import axios, { AxiosResponse } from "axios";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import renderWithRouter from "../../utils/renderWithRouter";
import { IPerson } from "../../types/schema";
import DirectoryPage from "./index";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPeople: IPerson[] = [
  {
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
  },
  {
    name: { first: "Mary", last: "Jones" },
    fullName: "Mary Jones",
    dateOfDeath: {
      year: 1947,
      month: 5,
      day: 3,
    },
    _id: "1",
  },
  {
    name: { first: "Harold", last: "Hesketh" },
    fullName: "Harold Hesketh",
    dateOfBirth: {
      year: 1900,
      month: 1,
      day: 1,
    },
    _id: "2",
  },
  {
    name: { first: "May", last: "Heywood" },
    fullName: "May Heywood",
    dateOfBirth: {
      year: 1900,
      month: 5,
      day: 2,
    },
    dateOfDeath: {
      year: 1948,
      month: 1,
      day: 1,
    },
    _id: "3",
  },
  {
    name: { first: "Eliza", middles: "C.", last: "Tonks" },
    fullName: "Eliza C. Tonks",
    dateOfDeath: {
      year: 1944,
      month: 5,
      day: 3,
    },
    _id: "4",
  },
  {
    name: { first: "Eliza", middles: "J.", last: "Simmons" },
    fullName: "Eliza J. Simmons",
    _id: "5",
  },
] as unknown as IPerson[];

describe("DirectoryPage", () => {
  const mockedResponse: AxiosResponse = {
    data: mockPeople,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {},
  };

  it("renders the directory page with the mocked data", async () => {
    mockedAxios.get.mockResolvedValue(mockedResponse);
    renderWithRouter(<DirectoryPage />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("profile-collection")).toBeTruthy();
    expect(screen.getByTestId("profile-collection").childElementCount).toBe(6);

    expect(screen.getByText("John H. Jackson")).toBeTruthy();
    expect(screen.getByText("Mary Jones")).toBeTruthy();
    expect(screen.getByText("Harold Hesketh")).toBeTruthy();
    expect(screen.getByText("May Heywood")).toBeTruthy();
    expect(screen.getByText("Eliza C. Tonks")).toBeTruthy();
    expect(screen.getByText("Eliza J. Simmons")).toBeTruthy();
  });

  it("Routes to '/profile/:id' when ProfileCard is clicked", async () => {
    const mockedResponse: AxiosResponse = {
      data: [
        {
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
        },
      ],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };

    mockedAxios.get.mockResolvedValue(mockedResponse);
    const { history } = renderWithRouter(<DirectoryPage />);
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId("profile-card-target"));
    expect(history.location.pathname).toBe("/profile/0");
  });

  it("renders Server Error when there is a server error", async () => {
    const mockedResponse: AxiosResponse = {
      data: undefined,
      status: 500,
      statusText: "",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValue(mockedResponse);

    renderWithRouter(<DirectoryPage />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Server Error")).toBeTruthy();
  });

  it("renders loading spinner before axios request completes", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    renderWithRouter(<DirectoryPage />);

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });

  it("Filters people by search term", async () => {
    mockedAxios.get.mockResolvedValue(mockedResponse);
    renderWithRouter(<DirectoryPage />);

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText("search"), {
      target: { value: "i" },
    });

    expect(screen.getByTestId("profile-collection")).toBeTruthy();
    expect(screen.getByTestId("profile-collection").childElementCount).toBe(2);

    expect(screen.getByText("Eliza C. Tonks")).toBeTruthy();
    expect(screen.getByText("Eliza J. Simmons")).toBeTruthy();
    expect(() => screen.getByText("John H. Jackson")).toThrow();
    expect(() => screen.getByText("Mary Jones")).toThrow();
    expect(() => screen.getByText("Harold Hesketh")).toThrow();
    expect(() => screen.getByText("May Heywood")).toThrow();
  });
});

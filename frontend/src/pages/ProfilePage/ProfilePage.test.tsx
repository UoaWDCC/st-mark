import React from "react";
import { Route } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import renderWithRouter from "../../utils/renderWithRouter";
import IndividualProfilePage from "./index";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedResponse: AxiosResponse = {
  data: {
    name: { first: "Tupac", last: "Shakur" },
    plotMembers: [],
    biography: "",
    images: [],
    anecdotes: [],
    links: [],
  },
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
};

describe("ProfilePage", () => {
  it("makes a request to /person/{id} when rendering", async () => {
    const id = "mockID1234";

    mockedAxios.get.mockResolvedValue(mockedResponse);

    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/person/${id}`);
  });

  it("renders only the biography panel when selected", async () => {
    mockedAxios.get.mockResolvedValue(mockedResponse);

    const id = "mockID1234";
    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    act(() => {
      fireEvent.click(screen.getByTestId("biography-tab"));
    });

    expect(screen.queryByTestId("biography")).toBeTruthy();
    expect(screen.queryByTestId("images")).toBeFalsy();
    expect(screen.queryByTestId("anecdotes")).toBeFalsy();
    expect(screen.queryByTestId("links")).toBeFalsy();
  });

  it("renders only the images panel when selected", async () => {
    mockedAxios.get.mockResolvedValue(mockedResponse);

    const id = "mockID1234";
    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    act(() => {
      fireEvent.click(screen.getByTestId("images-tab"));
    });

    expect(screen.queryByTestId("biography")).toBeFalsy();
    expect(screen.queryByTestId("images")).toBeTruthy();
    expect(screen.queryByTestId("anecdotes")).toBeFalsy();
    expect(screen.queryByTestId("links")).toBeFalsy();
  });

  it("renders only the anecdotes panel when selected", async () => {
    mockedAxios.get.mockResolvedValue(mockedResponse);

    const id = "mockID1234";
    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    act(() => {
      fireEvent.click(screen.getByTestId("anecdotes-tab"));
    });

    expect(screen.queryByTestId("biography")).toBeFalsy();
    expect(screen.queryByTestId("images")).toBeFalsy();
    expect(screen.queryByTestId("anecdotes")).toBeTruthy();
    expect(screen.queryByTestId("links")).toBeFalsy();
  });

  it("renders only the links panel when selected", async () => {
    mockedAxios.get.mockResolvedValue(mockedResponse);

    const id = "mockID1234";
    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    act(() => {
      fireEvent.click(screen.getByTestId("links-tab"));
    });

    expect(screen.queryByTestId("biography")).toBeFalsy();
    expect(screen.queryByTestId("images")).toBeFalsy();
    expect(screen.queryByTestId("anecdotes")).toBeFalsy();
    expect(screen.queryByTestId("links")).toBeTruthy();
  });

  it("renders Not Found when no profile is found", async () => {
    const id = "mockID1234";
    const mockedResponse: AxiosResponse = {
      data: undefined,
      status: 404,
      statusText: "Not Found",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValue(mockedResponse);

    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Profile Not Found")).toBeTruthy();
  });

  it("renders Server Error when there is a server error", async () => {
    const id = "mockID1234";
    const mockedResponse: AxiosResponse = {
      data: undefined,
      status: 500,
      statusText: "",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValue(mockedResponse);

    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Server Error")).toBeTruthy();
  });

  it("renders loading spinner before axios request completes", async () => {
    mockedAxios.get.mockResolvedValue({ data: undefined });

    const id = "mockID1234";
    renderWithRouter(
      <Route path="/:id">
        <IndividualProfilePage />
      </Route>,
      `/${id}`
    );

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });
});

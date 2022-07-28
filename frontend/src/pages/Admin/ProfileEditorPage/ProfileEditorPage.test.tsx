import React from "react";
import { Route } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import ProfileEditorPage from "./index";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProfileEditorPage", () => {
  it("makes a request to /person/{id} when rendering", async () => {
    const id = "mockID1234";
    const mockedResponse: AxiosResponse = {
      data: {
        name: { first: "Tupac", last: "Shakur" },
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.get.mockResolvedValueOnce(mockedResponse); // get person response
    mockedAxios.get.mockResolvedValueOnce({ data: [] }); // get plots response

    renderWithRouter(
      <Route path="/:id">
        <ProfileEditorPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/person/${id}`);
  });

  it("Renders a delete confirmation modal when Delete Selected button is clicked", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValueOnce({
      data: { name: { last: "Wills" } },
    }); // get person response
    mockedAxios.get.mockResolvedValueOnce({ data: [] }); // get plots response

    renderWithRouter(
      <Route path="/:id">
        <ProfileEditorPage />
      </Route>,
      `/${id}`
    );
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByTestId("delete-profile-button"));

    expect(screen.getByTestId("modal-confirm-button")).toBeTruthy();
    // One delete button associated with display-image and another
    // associated with the modal which appears when the `Delete Profile` button is clicked on
    expect(screen.getAllByText("Delete")).toHaveLength(2);
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
        <ProfileEditorPage />
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
        <ProfileEditorPage />
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
        <ProfileEditorPage />
      </Route>,
      `/${id}`
    );

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });
});

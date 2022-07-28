import React from "react";
import { screen, waitFor } from "@testing-library/react";
import renderWithRouter from "../../utils/renderWithRouter";
import SubmissionPage from "./index";
import axios, { AxiosResponse } from "axios";
import { Route } from "react-router-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedResponseWithoutPlot: AxiosResponse = {
  data: {
    _id: "6139af218be53e786b45d9f3",
    name: { first: "Mezzanine", last: "Silva" },
    fullName: "Mezzanine Silva",
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

const mockedResponseWithPlot: AxiosResponse = {
  data: {
    _id: "6139af218be53e786b45d9f3",
    name: { first: "Mezzanine", last: "Silva" },
    fullName: "Mezzanine Silva",
    plotMembers: [],
    biography: "",
    images: [],
    anecdotes: [],
    links: [],
    plot: {
      _id: "6139af218be53e786b45d9f3",
      plotNumber: 223,
      registeredName: "Silva",
      buried: [],
    },
  },
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
};

describe("SubmissionPage", () => {
  it("makes a request to /person/{id} when rendering", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithoutPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/person/${id}`);
  });

  it("Renders the submission description correctly", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithoutPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("submission-description")).toBeTruthy();
    expect(screen.getByText("Contributing to this project")).toBeTruthy();
    expect(
      screen.getByText(
        "It is important to note that any information you provide will be used for the public to view."
      )
    ).toBeTruthy();
  });

  it("Renders all elements of form", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithoutPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("submitter-name")).toBeTruthy();
    expect(screen.getByTestId("submitter-email")).toBeTruthy();
    expect(screen.getByTestId("changes-suggested-for")).toBeTruthy();
    expect(screen.getByTestId("at-plot")).toBeTruthy();
    expect(screen.getByTestId("change-suggestions")).toBeTruthy();
    expect(screen.getByTestId("captcha")).toBeTruthy();
  });

  it("Shows the name of the person for whom changes are being suggested", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithoutPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Mezzanine Silva")).toBeTruthy();
  });

  it("Shows the plot to be `Unknown` when it is unknown", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithoutPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Unknown")).toBeTruthy();
  });

  it("Shows the plot number and registered name when it is known", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("223 - Silva")).toBeTruthy();
  });

  it("Disables the Submit button by default", async () => {
    const id = "mockID1234";
    mockedAxios.get.mockResolvedValue(mockedResponseWithoutPlot);

    renderWithRouter(
      <Route path="/:id">
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText("Submit").closest("button")).toBeDisabled();
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
        <SubmissionPage />
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
        <SubmissionPage />
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
        <SubmissionPage />
      </Route>,
      `/${id}`
    );

    expect(screen.getByTestId("loading-spinner")).toBeTruthy();
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });
});

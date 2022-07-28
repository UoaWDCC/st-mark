import React from "react";
import axios, { AxiosResponse } from "axios";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPersonAll } from "../../../../types/schema";
import DisplayImageEditor from "./index";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => {
    return {
      getAccessTokenSilently: jest.fn(() => "mockToken"),
    };
  },
}));

global.URL.createObjectURL = jest.fn();

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const defaultImageUrl = "/images/default-dp.png";
const mockImageUrl = "testImageUrl";

const mockPersonWithImage = {
  _id: "1234",
  name: {
    last: "King",
  },
  displayImage: { _id: "displayImageId", url: mockImageUrl },
} as unknown as IPersonAll;

const mockPersonWithoutImage = {
  _id: "1234",
  name: {
    last: "Queen",
  },
} as unknown as IPersonAll;

describe("DisplayImageEditor", () => {
  it("renders the user's image if they have one", () => {
    renderWithRouter(
      <DisplayImageEditor person={mockPersonWithImage} onSave={jest.fn()} />
    );

    expect(screen.getByRole("img")).toHaveAttribute("src", mockImageUrl);
    expect(screen.getByTestId("save-image-button")).toBeDisabled();
    expect(screen.getByTestId("delete-image-button")).not.toBeDisabled();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("renders the default image if they don't provide one", () => {
    renderWithRouter(
      <DisplayImageEditor person={mockPersonWithoutImage} onSave={jest.fn()} />
    );

    expect(screen.getByRole("img")).toHaveAttribute("src", defaultImageUrl);
    expect(screen.getByTestId("save-image-button")).toBeDisabled();
    expect(screen.getByTestId("delete-image-button")).toBeDisabled();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("renders an input image on upload", () => {
    global.URL.createObjectURL = jest.fn(() => "newImage");

    renderWithRouter(
      <DisplayImageEditor person={mockPersonWithoutImage} onSave={jest.fn()} />
    );

    // mocks the change in event for uploading an image
    fireEvent.change(screen.getByTestId("upload-image-input"), {
      target: {
        files: ["newImage"],
      },
    });

    expect(screen.getByRole("img")).toHaveAttribute("src", "newImage");
    expect(screen.getByTestId("save-image-button")).not.toBeDisabled();
    expect(screen.getByTestId("delete-image-button")).not.toBeDisabled();
  });

  it("pressing save button changes the image", async () => {
    const newImage = "newImage";
    const mockedResponse: AxiosResponse = {
      data: {
        url: newImage,
      },
      status: 201,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.post.mockResolvedValueOnce(mockedResponse);
    global.URL.createObjectURL = jest.fn(() => "newImage");

    renderWithRouter(
      <DisplayImageEditor person={mockPersonWithoutImage} onSave={jest.fn()} />
    );

    // mocks the change in event for uploading an image
    fireEvent.change(screen.getByTestId("upload-image-input"), {
      target: {
        files: [newImage],
      },
    });

    expect(screen.getByRole("img")).toHaveAttribute("src", newImage);
    expect(screen.getByText("Cancel")).toBeTruthy();

    fireEvent.click(screen.getByTestId("save-image-button"));

    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("img")).toHaveAttribute("src", newImage);
    expect(screen.getByTestId("save-image-button")).toBeDisabled();
    expect(screen.getByTestId("delete-image-button")).not.toBeDisabled();
  });

  it("pressing cancel button changes the image back", async () => {
    const newImage = "newImage";
    const mockedResponse: AxiosResponse = {
      data: {
        url: newImage,
      },
      status: 201,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.post.mockResolvedValueOnce(mockedResponse);
    global.URL.createObjectURL = jest.fn(() => "newImage");

    renderWithRouter(
      <DisplayImageEditor person={mockPersonWithImage} onSave={jest.fn()} />
    );

    // mocks the change in event for uploading an image
    fireEvent.change(screen.getByTestId("upload-image-input"), {
      target: {
        files: [newImage],
      },
    });

    expect(screen.getByRole("img")).toHaveAttribute("src", newImage);
    expect(screen.getByText("Cancel")).toBeTruthy();

    fireEvent.click(screen.getByTestId("delete-image-button"));

    expect(screen.getByRole("img")).toHaveAttribute("src", mockImageUrl);
    expect(screen.getByTestId("save-image-button")).toBeDisabled();
    expect(screen.getByTestId("delete-image-button")).not.toBeDisabled();
  });

  it("pressing delete button changes the image back to default image", async () => {
    const mockedResponse: AxiosResponse = {
      data: {},
      status: 204,
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.delete.mockResolvedValueOnce(mockedResponse);

    renderWithRouter(
      <DisplayImageEditor person={mockPersonWithImage} onSave={jest.fn()} />
    );

    expect(screen.getByRole("img")).toHaveAttribute("src", mockImageUrl);
    expect(screen.getByText("Delete")).toBeTruthy();

    fireEvent.click(screen.getByTestId("delete-image-button"));
    fireEvent.click(screen.getByTestId("modal-confirm-button"));

    await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalledTimes(1));

    expect(screen.getByRole("img")).toHaveAttribute("src", defaultImageUrl);
    expect(screen.getByTestId("save-image-button")).toBeDisabled();
    expect(screen.getByTestId("delete-image-button")).toBeDisabled();
  });
});

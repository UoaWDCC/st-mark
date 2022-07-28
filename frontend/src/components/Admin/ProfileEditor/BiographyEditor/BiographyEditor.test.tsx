import React from "react";
import axios, { AxiosResponse } from "axios";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPersonAll } from "../../../../types/schema";
import BiographyEditor from "./index";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => {
    return {
      getAccessTokenSilently: jest.fn(() => "mockToken"),
    };
  },
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPerson = {
  _id: "1234",
  name: {
    first: "John",
    last: "Bob",
  },
  fullName: "John Bob",
  biography: "This guy has 2 first names.",
} as unknown as IPersonAll;

describe("BiographyEditor", () => {
  it("Populates text fields with given biography", () => {
    renderWithRouter(
      <BiographyEditor person={mockPerson} onSave={jest.fn()} />
    );
    expect(
      screen.getByDisplayValue("This guy has 2 first names.")
    ).toBeTruthy();
  });

  it("Makes PATCH request with new content when user makes changes", async () => {
    const mockedResponse: AxiosResponse = {
      status: 200,
      data: {},
      statusText: "OK",
      headers: {},
      config: {},
    };
    mockedAxios.patch.mockResolvedValue(mockedResponse);

    const handleSave = jest.fn();

    renderWithRouter(
      <BiographyEditor person={mockPerson} onSave={handleSave} />
    );

    const textField = screen.getByLabelText("biography-field");
    fireEvent.change(textField, {
      target: { value: "He really has 2 first names!!!" },
    });

    const saveButton = screen.getByLabelText("biography-save");
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockedAxios.patch).toHaveBeenCalledTimes(1));
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      "/api/person/1234",
      {
        biography: "He really has 2 first names!!!",
      },
      { headers: { Authorization: "Bearer mockToken" } }
    );

    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});

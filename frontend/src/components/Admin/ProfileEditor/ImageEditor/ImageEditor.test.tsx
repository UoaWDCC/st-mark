import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPersonAll } from "../../../../types/schema";
import ImageEditor from "./index";

global.URL.createObjectURL = jest.fn();
const mockImageUrl1 = "testImageUrl1";
const mockImageUrl2 = "testImageUrl2";

const mockPersonWithImages = {
  _id: "1234",
  name: {
    last: "King",
  },
  images: [
    { _id: "image1", url: mockImageUrl1 },
    { _id: "image2", url: mockImageUrl2 },
  ],
} as unknown as IPersonAll;

const mockPersonWithoutImages = {
  _id: "1234",
  name: {
    last: "Queen",
  },
} as unknown as IPersonAll;

const mockSave = jest.fn();
const mockUpdate = jest.fn();

describe("ImageEditor", () => {
  it("renders the user's images if they have one", () => {
    renderWithRouter(
      <ImageEditor
        person={mockPersonWithImages}
        onSave={mockSave}
        updatePerson={mockUpdate}
      />
    );

    expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", mockImageUrl1);
    expect(screen.getAllByRole("img")[1]).toHaveAttribute("src", mockImageUrl2);
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("renders the default text if they don't have any images", () => {
    renderWithRouter(
      <ImageEditor
        person={mockPersonWithoutImages}
        onSave={mockSave}
        updatePerson={mockUpdate}
      />
    );

    expect(screen.getByText("No images found.")).toBeTruthy();
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

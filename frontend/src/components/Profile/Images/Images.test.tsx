import React from "react";
import { render, screen } from "@testing-library/react";
import { IPersonAll } from "../../../types/schema";
import { Images } from "./index";

const altMessage = "Sorry, no images available.";

const mockPersonWithImages = {
  images: [
    {
      _id: 1,
      url: "a",
    },
    {
      _id: 2,
      url: "b",
    },
  ],
} as unknown as IPersonAll;

const mockPersonWithoutImages = { images: [] } as unknown as IPersonAll;
const { images } = mockPersonWithImages;
const { images: noImages } = mockPersonWithoutImages;

describe("Images", () => {
  it("displays the images when they are supplied", () => {
    render(<Images images={images} showTitle={false} />);
    expect(screen.getByTestId("image-0")).toBeTruthy();
    expect(screen.getByTestId("image-1")).toBeTruthy();
  });

  it("displays alt message when images are not supplied", () => {
    render(<Images images={noImages} showTitle={false} />);
    expect(screen.getByText(altMessage)).toBeTruthy();
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { IPersonAll } from "../../../types/schema";
import { Biography } from "./index";

const altMessage = "Sorry, no biography available.";

const mockPersonWithBiography = {
  biography: "This is my biography",
} as unknown as IPersonAll;

const mockPersonWithoutBiography = {} as unknown as IPersonAll;

const mockPersonWithEmptyBiography = {
  biography: "",
} as unknown as IPersonAll;

const { biography } = mockPersonWithBiography;
const { biography: noBiography } = mockPersonWithoutBiography;
const { biography: emptyBiography } = mockPersonWithEmptyBiography;

describe("Biography", () => {
  it("displays the biography when it is supplied", () => {
    render(<Biography biography={biography} showTitle={false} />);
    expect(screen.getByText("This is my biography")).toBeTruthy();
  });

  it("displays alt message when biography is not supplied", () => {
    render(<Biography biography={noBiography} showTitle={false} />);
    expect(screen.getByText(altMessage)).toBeTruthy();
  });

  it("displays alt message when biography is an empty string", () => {
    render(<Biography biography={emptyBiography} showTitle={false} />);
    expect(screen.getByText(altMessage)).toBeTruthy();
  });
});

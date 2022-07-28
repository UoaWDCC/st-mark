import React from "react";
import { render, screen } from "@testing-library/react";
import { IPersonAll } from "../../../types/schema";
import { Links } from "./index";

const altMessage = "Sorry, no links available.";

const mockPersonWithLinks = {
  links: [{ title: "title", url: "https://google.com" }],
} as unknown as IPersonAll;

const mockPersonWithoutLinks = { links: [] } as unknown as IPersonAll;
const { links } = mockPersonWithLinks;
const { links: noLinks } = mockPersonWithoutLinks;

describe("Links", () => {
  it("displays the links when they are supplied", () => {
    render(<Links links={links} showTitle={false} />);
    expect(screen.getByText("title")).toBeTruthy();
  });

  it("displays alt message when links are not supplied", () => {
    render(<Links links={noLinks} showTitle={false} />);
    expect(screen.getByText(altMessage)).toBeTruthy();
  });
});

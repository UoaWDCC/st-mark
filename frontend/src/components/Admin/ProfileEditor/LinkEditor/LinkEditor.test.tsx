import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPersonAll } from "../../../../types/schema";
import LinkEditor from "./index";

const mockPerson = {
  _id: "1234",
  name: {
    last: "Bobbo",
  },
  links: [
    { _id: "link1ID", title: "Link1", url: "link.1" },
    { _id: "link2ID", title: "Link2", url: "link.2" },
    { _id: "link3ID", title: "Link3", url: "link.2" },
  ],
} as unknown as IPersonAll;

const mockCallback = jest.fn();

describe("LinkEditor", () => {
  it("Populates list with person's links when rendered", () => {
    renderWithRouter(
      <LinkEditor
        person={mockPerson}
        onSave={mockCallback}
        updatePerson={mockCallback}
      />
    );
    mockPerson.links.forEach((link) => {
      expect(screen.getByTestId(`link-${link._id}`)).toBeTruthy();
    });
  });
});

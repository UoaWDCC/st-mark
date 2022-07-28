import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../../../../utils/renderWithRouter";
import { IPersonAll } from "../../../../types/schema";
import AnecdoteEditor from "./index";

const mockPerson = {
  _id: "1234",
  name: {
    last: "Bobbo",
  },
  anecdotes: [
    { _id: "anecdote1ID", content: "This is the first anecdote" },
    { _id: "anecdote2ID", content: "This is the second anecdote" },
    { _id: "anecdote3ID", content: "This is the third anecdote" },
  ],
} as unknown as IPersonAll;

const mockCallback = jest.fn();

describe("AnecdoteEditor", () => {
  it("Populates list with person's anecdotes when rendered", () => {
    renderWithRouter(
      <AnecdoteEditor
        person={mockPerson}
        onSave={mockCallback}
        updatePerson={mockCallback}
      />
    );
    mockPerson.anecdotes.forEach((anecdote) => {
      expect(screen.getByTestId(`anecdote-${anecdote._id}`)).toBeTruthy();
    });
  });
});

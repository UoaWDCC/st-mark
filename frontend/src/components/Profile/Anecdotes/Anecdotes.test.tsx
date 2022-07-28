import React from "react";
import { render, screen } from "@testing-library/react";
import { IPersonAll } from "../../../types/schema";
import { Anecdotes } from "./index";

const altMessage = "Sorry, no anecdotes available.";

const mockPersonWithAnecdotes = {
  anecdotes: [{ content: "anecdote1" }],
} as unknown as IPersonAll;

const mockPersonWithoutAnecdotes = {
  anecdotes: [],
} as unknown as IPersonAll;

const { anecdotes } = mockPersonWithAnecdotes;
const { anecdotes: noAnecdotes } = mockPersonWithoutAnecdotes;

describe("Anecdotes", () => {
  it("displays the links when they are supplied", () => {
    render(<Anecdotes anecdotes={anecdotes} showTitle={false} />);
    expect(screen.getByText("anecdote1")).toBeTruthy();
  });

  it("displays alt message when links are not supplied", () => {
    render(<Anecdotes anecdotes={noAnecdotes} showTitle={false} />);
    expect(screen.getByText(altMessage)).toBeTruthy();
  });
});

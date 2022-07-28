import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import renderWithRouter from "../../../utils/renderWithRouter";
import Error from "./index";

describe("Error", () => {
  it("Display messages are passed in properly", () => {
    renderWithRouter(
      <Error
        message={{
          title: "some title",
          message: "this is a message",
        }}
        director={{
          url: "/some",
          prompt: "some prompt",
        }}
      />
    );
    expect(screen.getByText("some title")).toBeTruthy();
    expect(screen.getByText("this is a message")).toBeTruthy();
    expect(screen.getByTestId("url-redirect")).toBeTruthy();
    expect(screen.getByText("some prompt")).toBeTruthy();
  });

  it("Can renders when only a message is passed", () => {
    renderWithRouter(
      <Error
        message={{
          title: "Some Title",
          message: "This is a message",
        }}
      />
    );
    expect(screen.getByText("Some Title")).toBeTruthy();
    expect(screen.getByText("This is a message")).toBeTruthy();
    expect(screen.queryByTestId("url-redirect")).not.toBeInTheDocument();
  });

  it("click the A element redirects you to the specified URL", () => {
    const { history } = renderWithRouter(
      <Error
        message={{
          title: "",
          message: "",
        }}
        director={{
          url: "/some-url",
          prompt: "Some prompt",
        }}
      />
    );

    fireEvent.click(screen.getByText("Some prompt"));
    expect(history.location.pathname).toBe("/some-url");
  });
});

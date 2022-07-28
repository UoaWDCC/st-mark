import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateLinkModal from "./index";

describe("CreateLinkModal", () => {
  it("Calls onClose when cancel button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <CreateLinkModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledTimes(0);
  });

  it("Does not call onConfirm if confirm button is clicked before entering data", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <CreateLinkModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByTestId("confirm-button"));
    expect(handleConfirm).toHaveBeenCalledTimes(0);
  });

  it("Calls onConfirm after entering data and clicking confirm", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <CreateLinkModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    fireEvent.change(screen.getByTestId("title-field"), {
      target: { value: "Cool Math Games" },
    });
    fireEvent.change(screen.getByTestId("url-field"), {
      target: { value: "www.coolmathgames.com" },
    });

    fireEvent.click(screen.getByTestId("confirm-button"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledWith(
      "Cool Math Games",
      "www.coolmathgames.com"
    );
  });
});

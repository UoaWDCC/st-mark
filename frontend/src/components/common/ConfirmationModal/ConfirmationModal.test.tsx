import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmationModal from "./index";

describe("ConfirmationModal", () => {
  it("Shows the provided message", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <ConfirmationModal
        message="yee haw"
        confirmButtonText="Confirm"
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    expect(screen.getByText("yee haw")).toBeTruthy();
  });

  it("Correctly renders the confirmation modal with the provided submit button text", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <ConfirmationModal
        open={true}
        confirmButtonText="Delete"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    expect(screen.getByTestId("modal-confirm-button")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("Calls onClose when cancel button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <ConfirmationModal
        open={true}
        confirmButtonText="Confirm"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledTimes(0);
  });

  it("Calls onConfirm when confirm button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <ConfirmationModal
        open={true}
        confirmButtonText="Confirm"
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    fireEvent.click(screen.getByTestId("modal-confirm-button"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});

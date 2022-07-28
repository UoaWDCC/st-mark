import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddImageModal from "./index";
import { act } from "react-dom/test-utils";

const newImage1 = "newImage1";
const newImage2 = "newImage2";

describe("AddImageModal", () => {
  it("Calls onClose when cancel button is clicked", async () => {
    const promise = Promise.resolve();
    const handleConfirm = jest.fn(() => promise);
    const handleClose = jest.fn();

    render(
      <AddImageModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId("add-image-modal-button")).toBeEnabled();
    expect(screen.getByTestId("cancel-button")).toBeEnabled();

    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledTimes(0);

    await act(() => promise);
  });

  it("Does not call onConfirm if confirm button is clicked before entering data", async () => {
    const promise = Promise.resolve();
    const handleConfirm = jest.fn(() => promise);
    const handleClose = jest.fn();

    render(
      <AddImageModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId("add-image-modal-button")).toBeEnabled();
    expect(screen.getByTestId("confirm-button")).toBeDisabled();
    expect(screen.getByTestId("cancel-button")).toBeEnabled();

    fireEvent.click(screen.getByTestId("confirm-button"));
    expect(handleConfirm).toHaveBeenCalledTimes(0);

    await act(() => promise);
  });

  it("Calls onConfirm after adding images and clicking confirm", async () => {
    const promise = Promise.resolve();
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <AddImageModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );

    // mocks the change in event for uploading an image
    fireEvent.change(screen.getByTestId("add-image-modal-input"), {
      target: {
        files: [newImage1, newImage2],
      },
    });

    expect(screen.getByTestId("uploaded-image-0")).toBeTruthy();
    expect(screen.getByTestId("uploaded-image-1")).toBeTruthy();
    expect(screen.getByTestId("confirm-button")).toBeEnabled();
    expect(screen.getByTestId("cancel-button")).toBeEnabled();

    fireEvent.click(screen.getByTestId("confirm-button"));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledWith([newImage1, newImage2]);

    await act(() => promise);
  });
});

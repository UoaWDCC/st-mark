import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateProfileModal from "./index";

describe("CreateProfileModal", () => {
  it("Calls onClose when cancel button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <CreateProfileModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledTimes(0);
  });

  it("Calls onConfirm when create button is clicked", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();
    const firstName = "Walter";
    const lastName = "Wills";

    const modal = render(
      <CreateProfileModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    fireEvent.change(modal.getByTestId("last-name-field"), {
      target: { value: lastName },
    });
    fireEvent.change(modal.getByTestId("first-name-field"), {
      target: { value: firstName },
    });
    fireEvent.click(screen.getByTestId("create-button"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledWith(firstName, "", lastName);
  });

  it("Disables create button when no last name provided", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();
    const firstName = "Walter";

    const modal = render(
      <CreateProfileModal
        open={true}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    );
    fireEvent.change(modal.getByTestId("first-name-field"), {
      target: { value: firstName },
    });
    fireEvent.click(screen.getByTestId("create-button"));
    expect(screen.getByTestId("create-button")).toBeDisabled();
    expect(handleConfirm).toHaveBeenCalledTimes(0);
    expect(handleClose).toHaveBeenCalledTimes(0);
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SuccessModal from "./index";

describe("SuccessModal", () => {
  it("Shows the provided message", () => {
    const handleClose = jest.fn();

    render(
      <SuccessModal message="yee haw" open={true} onClose={handleClose} />
    );
    expect(screen.getByText("yee haw")).toBeTruthy();
  });

  it("Calls onClose when ok button is clicked", () => {
    const handleClose = jest.fn();

    render(<SuccessModal open={true} onClose={handleClose} />);

    fireEvent.click(screen.getByTestId("ok-button"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

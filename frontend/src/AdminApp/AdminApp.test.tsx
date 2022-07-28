import React from "react";
import { screen } from "@testing-library/react";
import renderWithRouter from "../utils/renderWithRouter";
import AdminApp from "./index";

jest.mock("../pages/Admin/ProfilesPage");
jest.mock("../pages/Admin/ProfileEditorPage");

describe("AdminApp", () => {
  it("Displays ProfilesPage when route is '/admin'", () => {
    renderWithRouter(<AdminApp />, "/admin");

    expect(screen.getByTestId("profiles-page")).toBeTruthy();
  });

  it("Displays ProfileEditorPage when route is '/admin/edit/profile/:id'", () => {
    renderWithRouter(<AdminApp />, "/admin/edit/profile/testid1234");

    expect(screen.getByTestId("profile-editor-page")).toBeTruthy();
  });
});

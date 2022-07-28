import { getFullName } from "../getFullName";

describe("getFullName", () => {
  it("returns full name when all name fields supplied", () => {
    expect(
      getFullName({ first: "Eliza", middles: "Louise Grey", last: "Kelly" })
    ).toBe("Eliza Louise Grey Kelly");
  });

  it("returns only last name when supplied", () => {
    expect(getFullName({ last: "Kelly" })).toBe("Kelly");
  });

  it("returns only middle and last names when supplied", () => {
    expect(getFullName({ middles: "Louise Grey", last: "Kelly" })).toBe(
      "Louise Grey Kelly"
    );
  });

  it("returns only first and last names when supplied", () => {
    expect(getFullName({ first: "Eliza", last: "Kelly" })).toBe("Eliza Kelly");
  });
});

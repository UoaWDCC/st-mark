import { getValidLink } from "../links";

describe("links", () => {
  describe("getValidLink", () => {
    it("returns the same, unchanged link if input already has http:// prefix", () => {
      expect(getValidLink("http://www.google.com")).toBe(
        "http://www.google.com"
      );
    });
    it("returns the same, unchanged link if input already has https:// prefix", () => {
      expect(getValidLink("https://www.google.com")).toBe(
        "https://www.google.com"
      );
    });
    it("returns the same link with an added http:// prefix if the input does not have such a prefix already", () => {
      expect(getValidLink("www.google.com")).toBe("http://www.google.com");
    });
  });
});

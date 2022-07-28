import { IPerson } from "../../types/schema";
import { filterPeopleByFullName } from "../filter";

export const mockPeople: IPerson[] = [
  { fullName: "John H. Jackson" },
  { fullName: "Mary Jones" },
  { fullName: "Harold Hesketh" },
  { fullName: "May Heywood" },
  { fullName: "Eliza C. Tonks" },
  { fullName: "Eliza J. Simmons" },
] as unknown as IPerson[];

describe("filter", () => {
  describe("filterPeopleByFullName()", () => {
    it("test with no search term", () => {
      const searchTerm = "";
      const result = filterPeopleByFullName(mockPeople, searchTerm);
      expect(result).toHaveLength(6);

      expect(result[0].fullName).toBe("John H. Jackson");
      expect(result[1].fullName).toBe("Mary Jones");
      expect(result[2].fullName).toBe("Harold Hesketh");
      expect(result[3].fullName).toBe("May Heywood");
      expect(result[4].fullName).toBe("Eliza C. Tonks");
      expect(result[5].fullName).toBe("Eliza J. Simmons");
    });

    it("test with no search result", () => {
      const searchTerm = "pp";
      const result = filterPeopleByFullName(mockPeople, searchTerm);
      expect(result).toHaveLength(0);
    });

    it("test with some search result hit", () => {
      const searchTerm = "i";
      const result = filterPeopleByFullName(mockPeople, searchTerm);
      expect(result).toHaveLength(2);

      expect(result[0].fullName).toBe("Eliza C. Tonks");
      expect(result[1].fullName).toBe("Eliza J. Simmons");
    });

    it("test for case insensitivity", () => {
      const searchTerm = "john h. jackson";
      const result = filterPeopleByFullName(mockPeople, searchTerm);
      expect(result).toHaveLength(1);

      expect(result[0].fullName).toBe("John H. Jackson");
    });
  });
});

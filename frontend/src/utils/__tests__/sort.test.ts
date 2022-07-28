import { IPerson } from "../../types/schema";
import { sortPeopleByFullName } from "../sort";

export const mockPeople: IPerson[] = [
  { fullName: "John H. Jackson" },
  { fullName: "Mary Jones" },
  { fullName: "Harold Hesketh" },
  { fullName: "May Heywood" },
  { fullName: "Eliza C. Tonks" },
  { fullName: "Eliza J. Simmons" },
] as unknown as IPerson[];

describe("sort", () => {
  describe("sortPeopleByFullName()", () => {
    it("Sorts people by full name in place", () => {
      const people = mockPeople;

      sortPeopleByFullName(people);

      expect(people[0].fullName).toBe("Eliza C. Tonks");
      expect(people[1].fullName).toBe("Eliza J. Simmons");
      expect(people[2].fullName).toBe("Harold Hesketh");
      expect(people[3].fullName).toBe("John H. Jackson");
      expect(people[4].fullName).toBe("Mary Jones");
      expect(people[5].fullName).toBe("May Heywood");
    });
  });
});

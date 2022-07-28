import { IPerson } from "../../types/schema";
import { filterPeopleByFullName, filterPeopleByDeathDate } from "../filter";

export const mockPeople: IPerson[] = [
  {
    fullName: "John H. Jackson",
    dateOfDeath: {
      year: 1850,
      month: 7,
      day: 12
    },
  },
  {
    fullName: "Mary Jones",
    dateOfDeath: {
      day: 10,
      month: 6,
      year: 1919
    },
  },
  {
    fullName: "Harold Hesketh",
    dateOfDeath: {
      year: 1862,
      month: 12
    }
  },
  {
    fullName: "May Heywood",
    dateOfDeath: {
      year: 1862,
    }

  },
  {
    fullName: "Eliza C. Tonks",
    dateOfDeath: {
      year: 1862,
      month: 12
    }
  },
  {
    fullName: "Eliza J. Simmons",
    dateOfDeath: {
      year: 1862,
      month: 1,
    }
  },
] as unknown as IPerson[];

describe("filter", () => {


  describe("filterPeopleByDeathDate()", () => {
    it("test with no death date specified", () => {
      const dod = {};
      const result = filterPeopleByDeathDate(mockPeople, dod);
      const expected = mockPeople
      expect(result).toHaveLength(6);
      expect(result[0]).toStrictEqual(expected[0])
      expect(result[1]).toStrictEqual(expected[1])
      expect(result[2]).toStrictEqual(expected[2])
      expect(result[3]).toStrictEqual(expected[3])
      expect(result[4]).toStrictEqual(expected[4])
      expect(result[5]).toStrictEqual(expected[5])
    });

    it("test with some existing dod", () => {
      const dod = {
        day: 10,
        year: 1919,
        month: 6,
      }

      const result = filterPeopleByDeathDate(mockPeople, dod)
      expect(result).toHaveLength(1)
      expect(result[0].dateOfDeath).toStrictEqual({ year: 1919, day: 10, month: 6, })
    })

    it("test with some existing dod (month & year only)", () => {
      const dod = {
        month: 12,
        year: 1862,
      }

      const expected = [{
        fullName: "Harold Hesketh",
        dateOfDeath: {
          year: 1862,
          month: 12
        }
      },
      {
        fullName: "Eliza C. Tonks",
        dateOfDeath: {
          year: 1862,
          month: 12
        }
      },

      ]
      const result = filterPeopleByDeathDate(mockPeople, dod)
      expect(result).toHaveLength(2)
      expect(result).toStrictEqual(expect.arrayContaining(expected))
    })

    it("test with some existing dod (year only)", () => {
      const dod = {
        year: 1862,
      }

      const expected = [
        {
          fullName: "Harold Hesketh",
          dateOfDeath: {
            year: 1862,
            month: 12
          }
        },
        {
          fullName: "Eliza C. Tonks",
          dateOfDeath: {
            year: 1862,
            month: 12
          }

        },
        {
          fullName: "Eliza J. Simmons",
          dateOfDeath: {
            year: 1862,
            month: 1,
          }

        },
        {
          fullName: "May Heywood",
          dateOfDeath: {
            year: 1862,
          }
        }
      ]

      const result = filterPeopleByDeathDate(mockPeople, dod)
      expect(result).toHaveLength(4)
      expect(result).toStrictEqual(expect.arrayContaining(expected))
    })

    it("test with some dod (month only)", () => {
      const dod = {
        month: 12
      }

      const expected = [
        {
          fullName: "Eliza C. Tonks",
          dateOfDeath: {
            year: 1862,
            month: 12
          }
        },
        {
          fullName: "Harold Hesketh",
          dateOfDeath: {
            year: 1862,
            month: 12
          }
        },
      ]

      const result = filterPeopleByDeathDate(mockPeople, dod)
      expect(result).toHaveLength(2)
      expect(result).toStrictEqual(expect.arrayContaining(expected))
    })

    it("test with no matching dod", () => {
      const dod = {
        day: 10,
        month: 2,
        year: 1844,
      }

      const result = filterPeopleByDeathDate(mockPeople, dod)
      expect(result).toHaveLength(0)
    })
  })

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
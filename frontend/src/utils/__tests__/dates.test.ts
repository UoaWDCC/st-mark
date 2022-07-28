import { IDate } from "../../types/schema";
import { dateToString, invalidDate } from "../dates";

describe("dates", () => {
  describe("dateToString", () => {
    it("returns 'Unknown' for an undefined date", () => {
      expect(dateToString(undefined)).toBe("Unknown");
    });

    it("returns '' for an undefined date if adminTable flag set true", () => {
      expect(dateToString(undefined, true)).toBe("");
    });

    it("returns 'Unknown' if there is no year", () => {
      const date = {
        month: 4,
        day: 20,
      };
      expect(dateToString(date)).toBe("Unknown");
    });

    it("returns '' if there is no year and adminTable flag set true", () => {
      const date = {
        month: 4,
        day: 20,
      };
      expect(dateToString(date, true)).toBe("");
    });

    it("returns the year if only the year is supplied", () => {
      const date = {
        year: 1969,
      };
      expect(dateToString(date)).toBe("1969");
    });

    it("returns the month and year only if there is no day", () => {
      const date = {
        year: 1969,
        month: 4,
      };
      expect(dateToString(date)).toBe("Apr 1969");
    });

    it("returns only the year if there is a day with no month", () => {
      const date = {
        year: 1969,
        day: 20,
      };
      expect(dateToString(date)).toBe("1969");
    });

    it("returns the full date if everything is supplied", () => {
      const date = {
        year: 1969,
        month: 4,
        day: 20,
      };
      expect(dateToString(date)).toBe("20 Apr 1969");
    });
  });
});

describe("Date Validation", () => {
  beforeEach(() => {
    Date.now = jest.fn(() => 1617235200000); // 2021-04-01 GMT+1300 (New Zealand Daylight Time)
  });

  // for the dates to be valid, the function must return false
  describe("Defined PopulatedDate validity ", () => {
    it("Test successfully allows two completed allowed dates", () => {
      const dob: IDate = {
        year: 2000,
        month: 1,
        day: 1,
      };

      const dod: IDate = {
        year: 2005,
        month: 1,
        day: 1,
      };
      const result = invalidDate(dob, dod);
      expect(result).toBeFalsy();
    });

    it("Test fails two completed not allowed dates", () => {
      const dob: IDate = {
        year: 2010,
        month: 1,
        day: 1,
      };

      const dod: IDate = {
        year: 2005,
        month: 1,
        day: 1,
      };
      const result = invalidDate(dob, dod);
      expect(result).toBeTruthy();
    });

    it("Test fails two in-the-future dates", () => {
      const dob: IDate = {
        year: 2030,
        month: 1,
        day: 1,
      };

      const dod: IDate = {
        year: 2035,
        month: 1,
        day: 1,
      };
      const result = invalidDate(dob, dod);
      expect(result).toBeTruthy();
    });

    it("Test successfully allows two same dates", () => {
      const dob: IDate = {
        year: 2010,
        month: 1,
        day: 1,
      };

      const dod: IDate = {
        year: 2010,
        month: 1,
        day: 1,
      };
      const result = invalidDate(dob, dod);
      expect(result).toBeFalsy();
    });

    it("Test successfully allows today as a date", () => {
      const dob: IDate = {
        year: 2010,
        month: 1,
        day: 1,
      };

      const dod: IDate = {
        year: 2021,
        month: 4,
        day: 1,
      };
      const result = invalidDate(dob, dod);
      expect(result).toBeFalsy();
    });

    it("Test fails tomorrow as a date", () => {
      const dob: IDate = {
        year: 2010,
        month: 1,
        day: 1,
      };

      const dod: IDate = {
        year: 2021,
        month: 4,
        day: 2,
      };
      const result = invalidDate(dob, dod);
      expect(result).toBeTruthy();
    });
  });

  describe("Undefined Validity", () => {
    it("Test successfully allows two undefined dates", () => {
      const result = invalidDate(undefined, undefined);
      expect(result).toBeFalsy();
    });

    describe("Undefined Years", () => {
      it("Test successfully allows dob and dod with undefined years", () => {
        const dob: IDate = {
          month: 1,
          day: 1,
        };

        const dod: IDate = {
          month: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });

      it("Test successfully allows undefined dod year", () => {
        const dob: IDate = {
          year: 1750,
          month: 1,
          day: 1,
        };

        const dod: IDate = {
          month: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });

      it("Test successfully allows  undefined dob year", () => {
        const dob: IDate = {
          month: 1,
          day: 1,
        };

        const dod: IDate = {
          year: 1750,
          month: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });
    });

    describe("Undefined Months", () => {
      it("Test successfully allows dob and dod with undefined months", () => {
        const dob: IDate = {
          year: 1,
          day: 1,
        };

        const dod: IDate = {
          year: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });

      it("Test successfully allows undefined dod month", () => {
        const dob: IDate = {
          year: 1750,
          month: 1,
          day: 1,
        };

        const dod: IDate = {
          year: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });

      it("Test successfully allows undefined dob month", () => {
        const dob: IDate = {
          year: 1500,
          day: 1,
        };

        const dod: IDate = {
          year: 1750,
          month: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });
    });

    describe("Undefined Days", () => {
      it("Test successfully allows dob and dod with undefined days", () => {
        const dob: IDate = {
          year: 1999,
          month: 5,
        };

        const dod: IDate = {
          year: 2000,
          month: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });

      it("Test successfully allows undefined dod day", () => {
        const dob: IDate = {
          year: 1750,
          month: 4,
          day: 1,
        };

        const dod: IDate = {
          year: 1800,
          month: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });

      it("Test successfully allows undefined dob day", () => {
        const dob: IDate = {
          year: 1750,
          month: 1,
        };

        const dod: IDate = {
          year: 1750,
          month: 1,
          day: 1,
        };
        const result = invalidDate(dob, dod);
        expect(result).toBeFalsy();
      });
    });
  });
});

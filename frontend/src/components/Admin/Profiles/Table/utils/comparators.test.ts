import {
  dateComparator,
  numberComparator,
  stringComparator,
} from "./comparators";
describe("dateComparator", () => {
  it("returns 0 if both dates are undefined", () => {
    const date1 = undefined;
    const date2 = undefined;
    expect(dateComparator(date1, date2)).toBe(0);
  });

  it("returns 0 if both dates are the same", () => {
    const date1 = { year: 1999, month: 12 };
    const date2 = { year: 1999, month: 12 };
    expect(dateComparator(date1, date2)).toBe(0);
  });

  it("sorts date2 above date1 if date1 is undefined", () => {
    const date1 = undefined;
    const date2 = { year: 1999 };
    expect(dateComparator(date1, date2)).toBeGreaterThan(0);
  });

  it("sorts date1 above date2 is date2 is undefined", () => {
    const date1 = { year: 1999 };
    const date2 = undefined;
    expect(dateComparator(date1, date2)).toBeLessThan(0);
  });

  it("sorts date1 above date2 if date1 year is defined and date2 year isn't", () => {
    const date1 = { year: 1866, month: 3 };
    const date2 = { month: 12 };
    expect(dateComparator(date1, date2)).toBeLessThan(0);
  });

  it("sorts date2 above date1 if date2 month is defined and date1 month isn't", () => {
    const date1 = { year: 1850 };
    const date2 = { year: 1850, month: 10 };
    expect(dateComparator(date1, date2)).toBeGreaterThan(0);
  });

  it("sorts date2 above date1 if date2 day is defined and date1 day isn't", () => {
    const date1 = { year: 1850, month: 10 };
    const date2 = { year: 1850, month: 10, day: 3 };
    expect(dateComparator(date1, date2)).toBeGreaterThan(0);
  });

  it("sorts date1 above date2 if date1 year is less than date2 year", () => {
    const date1 = { year: 1848, month: 5 };
    const date2 = { year: 1853, month: 10 };
    expect(dateComparator(date1, date2)).toBeLessThan(0);
  });

  it("sorts date1 above date2 if date1 month is less than date2 month", () => {
    const date1 = { year: 1850, month: 5 };
    const date2 = { year: 1850, month: 10 };
    expect(dateComparator(date1, date2)).toBeLessThan(0);
  });

  it("sorts date1 above date2 if date1 day is less than date2 day", () => {
    const date1 = { year: 1850, month: 10, day: 12 };
    const date2 = { year: 1850, month: 10, day: 24 };
    expect(dateComparator(date1, date2)).toBeLessThan(0);
  });

  it("sorts date2 above date1 if date2 month is less than date2 month, and only month is defined", () => {
    const date1 = { month: 10, day: 12 };
    const date2 = { month: 9, day: 24 };
    expect(dateComparator(date1, date2)).toBeGreaterThan(0);
  });

  it("sorts date1 above date2 if date1 day is less than date1 day, and only day is defined", () => {
    const date1 = { day: 12 };
    const date2 = { day: 24 };
    expect(dateComparator(date1, date2)).toBeLessThan(0);
  });
});

describe("stringComparator", () => {
  it("returns 0 when both strings are undefined", () => {
    expect(stringComparator(undefined, undefined)).toBe(0);
  });

  it("returns 0 when both strings are empty", () => {
    expect(stringComparator("", "")).toBe(0);
  });

  it("returns 0 when both strings are the same", () => {
    expect(stringComparator("Eliza", "Eliza")).toBe(0);
  });

  it("returns 0 when strings are either empty or undefined", () => {
    const string1 = "";
    const string2 = undefined;
    expect(stringComparator(string1, string2)).toBe(0);
  });

  it("sorts string1 above string2 when string2 is undefined", () => {
    const string1 = "Alice";
    const string2 = undefined;
    expect(stringComparator(string1, string2)).toBeLessThan(0);
  });

  it("sorts string2 above string1 when string1 is undefined", () => {
    const string1 = undefined;
    const string2 = "Bob";
    expect(stringComparator(string1, string2)).toBeGreaterThan(0);
  });

  it("sorts string1 above string2 when string1 starts with a", () => {
    const string1 = "Alice";
    const string2 = "Bob";
    expect(stringComparator(string1, string2)).toBeLessThan(0);
  });

  it("sorts string2 above string1 when string2 starts with a", () => {
    const string1 = "Bob";
    const string2 = "Alice";
    expect(stringComparator(string1, string2)).toBeGreaterThan(0);
  });

  it("sorts string1 above string2 when string1 is a lower number", () => {
    const string1 = "123";
    const string2 = "777";
    expect(stringComparator(string1, string2)).toBeLessThan(0);
  });
});

describe("numberComparator", () => {
  it("returns 0 if both numbers are undefined", () => {
    expect(numberComparator(undefined, undefined)).toBe(0);
  });

  it("returns 0 if both numbers are the same", () => {
    expect(numberComparator(4, 4)).toBe(0);
  });

  it("sorts number1 before number2 if number1 is defined and number2 isn't", () => {
    const number1 = 132;
    const number2 = undefined;
    expect(numberComparator(number1, number2)).toBeLessThan(0);
  });

  it("sorts number2 before number1 if number2 is defined and number1 isn't", () => {
    const number1 = undefined;
    const number2 = 65;
    expect(numberComparator(number1, number2)).toBeGreaterThan(0);
  });

  it("sorts number1 before number2 if number1 is lower", () => {
    const number1 = 3;
    const number2 = 56;
    expect(numberComparator(number1, number2)).toBeLessThan(0);
  });

  it("sorts number2 before number1 if number2 is lower", () => {
    const number1 = 73;
    const number2 = 22;
    expect(numberComparator(number1, number2)).toBeGreaterThan(0);
  });
});

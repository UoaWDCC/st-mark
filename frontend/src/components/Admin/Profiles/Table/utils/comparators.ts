import { IDate } from "../../../../../types/schema";

/* All comparators put undefined values at the bottom when in ASC order */

export const dateComparator = (
  date1: IDate | undefined,
  date2: IDate | undefined
): number => {
  if (date1 === undefined && date2 === undefined) return 0;
  if (date2 === undefined) return -1;
  if (date1 === undefined) return 1;

  // default to large values to put undefined at the bottom when ASC
  const {
    year: year1 = Number.MAX_SAFE_INTEGER,
    month: month1 = 13,
    day: day1 = 32,
  } = date1;
  const {
    year: year2 = Number.MAX_SAFE_INTEGER,
    month: month2 = 13,
    day: day2 = 32,
  } = date2;

  if (year1 === year2) {
    if (month1 === month2) {
      if (day1 === day2) {
        return 0;
      } else {
        return day1 - day2;
      }
    } else {
      return month1 - month2;
    }
  } else {
    return year1 - year2;
  }
};

export const stringComparator = (
  string1: string | undefined,
  string2: string | undefined
): number => {
  if ((!string1 || string1.length == 0) && (!string2 || string2.length == 0)) {
    return 0;
  }
  if (!string1 || string1.length == 0) {
    return 1;
  }
  if (!string2 || string2.length == 0) {
    return -1;
  }

  return string1.localeCompare(string2);
};

export const numberComparator = (
  number1: number | undefined,
  number2: number | undefined
): number => {
  if (number1 === undefined && number2 === undefined) {
    return 0;
  }
  if (number1 === undefined) {
    return 1;
  }
  if (number2 === undefined) {
    return -1;
  }

  return number1 - number2;
};

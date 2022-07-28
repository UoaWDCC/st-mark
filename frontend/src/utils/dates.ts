import { IDate } from "../types/schema";

export const monthStrings = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// helper function to ensure DOB and DOD are not set ahead of today's date, as well as DOD is not before DOD
export const invalidDate = (
  dob: IDate | undefined,
  dod: IDate | undefined
): boolean => {
  //a sufficiently old date to `default to`
  const oldDate = new Date("1000-01-01");

  const totalTimePass = Date.now();
  const today = new Date(totalTimePass);

  // create new dob and dod for comparison
  const newDOB = new Date(
    dob?.year || oldDate.getUTCFullYear(),
    (dob?.month || oldDate.getUTCMonth()) - 1,
    dob?.day || oldDate.getUTCDate()
  );

  const newDOD = new Date(
    dod?.year || today.getUTCFullYear(),
    (dod?.month || today.getUTCMonth()) - 1,
    dod?.day || today.getUTCDate()
  );

  // check for date validity with current date
  if (newDOD > today || newDOB > newDOD) {
    return true;
  }

  return false;
};

// Helper function to format our date interface into a string.
export const dateToString = (
  date: IDate | undefined,
  adminTable = false
): string => {
  if (!date?.year) {
    return adminTable ? "" : "Unknown";
  }

  let dateString = "";
  if (date.day && date.month) {
    dateString += `${date.day} ${monthStrings[date.month - 1]}`;
  } else if (date.month) {
    dateString += monthStrings[date.month - 1];
  }
  dateString += ` ${date.year}`;

  return dateString.trim();
};

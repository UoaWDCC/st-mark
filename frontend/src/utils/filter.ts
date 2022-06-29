import { IPerson, IDate } from "../types/schema";

export const filterPeopleByFullName = (
  people: IPerson[],
  filterTerm: string
): IPerson[] =>
  people.filter((person) =>
    person.fullName.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase())
  );

// currently supports filtering by same month or day or year or a combination of each
export const filterPeopleByDeathDate = (
  people: IPerson[],
  filterDate: IDate
): IPerson[] =>
  people.filter((person) =>
    (filterDate.year === undefined || (person.dateOfDeath && filterDate.year === person.dateOfDeath.year)) && (filterDate.month === undefined || person.dateOfDeath && (filterDate.month === person.dateOfDeath.month)) && (filterDate.day === undefined || person.dateOfDeath && (filterDate.day === person.dateOfDeath.day))
  );

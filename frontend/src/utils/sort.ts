import { IPerson } from "../types/schema";

export const sortPeopleByFullName = (people: IPerson[]): void => {
  people.sort((person1, person2) => {
    return person1.fullName.localeCompare(person2.fullName);
  });
};

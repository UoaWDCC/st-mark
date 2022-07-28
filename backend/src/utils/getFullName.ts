import { IName } from "../models";

export const getFullName = (name: IName): string => {
  const { first, middles, last } = name;

  let fullName = last;
  if (middles) fullName = `${middles} ${fullName}`;
  if (first) fullName = `${first} ${fullName}`;

  return fullName;
};

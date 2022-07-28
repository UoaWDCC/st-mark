import { useMemo } from "react";
import { IPerson } from "../../../types/schema";
import { filterPeopleByFullName } from "../../../utils/filter";

const useFilterPeople = (
  people: IPerson[] | undefined,
  searchTerm: string
): { locationKnown: IPerson[]; locationUnknown: IPerson[] } => {
  const locationKnown = useMemo(
    () => people?.filter((person) => person.plot) ?? ([] as IPerson[]),
    [people]
  );
  const locationUnknown = useMemo(
    () => people?.filter((person) => !person.plot) ?? ([] as IPerson[]),
    [people]
  );

  return {
    locationKnown: filterPeopleByFullName(locationKnown, searchTerm),
    locationUnknown: filterPeopleByFullName(locationUnknown, searchTerm),
  };
};

export default useFilterPeople;

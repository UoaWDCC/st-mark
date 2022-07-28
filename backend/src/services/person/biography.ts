import { Person, IPerson } from "../../models";

export const updateBiography = async (
  personId: string,
  biography: string
): Promise<IPerson | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  person.biography = biography;

  await person.save();

  return person.toObject();
};

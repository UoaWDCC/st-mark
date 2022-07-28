import { Person, Link, ILink } from "../../models";

export const addLink = async (
  personId: string,
  title: string,
  url: string
): Promise<ILink | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const link = new Link({ title, url });
  await link.save();

  person.links.push(link._id);
  await person.save();

  return link;
};

export const deleteLink = async (
  personId: string,
  linkId: string
): Promise<ILink | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const link = await Link.findByIdAndDelete(linkId).lean().exec();
  if (link) await person.update({ $pull: { links: linkId } }); // remove reference to deleted link

  return link;
};

import { Person, Anecdote, IAnecdote } from "../../models";

export const addAnecdote = async (
  personId: string,
  content: string
): Promise<IAnecdote | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const anecdote = new Anecdote({ content });
  await anecdote.save();

  person.anecdotes.push(anecdote._id);
  await person.save();

  return anecdote;
};

export const deleteAnecdote = async (
  personId: string,
  anecdoteId: string
): Promise<IAnecdote | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const anecdote = await Anecdote.findByIdAndDelete(anecdoteId).lean().exec();
  if (anecdote) await person.update({ $pull: { anecdotes: anecdoteId } }); // remove reference to deleted anecdote

  return anecdote;
};

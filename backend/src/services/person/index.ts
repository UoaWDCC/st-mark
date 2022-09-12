import { Types, UpdateQuery } from "mongoose";
import { Person, Plot, IPerson, IDate, IName } from "../../models";

export const addPerson = async (
  name: IName,
  dateOfBirth?: IDate,
  dateOfDeath?: IDate,
  biography?: string
): Promise<IPerson> => {
  const person = new Person();

  person.name = name;
  person.dateOfBirth = dateOfBirth;
  person.dateOfDeath = dateOfDeath;
  person.biography = biography;

  await person.save();

  return person.toObject();
};

export const deletePerson = async (
  personId: string
): Promise<IPerson | null> => {
  return Person.findByIdAndDelete(personId).lean({ virtuals: true }).exec();
};

export const getPeople = async (): Promise<
  Omit<IPerson, "biography" | "images" | "links" | "anecdotes">[]
> => {
  return await Person.find()
    .populate("plot", "-coordinates")
    .populate("displayImage", "-_id url")
    .select("-biography -images -links -anecdotes")
    .lean({ virtuals: true })
    .exec();
};

export const getPeopleByPlot = async (
  plotId?: string
): Promise<
  Omit<
    IPerson,
    "displayImage" | "biography" | "images" | "links" | "anecdotes"
  >[]
> => {
  return Person.find(
    { plot: plotId ? { $eq: Types.ObjectId(plotId) } : { $ne: undefined } },
    plotId ? "-plot" : ""
  )
    .select("-displayImage -biography -images -links -anecdotes")
    .lean({ virtuals: true })
    .exec();
};

export const getPerson = async (personId: string): Promise<IPerson | null> => {
  return await Person.findById(personId)
    .populate("displayImage", "-_id url")
    .populate("images", "_id url")
    .populate("links")
    .populate("plot", "_id plotNumber registeredName")
    .populate("anecdotes")
    .lean({ virtuals: true })
    .exec();
};

export const getPlotMembers = async (
  personId: string,
  plotId: string
): Promise<IPerson[]> => {
  return await Person.find({ _id: { $ne: personId }, plot: plotId }, "_id name")
    .lean({ virtuals: true })
    .exec();
};

export const updatePerson = async (
  personId: string,
  update: UpdateQuery<Omit<IPerson, "fullName">>
): Promise<IPerson | null> => {
  if (update.plot) {
    const plot = await Plot.findById(update.plot, "");
    if (plot === null) throw { _message: "Plot could not be found" };
  }

  return Person.findByIdAndUpdate(personId, update, {
    new: true,
    runValidators: true,
  })
    .lean({ virtuals: true })
    .exec();
};

export const existsPerson = async (personId: string): Promise<boolean> => {
  return await Person.exists({ _id: personId });
};

import { ObjectId } from "mongodb";

export const addPerson = jest.fn(async () => ({
  name: { first: "Eliza", last: "Poop" },
}));

export const deletePerson = jest.fn(async () => ({
  name: { first: "Eliza", last: "Poop" },
}));

export const getPeople = jest.fn(async () => [
  { name: { first: "William", last: "Wills" } },
  { name: { last: "Crawford" } },
]);

export const getPeopleByPlot = jest.fn(async () => [
  {
    name: { first: "Joe", last: "Dirt" },
    dateOfDeath: { year: 1869, month: 10 },
  },
]);

export const getPerson = jest.fn(async () => ({
  name: { first: "Walter", last: "Murray" },
  biography: "Loving father",
  displayImage: "test-image",
  images: ["test-image1", "test-image2"],
  plot: {
    _id: new ObjectId("612e02f84667bac8a8b749b1"),
  },
}));

export const getPlotMembers = jest.fn(async () => [
  { name: { first: "David", last: "Murray" }, fullName: "David Murray" },
  { name: { first: "Alice", last: "Murray" }, fullName: "Alice Murray" },
]);

export const updatePerson = jest.fn(async () => ({
  name: { first: "Walter", last: "Murray" },
  biography: "Loving father",
}));

export const existsPerson = jest.fn(async () => true);

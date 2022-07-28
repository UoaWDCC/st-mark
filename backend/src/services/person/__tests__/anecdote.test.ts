import mongoose from "mongoose";
import { Collection, Db } from "mongodb";
import { addAnecdote, deleteAnecdote } from "../anecdote";
import { IAnecdote, IPerson } from "../../../models";

let db: Db;

const personId1 = "6139af218be53e786b45d9f3";
const notFoundId = "6139af3cc3dd679fb60fb507";

const mockPerson = {
  _id: mongoose.Types.ObjectId(personId1),
  name: { last: "Whisker" },
} as unknown as IPerson;

const anecdoteId1 = "6139aed66c14767b1f9927e6";
const anecdoteId2 = "6139aefa80bd043258b64e7c";

const mockAnecdotes = [
  {
    _id: mongoose.Types.ObjectId(anecdoteId1),
    content: "Interesting anecdote",
  },
  {
    _id: mongoose.Types.ObjectId(anecdoteId2),
    content: "He once said: Hehe xD",
  },
] as unknown as IAnecdote[];

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__ + global.__MONGO_DB_NAME__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: false,
  });
  db = mongoose.connection.db;
});

let peopleColl: Collection<IPerson>;
let anecdotesColl: Collection<IAnecdote>;

beforeEach(async () => {
  peopleColl = await db.createCollection("people");
  anecdotesColl = await db.createCollection("anecdotes");
});

afterEach(async () => {
  await peopleColl.drop();
  await anecdotesColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("services/anecdote.ts", () => {
  describe("addAnecdote()", () => {
    it("Adds a new anecdote in the database", async () => {
      await peopleColl.insertOne(mockPerson);

      await addAnecdote(personId1, "Anecdote Content");

      const anecdotes = await anecdotesColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(anecdotes).toHaveLength(1);
      expect(anecdotes[0].content).toBe("Anecdote Content");
      expect(people[0].anecdotes).toHaveLength(1);
    });

    it("Fails to add anecdote if content not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addAnecdote(personId1, undefined as unknown as string);
        fail();
      } catch (e) {
        const anecdotes = await anecdotesColl.find().toArray();
        const people = await peopleColl.find().toArray();

        expect(anecdotes).toHaveLength(0);
        expect(people[0].anecdotes).toBe(undefined);
      }
    });
  });

  describe("deleteAnecdote()", () => {
    it("Deletes an anecdote in the database", async () => {
      mockPerson.anecdotes = [
        mongoose.Types.ObjectId(anecdoteId1),
        mongoose.Types.ObjectId(anecdoteId2),
      ];
      await peopleColl.insertOne(mockPerson);

      await anecdotesColl.insertMany([mockAnecdotes[0], mockAnecdotes[1]]);

      await deleteAnecdote(personId1, anecdoteId1);

      const anecdotes = await anecdotesColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(anecdotes).toHaveLength(1);
      expect(anecdotes[0].content).toBe("He once said: Hehe xD");
      expect(people[0].anecdotes).toHaveLength(1);
    });

    it("Returns null if no person found with provided id", async () => {
      mockPerson.anecdotes = [mongoose.Types.ObjectId(anecdoteId1)];
      await peopleColl.insertOne(mockPerson);

      await anecdotesColl.insertOne(mockAnecdotes[0]);

      const anecdote = await deleteAnecdote(notFoundId, anecdoteId1);

      const anecdotes = await anecdotesColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(anecdote).toBeNull();
      expect(anecdotes).toHaveLength(1);
      expect(people[0].anecdotes).toHaveLength(1);
    });

    it("Returns null if no anecdote found with provided id", async () => {
      mockPerson.anecdotes = [mongoose.Types.ObjectId(anecdoteId1)];
      await peopleColl.insertOne(mockPerson);

      await anecdotesColl.insertOne(mockAnecdotes[0]);

      const anecdote = await deleteAnecdote(personId1, notFoundId);

      const anecdotes = await anecdotesColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(anecdote).toBeNull();
      expect(anecdotes).toHaveLength(1);
      expect(people[0].anecdotes).toHaveLength(1);
    });
  });
});

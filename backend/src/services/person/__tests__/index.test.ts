import mongoose from "mongoose";
import { Collection, Db } from "mongodb";
import {
  addPerson,
  deletePerson,
  existsPerson,
  getPlotMembers,
  getPeople,
  getPeopleByPlot,
  getPerson,
  updatePerson,
} from "..";
import {
  IAnecdote,
  IImage,
  ILink,
  IPerson,
  IPlot,
  Person,
} from "../../../models";

let db: Db;

const personId1 = "53cb6b9b4f4ddef1ad47f943";
const personId2 = "53cb6b9b4f4ddef1ad47f678";
const personId3 = "53cb6b9b4f4ddef1ad47f123";
const personId4 = "6139af218be53e786b45d9f3";

const plotId1 = "612e02f84667bac8a8b749b1";
const plotId2 = "612e0308a5603ac8bce5a7ad";

const linkId1 = "612e02f84667bac8a8b749b7";
const linkId2 = "612e02f84667bac8a8123456";

const imageId1 = "6135ac505f99be924bd3d9db";

const anecdoteId1 = "6139aed66c14767b1f9927e6";
const anecdoteId2 = "6139aefa80bd043258b64e7c";

const mockPeople = [
  { name: { last: "Poop" } },
  { name: { first: "William", last: "Wills" } },
  {
    _id: mongoose.Types.ObjectId(personId1),
    name: { last: "Crawford" },
  },
  { name: { first: "Alice", last: "Kelly" } },
  {
    _id: mongoose.Types.ObjectId(personId2),
    name: { first: "Alice", last: "Kelly" },
    biography: "Loving sister",
  },
  {
    _id: mongoose.Types.ObjectId(personId2),
    name: { last: "Kelly" },
    dateOfDeath: { year: 1850, month: 10 },
    plot: mongoose.Types.ObjectId(plotId1),
  },
  {
    name: { first: "Joe", last: "Dirt" },
    dateOfDeath: { year: 1869, month: 10 },
    plot: mongoose.Types.ObjectId(plotId2),
  },
  {
    _id: mongoose.Types.ObjectId(personId3),
    name: { first: "Lucy", last: "Linked" },
    links: [mongoose.Types.ObjectId(linkId1), mongoose.Types.ObjectId(linkId2)],
  },
  {
    _id: mongoose.Types.ObjectId(personId3),
    name: { first: "Lucy", last: "Linked" },
    displayImage: mongoose.Types.ObjectId(imageId1),
  },
  {
    _id: mongoose.Types.ObjectId(personId3),
    name: { first: "Lucy", last: "Linked" },
    images: [mongoose.Types.ObjectId(imageId1)],
  },
  {
    _id: mongoose.Types.ObjectId(personId4),
    name: { first: "Bevan", last: "Anecdoted" },
    anecdotes: [
      mongoose.Types.ObjectId(anecdoteId1),
      mongoose.Types.ObjectId(anecdoteId2),
    ],
  },
] as unknown as IPerson[];

const mockLinks = [
  {
    _id: mongoose.Types.ObjectId(linkId1),
    title: "The Archives",
    url: "www.thearchives.com",
  },
  {
    _id: mongoose.Types.ObjectId(linkId2),
    title: "The NZ Herald",
    url: "www.nzherald.co.nz",
  },
  {
    title: "Fake News",
    url: "www.fakenews.com",
  },
];

const mockImage = {
  _id: mongoose.Types.ObjectId(imageId1),
  url: "https://storage.com/abc/123",
} as unknown as IImage;

const mockAnecdotes = [
  {
    _id: mongoose.Types.ObjectId(anecdoteId1),
    content: "Hehe xD",
  },
  {
    _id: mongoose.Types.ObjectId(anecdoteId2),
    content: "Hello World",
  },
  {
    content: "Kia Ora",
  },
];

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
let plotsColl: Collection<IPlot>;
let linksColl: Collection<ILink>;
let imagesColl: Collection<IImage>;
let anecdotesColl: Collection<IAnecdote>;

beforeEach(async () => {
  peopleColl = await db.createCollection<IPerson>("people");
  await Person.createIndexes();
  plotsColl = await db.createCollection<IPlot>("plots");
  linksColl = await db.createCollection<ILink>("links");
  imagesColl = await db.createCollection<IImage>("images");
  anecdotesColl = await db.createCollection<IAnecdote>("anecdotes");
});

afterEach(async () => {
  await peopleColl.drop();
  await plotsColl.drop();
  await linksColl.drop();
  await imagesColl.drop();
  await anecdotesColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("services/person/index.ts", () => {
  describe("addPerson()", () => {
    it("Adds new Person in the database", async () => {
      const person = await addPerson(mockPeople[0].name);

      expect(person.fullName).toBe("Poop");

      const people = await peopleColl.find().toArray();

      expect(people).toHaveLength(1);
      expect(people[0].name.last).toBe("Poop");
    });
  });

  describe("getPeople()", () => {
    it("Gets all People in the database", async () => {
      await peopleColl.insertMany([mockPeople[1], mockPeople[2]]);

      const people = await getPeople();

      expect(people).toHaveLength(2);
      expect(people[0].name.first).toBe("William");
      expect(people[0].name.last).toBe("Wills");
      expect(people[0].fullName).toBe("William Wills");
      expect(people[1].name.last).toBe("Crawford");
      expect(people[1].fullName).toBe("Crawford");
    });

    it("Gets all People in the database and populates plot", async () => {
      await peopleColl.insertMany([mockPeople[5], mockPeople[6]]);
      await plotsColl.insertMany([
        {
          _id: mongoose.Types.ObjectId(plotId1),
          plotNumber: 1,
          registeredName: "Whisker",
        },
        {
          _id: mongoose.Types.ObjectId(plotId2),
          plotNumber: 2,
          registeredName: "Kidd",
        },
      ] as unknown as IPlot[]);

      const people = await getPeople();

      expect(people).toHaveLength(2);
      expect(people[0].name.last).toBe("Kelly");
      expect(people[0].fullName).toBe("Kelly");
      expect((people[0].plot as IPlot)?.plotNumber).toBe(1);
      expect((people[0].plot as IPlot)?.registeredName).toBe("Whisker");
      expect(people[1].name.first).toBe("Joe");
      expect(people[1].name.last).toBe("Dirt");
      expect(people[1].fullName).toBe("Joe Dirt");
      expect((people[1].plot as IPlot)?.plotNumber).toBe(2);
      expect((people[1].plot as IPlot)?.registeredName).toBe("Kidd");
    });

    it("Gets all People in the database and does not populate links", async () => {
      await peopleColl.insertOne(mockPeople[7]);
      await linksColl.insertMany(mockLinks);

      const people = await getPeople();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Lucy");
      expect(people[0].name.last).toBe("Linked");
      expect((people[0] as unknown as IPerson).links).toBeUndefined();
    });

    it("Gets all People in the database and does not populate displayImage", async () => {
      await peopleColl.insertOne(mockPeople[8]);
      await imagesColl.insertOne(mockImage);

      const people = await getPeople();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Lucy");
      expect(people[0].name.last).toBe("Linked");
      expect((people[0] as unknown as IPerson).displayImage).toBeUndefined();
    });

    it("Gets all People in the database and does not populate biography", async () => {
      await peopleColl.insertOne(mockPeople[4]);

      const people = await getPeople();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Alice");
      expect(people[0].name.last).toBe("Kelly");
      expect((people[0] as unknown as IPerson).biography).toBeUndefined();
    });

    it("Gets all People in the database and does not populate images", async () => {
      await peopleColl.insertOne(mockPeople[9]);
      await imagesColl.insertOne(mockImage);

      const people = await getPeople();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Lucy");
      expect(people[0].name.last).toBe("Linked");
      expect((people[0] as unknown as IPerson).images).toBeUndefined();
    });

    it("Gets all People in the database and does not populate anecdotes", async () => {
      await peopleColl.insertOne(mockPeople[10]);
      await anecdotesColl.insertMany(mockAnecdotes);

      const people = await getPeople();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Bevan");
      expect(people[0].name.last).toBe("Anecdoted");
      expect((people[0] as unknown as IPerson).anecdotes).toBeUndefined();
    });
  });

  describe("getPeopleByPlotId()", () => {
    it("Gets all People in the database with a plot id", async () => {
      await peopleColl.insertMany([
        mockPeople[1],
        mockPeople[5],
        mockPeople[6],
      ]);

      const buried = await getPeopleByPlot();

      expect(buried).toHaveLength(2);
      expect(buried[0].name.last).toBe("Kelly");
      expect(buried[0].fullName).toBe("Kelly");
      expect(buried[1].name.first).toBe("Joe");
      expect(buried[1].name.last).toBe("Dirt");
      expect(buried[1].fullName).toBe("Joe Dirt");
    });

    it("Gets all People in the database with matching plot id", async () => {
      await peopleColl.insertMany([mockPeople[1], mockPeople[5]]);

      const buried = await getPeopleByPlot(plotId1);

      expect(buried).toHaveLength(1);
      expect(buried[0].name.last).toBe("Kelly");
      expect(buried[0].fullName).toBe("Kelly");
    });
  });

  describe("getPerson()", () => {
    it("Gets single Person from the database", async () => {
      await peopleColl.insertMany([
        mockPeople[1],
        mockPeople[2],
        mockPeople[3],
      ]);

      const person = await getPerson(personId1);

      expect(person?.name.last).toBe("Crawford");
      expect(person?.fullName).toBe("Crawford");
    });

    it("Gets single Person from the database with their links populated", async () => {
      await peopleColl.insertOne(mockPeople[7]);
      await linksColl.insertMany(mockLinks);

      const person = await getPerson(personId3);

      expect(person?.name.first).toBe("Lucy");
      expect(person?.name.last).toBe("Linked");
      expect(person?.fullName).toBe("Lucy Linked");
      expect(person?.links?.length).toBe(2);
      expect((person?.links?.[0] as ILink).title).toBe("The Archives");
      expect((person?.links?.[0] as ILink).url).toBe("www.thearchives.com");
      expect((person?.links?.[1] as ILink).title).toBe("The NZ Herald");
      expect((person?.links?.[1] as ILink).url).toBe("www.nzherald.co.nz");
    });

    it("Gets single Person from the database with their displayImage populated", async () => {
      await peopleColl.insertOne(mockPeople[8]);
      await imagesColl.insertOne(mockImage);

      const person = await getPerson(personId3);

      expect(person?.name.first).toBe("Lucy");
      expect(person?.name.last).toBe("Linked");
      expect(person?.fullName).toBe("Lucy Linked");
      expect((person?.displayImage as IImage)._id).toBeUndefined();
      expect((person?.displayImage as IImage).url).toBe(
        "https://storage.com/abc/123"
      );
      expect((person?.displayImage as IImage).filePath).toBeUndefined();
    });

    it("Gets single Person from the database with their images populated", async () => {
      await peopleColl.insertOne(mockPeople[9]);
      await imagesColl.insertOne(mockImage);

      const person = await getPerson(personId3);

      expect(person?.name.first).toBe("Lucy");
      expect(person?.name.last).toBe("Linked");
      expect(person?.fullName).toBe("Lucy Linked");
      expect(person?.images).toHaveLength(1);
      expect((person?.images[0] as IImage)._id).toStrictEqual(
        mongoose.Types.ObjectId(imageId1)
      );
      expect((person?.images[0] as IImage).url).toBe(
        "https://storage.com/abc/123"
      );
      expect((person?.images[0] as IImage).filePath).toBeUndefined();
    });

    it("Gets single Person from the database with their anecdotes populated", async () => {
      await peopleColl.insertOne(mockPeople[10]);
      await anecdotesColl.insertMany(mockAnecdotes);

      const person = await getPerson(personId4);

      expect(person?.name.first).toBe("Bevan");
      expect(person?.name.last).toBe("Anecdoted");
      expect(person?.fullName).toBe("Bevan Anecdoted");
      expect(person?.anecdotes?.length).toBe(2);
      expect((person?.anecdotes?.[0] as IAnecdote).content).toBe("Hehe xD");
      expect((person?.anecdotes?.[1] as IAnecdote).content).toBe("Hello World");
    });
  });

  describe("getPlotMembers()", () => {
    it("Gets all plot members", async () => {
      await peopleColl.insertMany([
        mockPeople[6],
        mockPeople[7],
        {
          name: { first: "Dave", last: "Dirt" },
          plot: mongoose.Types.ObjectId(plotId2),
        },
        {
          _id: mongoose.Types.ObjectId(personId4),
          name: { first: "Searched", last: "Dirt" },
          plot: mongoose.Types.ObjectId(plotId2),
        },
      ] as unknown as IPerson[]);

      const buddies = await getPlotMembers(personId4, plotId2);

      expect(buddies).toHaveLength(2);
      expect(buddies[0].fullName).toBe("Joe Dirt");
      expect(buddies[1].fullName).toBe("Dave Dirt");
    });

    it("Returns empty array if no plot members found", async () => {
      await peopleColl.insertMany([mockPeople[6], mockPeople[7]]);

      const buddies = await getPlotMembers(personId2, plotId1);

      expect(buddies).toHaveLength(0);
    });
  });

  describe("updatePerson()", () => {
    it("Updates a Person's name in the database", async () => {
      await peopleColl.insertMany([mockPeople[1], mockPeople[2]]);

      const person = await updatePerson(personId1, {
        name: {
          first: "Kelly",
          last: "Crawford",
        },
      });

      expect(person?.fullName).toBe("Kelly Crawford");

      const people = await peopleColl.find().toArray();

      expect(people).toHaveLength(2);
      expect(people[0].name.first).toBe("William");
      expect(people[0].name.last).toBe("Wills");
      expect(people[1].name.first).toBe("Kelly");
      expect(people[1].name.last).toBe("Crawford");
    });

    it("Updates a Person's biography in the database without altering other fields", async () => {
      await peopleColl.insertOne(mockPeople[4]);

      const person = await updatePerson(personId2, {
        biography: "Loving daughter",
      });

      expect(person?.fullName).toBe("Alice Kelly");

      const people = await peopleColl.find().toArray();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Alice");
      expect(people[0].name.last).toBe("Kelly");
      expect(people[0].biography).toBe("Loving daughter");
    });

    it("Does not update Person's dateOfDeath if the month supplied is out of range", async () => {
      await peopleColl.insertOne(mockPeople[5]);

      try {
        await updatePerson(personId2, {
          dateOfDeath: { year: 1849, month: 14 },
        });
        fail();
      } catch (error) {
        const people = await peopleColl.find().toArray();

        expect(people[0].dateOfDeath?.year).toBe(1850);
        expect(people[0].dateOfDeath?.month).toBe(10);
      }
    });

    it("Updates a Person's plot in the database without altering other fields", async () => {
      await peopleColl.insertOne(mockPeople[4]);
      await plotsColl.insertOne({
        _id: mongoose.Types.ObjectId("612f427fbfee6369199400ce"),
      } as unknown as IPlot);

      const person = await updatePerson(personId2, {
        plot: "612f427fbfee6369199400ce",
      });

      expect(person?.fullName).toBe("Alice Kelly");

      const people = await peopleColl.find().toArray();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("Alice");
      expect(people[0].name.last).toBe("Kelly");
      expect(people[0].biography).toBe("Loving sister");
      expect(people[0].plot).toStrictEqual(
        mongoose.Types.ObjectId("612f427fbfee6369199400ce")
      );
    });

    it("Does not update Person's plot if the plot does not exist", async () => {
      await peopleColl.insertOne(mockPeople[1]);

      try {
        await updatePerson(personId2, {
          plot: "612f427fbfee6369199400ce",
        });
        fail();
      } catch (error) {
        expect(error._message).toBe("Plot could not be found");

        const people = await peopleColl.find().toArray();

        expect(people[0].plot).toBe(undefined);
      }
    });
  });

  describe("deletePerson()", () => {
    it("Deletes a Person in the database", async () => {
      await peopleColl.insertMany([mockPeople[1], mockPeople[2]]);

      const person = await deletePerson(personId1);

      expect(person?.fullName).toBe("Crawford");

      const people = await peopleColl.find().toArray();

      expect(people).toHaveLength(1);
      expect(people[0].name.first).toBe("William");
      expect(people[0].name.last).toBe("Wills");
    });

    it("Returns null if the person is not in the database", async () => {
      await peopleColl.insertMany([mockPeople[1], mockPeople[2]]);

      const person = await deletePerson(personId4);

      expect(person).toBeNull();

      const people = await peopleColl.find().toArray();
      expect(people).toHaveLength(2);
      expect(people[0].name.first).toBe("William");
      expect(people[0].name.last).toBe("Wills");
      expect(people[1].name.last).toBe("Crawford");
    });

    it("Deletes a Person in the database and also deletes all of their links", async () => {
      await peopleColl.insertOne(mockPeople[7]);
      await linksColl.insertMany(mockLinks);

      const person = await deletePerson(personId3);

      expect(person?.fullName).toBe("Lucy Linked");

      const people = await peopleColl.find().toArray();
      const links = await linksColl.find().toArray();

      expect(people).toHaveLength(0);
      expect(links).toHaveLength(1);
      expect(links[0].title).toBe("Fake News");
      expect(links[0].url).toBe("www.fakenews.com");
    });

    it("Deletes a Person in the database and also deletes all of their anecdotes", async () => {
      await peopleColl.insertOne(mockPeople[10]);

      await anecdotesColl.insertMany(mockAnecdotes);

      const person = await deletePerson(personId4);

      expect(person?.fullName).toBe("Bevan Anecdoted");

      const people = await peopleColl.find().toArray();
      const anecdotes = await anecdotesColl.find().toArray();

      expect(people).toHaveLength(0);
      expect(anecdotes).toHaveLength(1);
      expect(anecdotes[0].content).toBe("Kia Ora");
    });
  });

  describe("existsPerson()", () => {
    it("Returns true if a person exists with provided id", async () => {
      await peopleColl.insertOne(mockPeople[2]);

      const exists = await existsPerson(personId1);

      expect(exists).toBeTruthy();
    });

    it("Returns false if no person exists with provided id", async () => {
      const exists = await existsPerson(personId1);

      expect(exists).toBeFalsy();
    });
  });
});

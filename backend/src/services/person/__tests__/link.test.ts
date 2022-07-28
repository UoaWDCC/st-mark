import mongoose from "mongoose";
import { Collection, Db } from "mongodb";
import { addLink, deleteLink } from "../link";
import { ILink, IPerson } from "../../../models";

let db: Db;

const personId1 = "53cb6b9b4f4ddef1ad47f943";
const notFoundId = "53cb6b9b4f4ddef1ad477246";

const mockPerson = {
  _id: mongoose.Types.ObjectId(personId1),
  name: { last: "Mark" },
} as unknown as IPerson;

const linkId1 = "612e02f84667bac8a8b749b1";
const linkId2 = "612e0308a5603ac8bce5a7ad";

const mockLinks = [
  {
    _id: mongoose.Types.ObjectId(linkId1),
    title: "NZ Herald",
    url: "www.nzherald.com",
  },
  {
    _id: mongoose.Types.ObjectId(linkId2),
    title: "The Archives",
    url: "www.thearchives.com",
  },
] as unknown as ILink[];

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
let linksColl: Collection<ILink>;

beforeEach(async () => {
  peopleColl = await db.createCollection("people");
  linksColl = await db.createCollection("links");
});

afterEach(async () => {
  await peopleColl.drop();
  await linksColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("services/person/link.ts", () => {
  describe("addLink()", () => {
    it("Adds a new link in the database", async () => {
      await peopleColl.insertOne(mockPerson);

      await addLink(personId1, "Stuff", "www.stuff.co.nz");

      const links = await linksColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(links).toHaveLength(1);
      expect(links[0].title).toBe("Stuff");
      expect(links[0].url).toBe("www.stuff.co.nz");
      expect(people[0].links).toHaveLength(1);
    });

    it("Returns null if person does not exist", async () => {
      const link = await addLink(notFoundId, "Stuff", "www.stuff.co.nz");

      expect(link).toBeNull();

      const links = await linksColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(links).toHaveLength(0);
      expect(people).toHaveLength(0);
    });

    it("Fails to add Link if title not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addLink(
          personId1,
          undefined as unknown as string,
          "www.stuff.co.nz"
        );
        fail();
      } catch (e) {
        const links = await linksColl.find().toArray();
        const people = await peopleColl.find().toArray();

        expect(links).toHaveLength(0);
        expect(people[0].links).toBe(undefined);
      }
    });

    it("Fails to add Link if url not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addLink(personId1, "Stuff", undefined as unknown as string);
        fail();
      } catch (e) {
        const links = await linksColl.find().toArray();
        const people = await peopleColl.find().toArray();

        expect(links).toHaveLength(0);
        expect(people[0].links).toBe(undefined);
      }
    });
  });

  describe("deleteLink()", () => {
    it("Deletes a link in the database", async () => {
      mockPerson.links = [mongoose.Types.ObjectId(linkId1)];
      await peopleColl.insertOne(mockPerson);
      await linksColl.insertMany([mockLinks[0], mockLinks[1]]);

      await deleteLink(personId1, linkId1);

      const links = await linksColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(links).toHaveLength(1);
      expect(links[0].title).toBe("The Archives");
      expect(links[0].url).toBe("www.thearchives.com");
      expect(people[0].links).toHaveLength(0);
    });

    it("Returns null if no person found with provided id", async () => {
      mockPerson.links = [mongoose.Types.ObjectId(linkId1)];
      await peopleColl.insertOne(mockPerson);
      await linksColl.insertOne(mockLinks[0]);

      const link = await deleteLink(notFoundId, linkId1);

      const links = await linksColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(link).toBeNull();
      expect(links).toHaveLength(1);
      expect(people[0].links).toHaveLength(1);
    });

    it("Returns null if no link found with provided id", async () => {
      mockPerson.links = [mongoose.Types.ObjectId(linkId1)];
      await peopleColl.insertOne(mockPerson);
      await linksColl.insertOne(mockLinks[0]);

      const link = await deleteLink(personId1, notFoundId);

      const links = await linksColl.find().toArray();
      const people = await peopleColl.find().toArray();

      expect(link).toBeNull();
      expect(links).toHaveLength(1);
      expect(people[0].links).toHaveLength(1);
    });
  });
});

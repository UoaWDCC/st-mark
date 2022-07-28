import mongoose from "mongoose";
import { Collection, Db } from "mongodb";
import { IImage, IPerson } from "../../../models";
import {
  deleteDisplayImage,
  addDisplayImage,
  addImage,
  deleteImage,
} from "../image";

let db: Db;

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
let imagesColl: Collection<IImage>;

beforeEach(async () => {
  peopleColl = await db.createCollection<IPerson>("people");
  imagesColl = await db.createCollection<IImage>("images");
});

afterEach(async () => {
  await peopleColl.drop();
  await imagesColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const personId1 = "53cb6b9b4f4ddef1ad47f943";
const notFoundId = "53cb6b9b4f4ddef1ad477246";

const mockPerson = {
  _id: mongoose.Types.ObjectId(personId1),
  name: { last: "Mark" },
  images: [],
} as unknown as IPerson;

const imageId1 = "612e02f84667bac8a8b749b1";
const imageId2 = "612e0308a5603ac8bce5a7ad";

const mockImages = [
  {
    _id: mongoose.Types.ObjectId(imageId1),
    filePath: "abc/123",
    url: "https://storage.com/abc/123",
  },
  {
    _id: mongoose.Types.ObjectId(imageId2),
    filePath: "def/456",
    url: "https://storage.com/def/456",
  },
] as unknown as IImage[];

describe("services/person/image.ts", () => {
  describe("setDisplayImage()", () => {
    it("Sets a persons display image", async () => {
      await peopleColl.insertOne(mockPerson);

      const image = await addDisplayImage(
        personId1,
        "abc/123",
        "https://storage.com/abc/123"
      );

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people[0].displayImage).toStrictEqual(image?._id);
      expect(images).toHaveLength(1);
      expect(images[0].filePath).toBe("abc/123");
      expect(images[0].url).toBe("https://storage.com/abc/123");
    });

    it("Returns null if person does not exist", async () => {
      const image = await addDisplayImage(
        notFoundId,
        "abc/123",
        "https://storage.com/abc/123"
      );

      expect(image).toBeNull();

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people).toHaveLength(0);
      expect(images).toHaveLength(0);
    });

    it("Fails to set display image if fileName not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addDisplayImage(
          personId1,
          undefined as unknown as string,
          "https://storage.com/abc/123"
        );
        fail();
      } catch (e) {
        const people = await peopleColl.find().toArray();
        const images = await imagesColl.find().toArray();

        expect(people[0].displayImage).toBeUndefined();
        expect(images).toHaveLength(0);
      }
    });

    it("Fails to set display image if url not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addDisplayImage(
          personId1,
          "abc/123",
          undefined as unknown as string
        );
        fail();
      } catch (e) {
        const people = await peopleColl.find().toArray();
        const images = await imagesColl.find().toArray();

        expect(people[0].displayImage).toBeUndefined();
        expect(images).toHaveLength(0);
      }
    });
  });

  describe("deleteDisplayImage()", () => {
    it("Deletes a persons display image", async () => {
      mockPerson.displayImage = mongoose.Types.ObjectId(imageId1);
      await peopleColl.insertOne(mockPerson);
      await imagesColl.insertMany([mockImages[0], mockImages[1]]);

      const image = await deleteDisplayImage(personId1);

      expect(image?.filePath).toBe("abc/123");
      expect(image?.url).toBe("https://storage.com/abc/123");

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people[0].displayImage).toBeUndefined();
      expect(images).toHaveLength(1);
      expect(images[0].filePath).toBe("def/456");
      expect(images[0].url).toBe("https://storage.com/def/456");
    });

    it("Returns null if no person found with provided id", async () => {
      await imagesColl.insertMany([mockImages[0], mockImages[1]]);

      const image = await deleteDisplayImage(notFoundId);

      expect(image).toBeNull();

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people).toHaveLength(0);
      expect(images).toHaveLength(2);
      expect(images[0].filePath).toBe("abc/123");
      expect(images[0].url).toBe("https://storage.com/abc/123");
      expect(images[1].filePath).toBe("def/456");
      expect(images[1].url).toBe("https://storage.com/def/456");
    });

    it("Returns null if person has no display image", async () => {
      delete mockPerson.displayImage;
      await peopleColl.insertOne(mockPerson);
      await imagesColl.insertMany([mockImages[0], mockImages[1]]);

      const image = await deleteDisplayImage(personId1);

      expect(image).toBeNull();

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people).toHaveLength(1);
      expect(people[0].displayImage).toBeUndefined();
      expect(images).toHaveLength(2);
      expect(images[0].filePath).toBe("abc/123");
      expect(images[0].url).toBe("https://storage.com/abc/123");
      expect(images[1].filePath).toBe("def/456");
      expect(images[1].url).toBe("https://storage.com/def/456");
    });
  });

  describe("addImage()", () => {
    it("Adds a new image for a person", async () => {
      await peopleColl.insertOne(mockPerson);

      const image = await addImage(
        personId1,
        "abc/123",
        "https://storage.com/abc/123"
      );

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people[0].images).toHaveLength(1);
      expect(people[0].images[0]).toStrictEqual(image?._id);
      expect(images).toHaveLength(1);
      expect(images[0].filePath).toBe("abc/123");
      expect(images[0].url).toBe("https://storage.com/abc/123");
    });

    it("Returns null if person does not exist", async () => {
      const image = await addImage(
        notFoundId,
        "abc/123",
        "https://storage.com/abc/123"
      );

      expect(image).toBeNull();

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people).toHaveLength(0);
      expect(images).toHaveLength(0);
    });

    it("Fails to add image if fileName not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addImage(
          personId1,
          undefined as unknown as string,
          "https://storage.com/abc/123"
        );
        fail();
      } catch (e) {
        const people = await peopleColl.find().toArray();
        const images = await imagesColl.find().toArray();

        expect(people[0].images).toHaveLength(0);
        expect(images).toHaveLength(0);
      }
    });

    it("Fails to add image if fileName not provided", async () => {
      await peopleColl.insertOne(mockPerson);

      try {
        await addImage(personId1, "abc/123", undefined as unknown as string);
        fail();
      } catch (e) {
        const people = await peopleColl.find().toArray();
        const images = await imagesColl.find().toArray();

        expect(people[0].images).toHaveLength(0);
        expect(images).toHaveLength(0);
      }
    });
  });

  describe("deleteImage()", () => {
    it("Deletes a persons image", async () => {
      mockPerson.images = [mongoose.Types.ObjectId(imageId1)];
      await peopleColl.insertOne(mockPerson);
      await imagesColl.insertMany([mockImages[0], mockImages[1]]);

      const image = await deleteImage(personId1, imageId1);

      expect(image?.filePath).toBe("abc/123");
      expect(image?.url).toBe("https://storage.com/abc/123");

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people[0].images).toHaveLength(0);
      expect(images).toHaveLength(1);
      expect(images[0].filePath).toBe("def/456");
      expect(images[0].url).toBe("https://storage.com/def/456");
    });

    it("Returns null if no person found with provided id", async () => {
      await imagesColl.insertMany([mockImages[0], mockImages[1]]);

      const image = await deleteImage(notFoundId, imageId1);

      expect(image).toBeNull();

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people).toHaveLength(0);
      expect(images).toHaveLength(2);
      expect(images[0].filePath).toBe("abc/123");
      expect(images[0].url).toBe("https://storage.com/abc/123");
      expect(images[1].filePath).toBe("def/456");
      expect(images[1].url).toBe("https://storage.com/def/456");
    });

    it("Returns null if no image found with provided id", async () => {
      mockPerson.images = [mongoose.Types.ObjectId(imageId1)];
      await peopleColl.insertOne(mockPerson);
      await imagesColl.insertMany([mockImages[1]]);

      const image = await deleteImage(personId1, imageId1);

      expect(image).toBeNull();

      const people = await peopleColl.find().toArray();
      const images = await imagesColl.find().toArray();

      expect(people).toHaveLength(1);
      expect(people[0].images).toHaveLength(1);
      expect(people[0].images[0]).toStrictEqual(
        mongoose.Types.ObjectId(imageId1)
      );
      expect(images).toHaveLength(1);
      expect(images[0].filePath).toBe("def/456");
      expect(images[0].url).toBe("https://storage.com/def/456");
    });
  });
});

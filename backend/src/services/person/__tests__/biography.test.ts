import mongoose from "mongoose";
import { Collection, Db } from "mongodb";
import { updateBiography } from "../biography";
import { IPerson } from "../../../models";

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

beforeEach(async () => {
  peopleColl = await db.createCollection<IPerson>("people");
});

afterEach(async () => {
  await peopleColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const personId = "53cb6b9b4f4ddef1ad47f943";

describe("updateBiography()", () => {
  it("Updates a Person's biography in the database", async () => {
    await peopleColl.insertMany([
      { name: { last: "Wills" }, biography: "Wills was cool" },
      {
        _id: mongoose.Types.ObjectId(personId),
        name: { last: "Crawford" },
        biography: "Crawford was cool",
      },
    ] as unknown as IPerson[]);

    const person = await updateBiography(personId, "Crawford was the best");

    expect(person?.fullName).toBe("Crawford");

    const people = await peopleColl.find().toArray();

    expect(people).toHaveLength(2);
    expect(people[0].name.last).toBe("Wills");
    expect(people[0].biography).toBe("Wills was cool");
    expect(people[1].name.last).toBe("Crawford");
    expect(people[1].biography).toBe("Crawford was the best");
  });
});

import mongoose from "mongoose";
import { Collection, Db } from "mongodb";
import { addPlot, deletePlot, getPlot, getPlots, updatePlot } from "../plot";
import { ICoordinate, IPerson, IPlot, Plot } from "../../models";

let db: Db;

const plotId1 = "612e02f84667bac8a8b749b1";
const plotId2 = "612e0308a5603ac8bce5a7ad";

const mockPlots = [
  {
    _id: mongoose.Types.ObjectId(plotId1),
    plotNumber: 1,
    registeredName: "Whisker",
    coordinates: [
      { lat: -36, lng: 174 },
      { lat: -36, lng: 175 },
      { lat: -37, lng: 175 },
    ],
  },
  {
    _id: mongoose.Types.ObjectId(plotId2),
    plotNumber: 2,
    registeredName: "Kidd",
    coordinates: [
      { lat: -37, lng: 174 },
      { lat: -37, lng: 175 },
      { lat: -38, lng: 175 },
    ],
  },
] as unknown as IPlot[];

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__ + global.__MONGO_DB_NAME__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: false,
  });
  db = mongoose.connection.db;
});

let plotsColl: Collection<IPlot>;
let peopleColl: Collection<IPerson>;

beforeEach(async () => {
  plotsColl = await db.createCollection("plots");
  await Plot.createIndexes();
  peopleColl = await db.createCollection("people");
});

afterEach(async () => {
  await plotsColl.drop();
  await peopleColl.drop();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("services/plot.ts", () => {
  describe("addPlot()", () => {
    it("Fails to add Plot if plotNumber is not unique", async () => {
      await plotsColl.insertOne(mockPlots[0]);

      const coordinates = [
        { lat: -36, lng: 174 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
        { lat: -37, lng: 174 },
      ];
      try {
        await addPlot(1, "Kidd", coordinates);
        fail();
      } catch (e) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(1);
        expect(plots[0].registeredName).toBe("Whisker");
      }
    });

    it("Adds a new Plot in the database", async () => {
      const coordinates = [
        { lat: -36, lng: 174 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
        { lat: -37, lng: 174 },
      ];
      await addPlot(1, "Whisker", coordinates);

      const plots = await plotsColl.find().toArray();

      expect(plots).toHaveLength(1);
      expect(plots[0].plotNumber).toBe(1);
      expect(plots[0].registeredName).toBe("Whisker");
      expect(plots[0].coordinates).toEqual(coordinates);
    });

    it("Fails to add Plot if less than 3 coordinates provided", async () => {
      const coordinates = [
        { lat: -36, lng: 174 },
        { lat: -36, lng: 175 },
      ];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (e) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });

    it("Fails to add Plot if coordinates missing latitude", async () => {
      const coordinates = [
        { lat: -36, lng: 174 },
        { lng: 175 },
        { lat: -37, lng: 175 },
        { lat: -37, lng: 174 },
      ] as unknown as ICoordinate[];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (e) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });

    it("Fails to add Plot if coordinates missing longitude", async () => {
      const coordinates = [
        { lat: -36, lng: 174 },
        { lat: -36, lng: 175 },
        { lat: -37 },
        { lat: -37, lng: 174 },
      ] as unknown as ICoordinate[];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (error) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });

    it("Adds a new Plot in the database when coordinates at bounds", async () => {
      const coordinates = [
        { lat: 90, lng: 180 },
        { lat: 90, lng: -180 },
        { lat: -90, lng: 180 },
        { lat: -90, lng: -180 },
      ];
      await addPlot(1, "Whisker", coordinates);

      const plots = await plotsColl.find().toArray();

      expect(plots).toHaveLength(1);
      expect(plots[0].coordinates).toEqual(coordinates);
    });

    it("Fails to add Plot if latitude is greater than 90", async () => {
      const coordinates = [
        { lat: 90.01, lng: 174 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
      ] as unknown as ICoordinate[];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (error) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });

    it("Fails to add Plot if latitude is less than -90", async () => {
      const coordinates = [
        { lat: -90.01, lng: 174 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
      ] as unknown as ICoordinate[];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (error) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });

    it("Fails to add Plot if longitude is greater than 180", async () => {
      const coordinates = [
        { lat: -36, lng: 180.01 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
      ] as unknown as ICoordinate[];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (error) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });

    it("Fails to add Plot if longitude is less than -180", async () => {
      const coordinates = [
        { lat: -36, lng: -180.01 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
      ] as unknown as ICoordinate[];

      try {
        await addPlot(1, "Whisker", coordinates);
        fail();
      } catch (error) {
        const plots = await plotsColl.find().toArray();

        expect(plots).toHaveLength(0);
      }
    });
  });

  describe("deletePlot()", () => {
    it("Deletes a Plot in the database", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);

      await deletePlot(plotId1);

      const plots = await plotsColl.find().toArray();
      expect(plots).toHaveLength(1);
      expect(plots[0]._id).toStrictEqual(mongoose.Types.ObjectId(plotId2));
    });

    it("Deletes a Plot in the database and unsets plot for matching people", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);
      await peopleColl.insertMany([
        {
          name: { last: "Poop" },
          fullName: "Poop",
          plot: mongoose.Types.ObjectId(plotId1),
          links: [],
          anecdotes: [],
        },
        {
          name: { last: "Crawford" },
          fullName: "Crawford",
          plot: mongoose.Types.ObjectId(plotId2),
          links: [],
          anecdotes: [],
        },
      ] as unknown as IPerson[]);

      await deletePlot(plotId1);

      const plots = await plotsColl.find().toArray();
      expect(plots).toHaveLength(1);
      expect(plots[0]._id).toStrictEqual(mongoose.Types.ObjectId(plotId2));
      const people = await peopleColl.find().toArray();
      expect(people).toHaveLength(2);
      expect(people[0].plot).toBeUndefined();
      expect(people[1].plot).toStrictEqual(mongoose.Types.ObjectId(plotId2));
    });
  });

  describe("getPlots()", () => {
    it("Gets all plots in the database", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);

      const plots = await getPlots();

      expect(plots).toHaveLength(2);
      expect(plots).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ _id: mockPlots[0]._id }),
          expect.objectContaining({ _id: mockPlots[1]._id }),
        ])
      );
    });
  });

  describe("getPlot()", () => {
    it("Gets single plot in the database", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);

      const plot = await getPlot(plotId1);

      expect(plot?.plotNumber).toBe(1);
      expect(plot?.registeredName).toBe("Whisker");
      expect(plot?.coordinates).toEqual(
        expect.arrayContaining([
          expect.objectContaining(mockPlots[0].coordinates[0]),
          expect.objectContaining(mockPlots[0].coordinates[1]),
          expect.objectContaining(mockPlots[0].coordinates[2]),
        ])
      );
    });
  });

  describe("updatePlot()", () => {
    it("Updates a plot's number in the database", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);

      await updatePlot(plotId1, {
        plotNumber: 3,
      });

      const plots = await plotsColl.find().toArray();

      expect(plots).toHaveLength(2);
      expect(plots[0]._id).toStrictEqual(mongoose.Types.ObjectId(plotId1));
      expect(plots[0].plotNumber).toBe(3);
      expect(plots[1]._id).toStrictEqual(mongoose.Types.ObjectId(plotId2));
      expect(plots[1].plotNumber).toBe(2);
    });

    it("Updates a plot's registered name in the database", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);

      await updatePlot(plotId2, {
        registeredName: "Williams",
      });

      const plots = await plotsColl.find().toArray();

      expect(plots).toHaveLength(2);
      expect(plots[0]._id).toStrictEqual(mongoose.Types.ObjectId(plotId1));
      expect(plots[0].registeredName).toBe("Whisker");
      expect(plots[1]._id).toStrictEqual(mongoose.Types.ObjectId(plotId2));
      expect(plots[1].registeredName).toBe("Williams");
    });

    it("Updates a plot's coordinates in the database", async () => {
      await plotsColl.insertMany([mockPlots[0], mockPlots[1]]);

      const coordinates = [
        { lat: -40, lng: 180 },
        { lat: -40, lng: 180 },
        { lat: -40, lng: 180 },
      ];

      await updatePlot(plotId2, {
        coordinates,
      });

      const plots = await plotsColl.find().toArray();

      expect(plots).toHaveLength(2);
      expect(plots[0]._id).toStrictEqual(mongoose.Types.ObjectId(plotId1));
      expect(plots[0].coordinates).toEqual(mockPlots[0].coordinates);
      expect(plots[1]._id).toStrictEqual(mongoose.Types.ObjectId(plotId2));
      expect(plots[1].coordinates).toEqual(coordinates);
    });
  });
});

import request from "supertest";
import createJwksMock, { JWKSMock } from "mock-jwks";
import app from "../../app";
import {
  getPlots,
  getPlot,
  addPlot,
  updatePlot,
  deletePlot,
} from "../../services/plot";
import { getPeopleByPlot } from "../../services/person";
import { Types } from "mongoose";
import { IPerson } from "../../models";
import config from "../../config";

jest.mock("../../services/person");
jest.mock("../../services/plot");

const mockedGetPeopleByPlot = getPeopleByPlot as jest.MockedFunction<
  typeof getPeopleByPlot
>;
const mockedAddPlot = addPlot as jest.MockedFunction<typeof addPlot>;
const mockedDeletePlot = deletePlot as jest.MockedFunction<typeof deletePlot>;
const mockedGetPlots = getPlots as jest.MockedFunction<typeof getPlots>;
const mockedGetPlot = getPlot as jest.MockedFunction<typeof getPlot>;
const mockedUpdatePlot = updatePlot as jest.MockedFunction<typeof updatePlot>;

let jwksMock: JWKSMock;
let token: string;

beforeAll(() => {
  jwksMock = createJwksMock(`https://${config.get("auth0_issuer_domain")}`);
  jwksMock.start();
  token = jwksMock.token({
    aud: config.get("auth0_audience"),
    iss: `https://${config.get("auth0_issuer_domain")}/`,
    sub: "user:123",
  });
});

afterAll(() => {
  jest.clearAllMocks();
  jwksMock.stop();
});

const plotId = "612e02f84667bac8a8b749b1";

describe("routes/plot.ts", () => {
  describe("GET /api/plot", () => {
    it("Responds with status 200 and all plots with no buried", async () => {
      mockedGetPeopleByPlot.mockResolvedValueOnce([]);

      await request(app)
        .get("/api/plot")
        .expect(200, [
          {
            _id: "612e02f84667bac8a8b749b1",
            plotNumber: 1,
            registeredName: "Whisker",
            coordinates: [
              { lat: -36, lng: 174 },
              { lat: -36, lng: 175 },
              { lat: -37, lng: 175 },
            ],
            buried: [],
          },
          {
            _id: "612e0308a5603ac8bce5a7ad",
            plotNumber: 2,
            registeredName: "Kidd",
            coordinates: [
              { lat: -37, lng: 174 },
              { lat: -37, lng: 175 },
              { lat: -38, lng: 175 },
            ],
            buried: [],
          },
        ]);

      expect(mockedGetPlots).toHaveBeenCalledTimes(1);
      expect(mockedGetPeopleByPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPeopleByPlot).toHaveBeenCalledWith();
    });

    it("Responds with status 200 and all plots with buried", async () => {
      mockedGetPeopleByPlot.mockResolvedValueOnce([
        {
          name: { last: "Kelly" },
          dateOfDeath: { year: 1850, month: 10 },
          plot: Types.ObjectId("612e02f84667bac8a8b749b1"),
        },
        {
          name: { first: "Joe", last: "Dirt" },
          dateOfDeath: { year: 1869, month: 10 },
          plot: Types.ObjectId("612e0308a5603ac8bce5a7ad"),
        },
      ] as IPerson[]);

      await request(app)
        .get("/api/plot")
        .expect(200, [
          {
            _id: "612e02f84667bac8a8b749b1",
            plotNumber: 1,
            registeredName: "Whisker",
            coordinates: [
              { lat: -36, lng: 174 },
              { lat: -36, lng: 175 },
              { lat: -37, lng: 175 },
            ],
            buried: [
              {
                name: { last: "Kelly" },
                dateOfDeath: { year: 1850, month: 10 },
              },
            ],
          },
          {
            _id: "612e0308a5603ac8bce5a7ad",
            plotNumber: 2,
            registeredName: "Kidd",
            coordinates: [
              { lat: -37, lng: 174 },
              { lat: -37, lng: 175 },
              { lat: -38, lng: 175 },
            ],
            buried: [
              {
                name: { first: "Joe", last: "Dirt" },
                dateOfDeath: { year: 1869, month: 10 },
              },
            ],
          },
        ]);

      expect(mockedGetPlots).toHaveBeenCalledTimes(1);
      expect(mockedGetPeopleByPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPeopleByPlot).toHaveBeenCalledWith();
    });
  });

  describe("GET /api/plot/:id", () => {
    it("Responds with status 200 and a single plot with no buried", async () => {
      mockedGetPeopleByPlot.mockResolvedValueOnce([]);

      await request(app)
        .get(`/api/plot/${plotId}`)
        .expect(200, {
          _id: "612e02f84667bac8a8b749b1",
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ],
          buried: [],
        });

      expect(mockedGetPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPlot).toHaveBeenCalledWith(plotId);

      expect(mockedGetPeopleByPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPeopleByPlot).toHaveBeenCalledWith(plotId);
    });

    it("Responds with status 200 and a single plot with buried", async () => {
      await request(app)
        .get(`/api/plot/${plotId}`)
        .expect(200, {
          _id: "612e02f84667bac8a8b749b1",
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ],
          buried: [
            {
              name: { first: "Joe", last: "Dirt" },
              dateOfDeath: { year: 1869, month: 10 },
            },
          ],
        });

      expect(mockedGetPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPlot).toHaveBeenCalledWith(plotId);

      expect(mockedGetPeopleByPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPeopleByPlot).toHaveBeenCalledWith(plotId);
    });

    it("Responds with status 400 if ID is invalid", async () => {
      await request(app).get("/api/plot/badid").expect(400, "Invalid plot ID");

      expect(mockedGetPlot).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if no person found with supplied ID", async () => {
      mockedGetPlot.mockResolvedValue(null);

      await request(app).get(`/api/plot/${plotId}`).expect(404, "Not found");

      expect(mockedGetPlot).toHaveBeenCalledTimes(1);
      expect(mockedGetPlot).toHaveBeenCalledWith(plotId);
    });
  });

  describe("POST /api/plot", () => {
    it("Responds with status 201 and created plot", async () => {
      await request(app)
        .post("/api/plot")
        .set("Authorization", `Bearer ${token}`)
        .send({
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ],
        })
        .expect(201)
        .then((res) => {
          expect(res.header).toHaveProperty("location");
          expect(res.body.plotNumber).toBe(1);
          expect(res.body.registeredName).toBe("Whisker");
          expect(res.body.coordinates).toEqual([
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ]);
        });

      expect(mockedAddPlot).toHaveBeenCalledTimes(1);
      expect(mockedAddPlot).toHaveBeenCalledWith(1, "Whisker", [
        { lat: -36, lng: 174 },
        { lat: -36, lng: 175 },
        { lat: -37, lng: 175 },
      ]);
    });

    it("Responds with status 400 if plot number not supplied", async () => {
      await request(app)
        .post("/api/plot")
        .set("Authorization", `Bearer ${token}`)
        .send({
          registeredName: "Whisker",
          coordinates: [
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ],
        })
        .expect(400, "`plotNumber` is required");

      expect(mockedAddPlot).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if registered name not supplied", async () => {
      await request(app)
        .post("/api/plot")
        .set("Authorization", `Bearer ${token}`)
        .send({
          plotNumber: 1,
          coordinates: [
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ],
        })
        .expect(400, "`registeredName` is required");

      expect(mockedAddPlot).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if coordinates not supplied", async () => {
      await request(app)
        .post("/api/plot")
        .set("Authorization", `Bearer ${token}`)
        .send({
          plotNumber: 1,
          registeredName: "Whisker",
        })
        .expect(400, "`coordinates` are required");

      expect(mockedAddPlot).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .post("/api/plot")
        .send({
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36, lng: 174 },
            { lat: -36, lng: 175 },
            { lat: -37, lng: 175 },
          ],
        })
        .expect(401, "No authorization token was found");

      expect(mockedAddPlot).toHaveBeenCalledTimes(0);
    });
  });

  describe("PATCH /api/person/:id", () => {
    it("Responds with status 200 and updated plot", async () => {
      await request(app)
        .patch(`/api/plot/${plotId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36.5, lng: 174 },
            { lat: -36.5, lng: 174.5 },
            { lat: -37, lng: 174.5 },
          ],
        })
        .expect(200)
        .then((res) => {
          expect(res.body.plotNumber).toBe(1);
          expect(res.body.registeredName).toBe("Whisker");
          expect(res.body.coordinates).toEqual([
            { lat: -36.5, lng: 174 },
            { lat: -36.5, lng: 174.5 },
            { lat: -37, lng: 174.5 },
          ]);
        });

      expect(mockedUpdatePlot).toHaveBeenCalledTimes(1);
      expect(mockedUpdatePlot).toHaveBeenCalledWith(plotId, {
        plotNumber: 1,
        registeredName: "Whisker",
        coordinates: [
          { lat: -36.5, lng: 174 },
          { lat: -36.5, lng: 174.5 },
          { lat: -37, lng: 174.5 },
        ],
      });
    });

    it("Responds with status 404 is no plot found with supplied ID", async () => {
      mockedUpdatePlot.mockResolvedValue(null);

      await request(app)
        .patch(`/api/plot/${plotId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36.5, lng: 174 },
            { lat: -36.5, lng: 174.5 },
            { lat: -37, lng: 174.5 },
          ],
        })
        .expect(404, "Not found");

      expect(mockedUpdatePlot).toHaveBeenCalledTimes(1);
      expect(mockedUpdatePlot).toHaveBeenCalledWith(plotId, {
        plotNumber: 1,
        registeredName: "Whisker",
        coordinates: [
          { lat: -36.5, lng: 174 },
          { lat: -36.5, lng: 174.5 },
          { lat: -37, lng: 174.5 },
        ],
      });
    });

    it("Responds with status 400 if schema validation fails", async () => {
      mockedUpdatePlot.mockImplementation(() => {
        throw { _message: "Plot validation failed" };
      });

      await request(app)
        .patch(`/api/plot/${plotId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          plotNumber: "One",
        })
        .expect(400, "Plot validation failed");

      expect(mockedUpdatePlot).toHaveBeenCalledTimes(1);
      expect(mockedUpdatePlot).toHaveBeenCalledWith(plotId, {
        plotNumber: "One",
      });
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .patch(`/api/plot/${plotId}`)
        .send({
          plotNumber: 1,
          registeredName: "Whisker",
          coordinates: [
            { lat: -36.5, lng: 174 },
            { lat: -36.5, lng: 174.5 },
            { lat: -37, lng: 174.5 },
          ],
        })
        .expect(401, "No authorization token was found");

      expect(mockedUpdatePlot).toHaveBeenCalledTimes(0);
    });
  });

  describe("DELETE /api/plot/id", () => {
    it("Responds with status 204", async () => {
      await request(app)
        .delete(`/api/plot/${plotId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      expect(mockedDeletePlot).toHaveBeenCalledTimes(1);
      expect(mockedDeletePlot).toHaveBeenCalledWith(plotId);
    });

    it("Responds with status 404 if no plot found with supplied ID", async () => {
      mockedDeletePlot.mockResolvedValue(null);

      await request(app)
        .delete(`/api/plot/${plotId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404, "Not found");

      expect(mockedDeletePlot).toHaveBeenCalledTimes(1);
      expect(mockedDeletePlot).toHaveBeenCalledWith(plotId);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .delete(`/api/plot/${plotId}`)
        .expect(401, "No authorization token was found");

      expect(mockedDeletePlot).toHaveBeenCalledTimes(0);
    });
  });
});

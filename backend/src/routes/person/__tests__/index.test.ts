import request from "supertest";
import createJwksMock, { JWKSMock } from "mock-jwks";
import app from "../../../app";
import {
  addPerson,
  deletePerson,
  getPlotMembers,
  getPeople,
  getPerson,
  updatePerson,
} from "../../../services/person";
import { deleteFiles } from "../../../services/person/image";
import config from "../../../config";

jest.mock("../../../services/person");
jest.mock("../../../services/person/image");

const mockedAddPerson = addPerson as jest.MockedFunction<typeof addPerson>;
const mockedDeletePerson = deletePerson as jest.MockedFunction<
  typeof deletePerson
>;
const mockedGetPeople = getPeople as jest.MockedFunction<typeof getPeople>;
const mockedGetPerson = getPerson as jest.MockedFunction<typeof getPerson>;
const mockedGetPlotMembers = getPlotMembers as jest.MockedFunction<
  typeof getPlotMembers
>;
const mockedUpdatePerson = updatePerson as jest.MockedFunction<
  typeof updatePerson
>;
const mockedDeleteFiles = deleteFiles as jest.MockedFunction<
  typeof deleteFiles
>;

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

const personId = "53cb6b9b4f4ddef1ad47f943";
const plotId = "612e02f84667bac8a8b749b1";

describe("routes/person/index.ts", () => {
  describe("GET /api/person", () => {
    it("Responds with status 200 and all people", async () => {
      await request(app)
        .get("/api/person")
        .expect(200, [
          { name: { first: "William", last: "Wills" } },
          { name: { last: "Crawford" } },
        ]);

      expect(mockedGetPeople).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/person/:id", () => {
    it("Responds with status 200 and single person", async () => {
      await request(app)
        .get(`/api/person/${personId}`)
        .expect(200, {
          name: { first: "Walter", last: "Murray" },
          biography: "Loving father",
          displayImage: "test-image",
          images: ["test-image1", "test-image2"],
          plot: { _id: plotId },
          plotMembers: [
            {
              name: { first: "David", last: "Murray" },
              fullName: "David Murray",
            },
            {
              name: { first: "Alice", last: "Murray" },
              fullName: "Alice Murray",
            },
          ],
        });

      expect(mockedGetPerson).toHaveBeenCalledTimes(1);
      expect(mockedGetPerson).toHaveBeenCalledWith(personId);
      expect(mockedGetPlotMembers).toHaveBeenCalledTimes(1);
      expect(mockedGetPlotMembers).toHaveBeenCalledWith(personId, plotId);
    });

    it("Responds with status 400 if ID is invalid", async () => {
      await request(app)
        .get("/api/person/badid")
        .expect(400, "Invalid person ID");

      expect(mockedGetPerson).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if no person found with supplied ID", async () => {
      mockedGetPerson.mockResolvedValue(null);

      await request(app)
        .get(`/api/person/${personId}`)
        .expect(404, "Not found");

      expect(mockedGetPerson).toHaveBeenCalledTimes(1);
      expect(mockedGetPerson).toHaveBeenCalledWith(personId);
    });
  });

  describe("POST /api/person", () => {
    it("Responds with status 201 and created person", async () => {
      await request(app)
        .post("/api/person")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: { first: "Eliza", last: "Poop" } })
        .expect(201)
        .then((res) => {
          expect(res.body?.name?.first).toBe("Eliza");
          expect(res.body?.name?.last).toBe("Poop");
        });

      expect(mockedAddPerson).toHaveBeenCalledTimes(1);
      expect(mockedAddPerson).toHaveBeenCalledWith(
        { first: "Eliza", last: "Poop" },
        undefined,
        undefined,
        undefined
      );
    });

    it("Responds with status 400 if last name not supplied", async () => {
      await request(app)
        .post("/api/person")
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400, "`last name` is required");

      expect(mockedAddPerson).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if last name not a string", async () => {
      await request(app)
        .post("/api/person")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: { last: 42060 } })
        .expect(400, "`last name` is not type `string`");

      expect(mockedAddPerson).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if schema validation fails", async () => {
      mockedAddPerson.mockImplementation(() => {
        throw { _message: "Person validation failed" };
      });

      await request(app)
        .post("/api/person")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: { last: "Crawford" },
          dateBuried: { year: "twennytwenny" },
        })
        .expect(400, "Person validation failed");

      expect(mockedAddPerson).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .post("/api/person")
        .send({ name: { last: "Whisker" } })
        .expect(401, "No authorization token was found");

      expect(mockedAddPerson).toHaveBeenCalledTimes(0);
    });
  });

  describe("PATCH /api/person/:id", () => {
    it("Responds with status 200 and updated person", async () => {
      await request(app)
        .patch(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: { first: "Walter", last: "Murray" },
          biography: "Loving father",
        })
        .expect(200)
        .then((res) => {
          expect(res.body?.name?.first).toBe("Walter");
          expect(res.body?.name?.last).toBe("Murray");
          expect(res.body?.biography).toBe("Loving father");
        });

      expect(mockedUpdatePerson).toHaveBeenCalledTimes(1);
      expect(mockedUpdatePerson).toHaveBeenCalledWith(personId, {
        name: { first: "Walter", last: "Murray" },
        biography: "Loving father",
      });
    });

    it("Responds with status 400 if updating name and last name not supplied", async () => {
      await request(app)
        .patch(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: { first: "Walter" } })
        .expect(400, "`last name` is required");

      expect(mockedUpdatePerson).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if updating name and last name not a string", async () => {
      await request(app)
        .patch(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: { last: 42069 } })
        .expect(400, "`last name` is not type `string`");

      expect(mockedUpdatePerson).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if no person found with supplied ID", async () => {
      mockedUpdatePerson.mockResolvedValue(null);

      await request(app)
        .patch(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: { last: "Murray" } })
        .expect(404, "Not found");

      expect(mockedUpdatePerson).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 400 if schema validation fails", async () => {
      mockedUpdatePerson.mockImplementation(() => {
        throw { _message: "Person validation failed" };
      });

      await request(app)
        .patch(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: { last: "Murray" },
          dateBuried: { year: "twennytwenny" },
        })
        .expect(400, "Person validation failed");

      expect(mockedUpdatePerson).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .patch(`/api/person/${personId}`)
        .send({
          name: { last: "Murray" },
        })
        .expect(401, "No authorization token was found");

      expect(mockedUpdatePerson).toHaveBeenCalledTimes(0);
    });
  });

  describe("DELETE /api/person/:id", () => {
    it("Responds with status 204 and deletes all files", async () => {
      await request(app)
        .delete(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      expect(mockedDeletePerson).toHaveBeenCalledTimes(1);
      expect(mockedDeletePerson).toHaveBeenCalledWith(personId);

      expect(mockedDeleteFiles).toHaveBeenCalledTimes(1);
      expect(mockedDeletePerson).toHaveBeenCalledWith(personId);
    });

    it("Responds with status 404 if no person found with supplied ID", async () => {
      mockedDeletePerson.mockResolvedValue(null);

      await request(app)
        .delete(`/api/person/${personId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404, "Not found");

      expect(mockedDeletePerson).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .delete(`/api/person/${personId}`)
        .expect(401, "No authorization token was found");

      expect(mockedDeletePerson).toHaveBeenCalledTimes(0);
    });
  });
});

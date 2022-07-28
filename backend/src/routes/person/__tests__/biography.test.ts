import request from "supertest";
import createJwksMock, { JWKSMock } from "mock-jwks";
import app from "../../../app";
import { getPerson } from "../../../services/person";
import { updateBiography } from "../../../services/person/biography";
import config from "../../../config";

jest.mock("../../../services/person");
jest.mock("../../../services/person/biography");

const mockedGetPerson = getPerson as jest.MockedFunction<typeof getPerson>;
const mockedUpdateBiography = updateBiography as jest.MockedFunction<
  typeof updateBiography
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

describe("routes/person/biography.ts", () => {
  describe("PUT /api/person/:id/biography", () => {
    it("Responds with status 200 and updated biography", async () => {
      await request(app)
        .put(`/api/person/${personId}/biography`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          biography: "Loving mother",
        })
        .expect(200)
        .then((res) => {
          if (res.body?.biography !== "Loving mother") throw Error();
        });

      expect(mockedUpdateBiography).toHaveBeenCalledTimes(1);
      expect(mockedUpdateBiography).toHaveBeenCalledWith(
        personId,
        "Loving mother"
      );
    });

    it("Responds with status 400 if no biography field supplied", async () => {
      await request(app)
        .put(`/api/person/${personId}/biography`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400, "`biography` is required");

      expect(mockedGetPerson).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if no person found with supplied ID", async () => {
      mockedUpdateBiography.mockResolvedValue(null);

      await request(app)
        .put(`/api/person/${personId}/biography`)
        .set("Authorization", `Bearer ${token}`)
        .send({ biography: "Best dad" })
        .expect(404, "Not found");

      expect(mockedUpdateBiography).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 400 if schema validation fails", async () => {
      mockedUpdateBiography.mockImplementation(() => {
        throw { _message: "Person validation failed" };
      });

      await request(app)
        .put(`/api/person/${personId}/biography`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          biography: { wrongFormat: "Awesome father" },
        })
        .expect(400, "Person validation failed");

      expect(mockedUpdateBiography).toHaveBeenCalledTimes(1);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .put(`/api/person/${personId}/biography`)
        .send({
          biography: { content: "Awesome father" },
        })
        .expect(401, "No authorization token was found");

      expect(mockedUpdateBiography).toHaveBeenCalledTimes(0);
    });
  });
});

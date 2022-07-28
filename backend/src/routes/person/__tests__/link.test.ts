import request from "supertest";
import createJwksMock, { JWKSMock } from "mock-jwks";
import app from "../../../app";
import { addLink, deleteLink } from "../../../services/person/link";
import config from "../../../config";

jest.mock("../../../services/person/link");

const mockedAddLink = addLink as jest.MockedFunction<typeof addLink>;
const mockedDeleteLink = deleteLink as jest.MockedFunction<typeof deleteLink>;

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

const personId = "612e02f84667bac8a8b749b1";
const linkId = "612e02f84667bac8a8b71234";

describe("route/person/link.ts", () => {
  describe("POST /api/person/:id/link", () => {
    it("Responds with status 201 and created link", async () => {
      await request(app)
        .post(`/api/person/${personId}/link`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "The Archives",
          url: "www.thearchives.com",
        })
        .expect(201)
        .then((res) => {
          expect(res.header).toHaveProperty("location");
          expect(res.body.title).toBe("The Archives");
          expect(res.body.url).toBe("www.thearchives.com");
        });

      expect(mockedAddLink).toHaveBeenCalledTimes(1);
      expect(mockedAddLink).toHaveBeenCalledWith(
        personId,
        "The Archives",
        "www.thearchives.com"
      );
    });

    it("Responds with status 400 if title is not supplied", async () => {
      await request(app)
        .post(`/api/person/${personId}/link`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          url: "www.thearchives.com",
        })
        .expect(400, "`title` is required");

      expect(mockedAddLink).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if url is not supplied", async () => {
      await request(app)
        .post(`/api/person/${personId}/link`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "The Archives",
        })
        .expect(400, "`url` is required");

      expect(mockedAddLink).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if person is not found", async () => {
      mockedAddLink.mockResolvedValueOnce(null);

      await request(app)
        .post(`/api/person/${personId}/link`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "The Archives",
          url: "www.thearchives.com",
        })
        .expect(404);

      expect(mockedAddLink).toHaveBeenCalledTimes(1);
      expect(mockedAddLink).toHaveBeenCalledWith(
        personId,
        "The Archives",
        "www.thearchives.com"
      );
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .post(`/api/person/${personId}/link/`)
        .send({
          title: "The Archives",
          url: "www.thearchives.com",
        })
        .expect(401, "No authorization token was found");

      expect(mockedAddLink).toHaveBeenCalledTimes(0);
    });
  });

  describe("DELETE /api/person/:id/link/:linkId", () => {
    it("Responds with status 204 if link is deleted", async () => {
      await request(app)
        .delete(`/api/person/${personId}/link/${linkId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      expect(mockedDeleteLink).toHaveBeenCalledTimes(1);
      expect(mockedDeleteLink).toHaveBeenCalledWith(personId, linkId);
    });

    it("Responds with status 404 if person or link is not found", async () => {
      mockedDeleteLink.mockResolvedValue(null);

      await request(app)
        .delete(`/api/person/${personId}/link/${linkId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(mockedDeleteLink).toHaveBeenCalledTimes(1);
      expect(mockedDeleteLink).toHaveBeenCalledWith(personId, linkId);
    });

    it("Responds with status 400 if link ID is invalid", async () => {
      await request(app)
        .delete(`/api/person/${personId}/link/badid`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid link ID");

      expect(mockedDeleteLink).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .delete(`/api/person/${personId}/link/${linkId}`)
        .expect(401, "No authorization token was found");

      expect(mockedDeleteLink).toHaveBeenCalledTimes(0);
    });
  });
});

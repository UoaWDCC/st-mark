import request from "supertest";
import createJwksMock, { JWKSMock } from "mock-jwks";
import app from "../../../app";
import { addAnecdote, deleteAnecdote } from "../../../services/person/anecdote";
import config from "../../../config";

jest.mock("../../../services/person/anecdote");

const mockedAddAnecdote = addAnecdote as jest.MockedFunction<
  typeof addAnecdote
>;
const mockedDeleteAnecdote = deleteAnecdote as jest.MockedFunction<
  typeof deleteAnecdote
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

const personId = "6139af218be53e786b45d9f3";
const anecdoteId = "6139aed66c14767b1f9927e6";

describe("route/person/anecdote.ts", () => {
  describe("POST /api/person/:id/anecdote", () => {
    it("Responds with status 201 and created anecdote", async () => {
      await request(app)
        .post(`/api/person/${personId}/anecdote`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "He once said: Hehe xD",
        })
        .expect(201)
        .then((res) => {
          expect(res.header).toHaveProperty("location");
          expect(res.body.content).toBe("He once said: Hehe xD");
        });

      expect(mockedAddAnecdote).toHaveBeenCalledTimes(1);
      expect(mockedAddAnecdote).toHaveBeenCalledWith(
        personId,
        "He once said: Hehe xD"
      );
    });

    it("Responds with status 400 if content is not supplied", async () => {
      await request(app)
        .post(`/api/person/${personId}/anecdote`)
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .expect(400, "`content` is required");

      expect(mockedAddAnecdote).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if person is not found", async () => {
      mockedAddAnecdote.mockResolvedValueOnce(null);

      await request(app)
        .post(`/api/person/${personId}/anecdote`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "He once said: Hehe xD",
        })
        .expect(404);

      expect(mockedAddAnecdote).toHaveBeenCalledTimes(1);
      expect(mockedAddAnecdote).toHaveBeenCalledWith(
        personId,
        "He once said: Hehe xD"
      );
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .post(`/api/person/${personId}/anecdote`)
        .send({
          content: "He once said: Hehe xD",
        })
        .expect(401, "No authorization token was found");

      expect(mockedAddAnecdote).toHaveBeenCalledTimes(0);
    });
  });

  describe("DELETE /api/person/:id/anecdote/:anecdoteId", () => {
    it("Responds with status 204 if anecdote is deleted", async () => {
      await request(app)
        .delete(`/api/person/${personId}/anecdote/${anecdoteId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      expect(mockedDeleteAnecdote).toHaveBeenCalledTimes(1);
      expect(mockedDeleteAnecdote).toHaveBeenCalledWith(personId, anecdoteId);
    });

    it("Responds with status 404 if person or anecdote is not found", async () => {
      mockedDeleteAnecdote.mockResolvedValue(null);

      await request(app)
        .delete(`/api/person/${personId}/anecdote/${anecdoteId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(mockedDeleteAnecdote).toHaveBeenCalledTimes(1);
      expect(mockedDeleteAnecdote).toHaveBeenCalledWith(personId, anecdoteId);
    });

    it("Responds with status 400 if anecdote ID is invalid", async () => {
      await request(app)
        .delete(`/api/person/${personId}/anecdote/badid`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid anecdote ID");

      expect(mockedDeleteAnecdote).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .delete(`/api/person/${personId}/anecdote/${anecdoteId}`)
        .send({
          content: "He once said: Hehe xD",
        })
        .expect(401, "No authorization token was found");

      expect(mockedDeleteAnecdote).toHaveBeenCalledTimes(0);
    });
  });
});

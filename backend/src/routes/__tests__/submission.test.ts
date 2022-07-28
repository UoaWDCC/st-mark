import request from "supertest";
import app from "../../app";
import { sendMail } from "../../services/submission";
jest.mock("../../services/submission");
jest.mock("../../services/captcha");
jest.mock("axios");

const mockedSendMail = sendMail as jest.MockedFunction<typeof sendMail>;

afterEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/submission", () => {
  it("Message is sent successful and the correct response is returned", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        email: "submitter@email.com",
        content: "content",
        profileName: "dead",
        profileID: "01000001",
        token: "token",
      })
      .expect(201);

    expect(mockedSendMail).toHaveBeenCalledTimes(1);
    expect(mockedSendMail).toHaveBeenCalledWith(
      "throughTest",
      "submitter@email.com",
      "content",
      "dead",
      "01000001"
    );
  });

  it("Message is unsuccessful (400) on missing name", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        email: "submitter@email.com",
        content: "content",
        profileName: "dead",
        profileID: "01000001",
        token: "token",
      })
      .expect(400, "`name` is required");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });

  it("Message is unsuccessful (400) on missing email", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        content: "content",
        profileName: "dead",
        profileID: "01000001",
        token: "token",
      })
      .expect(400, "`email` is required");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });

  it("Message is unsuccessful (400) on missing content", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        email: "submitter@email.com",
        profileName: "dead",
        profileID: "01000001",
        token: "token",
      })
      .expect(400, "`content` is required");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });

  it("Message is unsuccessful (400) on missing profileName", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        email: "submitter@email.com",
        content: "content",
        profileID: "01000001",
        token: "token",
      })
      .expect(400, "`profile name` is required");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });

  it("Message is unsuccessful (400) on missing profileID", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        email: "submitter@email.com",
        content: "content",
        profileName: "dead",
        token: "token",
      })
      .expect(400, "`profileID` is required");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });

  it("Message is unsuccessful (401) on missing token", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        email: "submitter@email.com",
        content: "content",
        profileName: "dead",
        profileID: "01000001",
      })
      .expect(401, "`token` is required");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });

  it("Message is unsuccessful (400) on invalid email", async () => {
    await request(app)
      .post("/api/submission")
      .send({
        name: "throughTest",
        email: "submitteremail.com",
        content: "content",
        profileName: "dead",
        profileID: "01000001",
        token: "token",
      })
      .expect(400, "Invalid email");

    expect(mockedSendMail).toHaveBeenCalledTimes(0);
  });
});

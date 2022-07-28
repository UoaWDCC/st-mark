import request from "supertest";
import createJwksMock, { JWKSMock } from "mock-jwks";
import app from "../../../app";
import {
  addDisplayImage,
  addImage,
  deleteDisplayImage,
  deleteFile,
  deleteImage,
  uploadFile,
} from "../../../services/person/image";
import { existsPerson } from "../../../services/person";
import config from "../../../config";

jest.mock("../../../services/person");
jest.mock("../../../services/person/image");
jest.mock("uuid", () => ({
  v4: () => "00000000-0000-0000-0000-000000000000",
}));

const mockedExistsPerson = existsPerson as jest.MockedFunction<
  typeof existsPerson
>;

const mockedAddDisplayImage = addDisplayImage as jest.MockedFunction<
  typeof addDisplayImage
>;
const mockedAddImage = addImage as jest.MockedFunction<typeof addImage>;
const mockedDeleteDisplayImage = deleteDisplayImage as jest.MockedFunction<
  typeof deleteDisplayImage
>;
const mockedDeleteImage = deleteImage as jest.MockedFunction<
  typeof deleteImage
>;
const mockedUploadFile = uploadFile as jest.MockedFunction<typeof uploadFile>;
const mockedDeleteFile = deleteFile as jest.MockedFunction<typeof deleteFile>;

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
const imageId = "612e0308a5603ac8bce5a7ad";
const randomId = "00000000-0000-0000-0000-000000000000";

const jpgBuffer = Buffer.from(
  "/9j/4AAQSkZJRgABAQAASABIAAD/4QBYRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAAf/aAAwDAQACEQMRAD8A/v4ooooA/9k=",
  "base64"
);
const pngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64"
);

describe("routes/person/image.ts", () => {
  describe("POST /api/person/:personId/display-image", () => {
    it("Responds with status 201 and created image for png", async () => {
      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", pngBuffer, "file.png")
        .expect(201)
        .then((res) => {
          expect(res.header.location).toBe(`${personId}/${randomId}`);
          expect(res.body.filePath).toBe("abc/123");
          expect(res.body.url).toBe("https://storage.com/abc/123");
        });

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(1);
      expect(mockedUploadFile).toHaveBeenCalledWith(
        `${personId}/${randomId}`,
        pngBuffer,
        "image/png"
      );

      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(1);
      expect(mockedAddDisplayImage).toHaveBeenCalledWith(
        personId,
        `${personId}/${randomId}`,
        "https://storage.com/abc/123"
      );
    });

    it("Responds with status 201 and created image for jpg", async () => {
      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", jpgBuffer, "file.jpg")
        .expect(201)
        .then((res) => {
          expect(res.header.location).toBe(`${personId}/${randomId}`);
          expect(res.body.filePath).toBe("abc/123");
          expect(res.body.url).toBe("https://storage.com/abc/123");
        });

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(1);
      expect(mockedUploadFile).toHaveBeenCalledWith(
        `${personId}/${randomId}`,
        jpgBuffer,
        "image/jpeg"
      );

      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(1);
      expect(mockedAddDisplayImage).toHaveBeenCalledWith(
        personId,
        `${personId}/${randomId}`,
        "https://storage.com/abc/123"
      );
    });

    it("Responds with status 400 for invalid file type", async () => {
      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", Buffer.from("invalid-file-buffer"), "file.invalid")
        .expect(400, "File missing or invalid");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(0);
      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if no image provided", async () => {
      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "File missing or invalid");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(0);
      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if person does not exist", async () => {
      mockedExistsPerson.mockResolvedValueOnce(false);

      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", pngBuffer, "file.png")
        .expect(404, "Not found");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 500 if upload fails", async () => {
      mockedUploadFile.mockRejectedValueOnce(true);

      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", pngBuffer, "file.png")
        .expect(500, "Failed to upload image");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(1);
      expect(mockedUploadFile).toHaveBeenCalledWith(
        `${personId}/${randomId}`,
        pngBuffer,
        "image/png"
      );

      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .post(`/api/person/${personId}/display-image`)
        .attach("image", pngBuffer, "file.png")
        .expect(401, "No authorization token was found");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(0);
      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddDisplayImage).toHaveBeenCalledTimes(0);
    });
  });

  describe("DELETE /api/person/:personId/display-image", () => {
    it("Responds with status 204 if display image is deleted", async () => {
      await request(app)
        .delete(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      expect(mockedDeleteDisplayImage).toHaveBeenCalledTimes(1);
      expect(mockedDeleteDisplayImage).toHaveBeenCalledWith(personId);

      expect(mockedDeleteFile).toHaveBeenCalledTimes(1);
      expect(mockedDeleteFile).toHaveBeenCalledWith("abc/123");
    });

    it("Responds with status 404 if person or display image is not found", async () => {
      mockedDeleteDisplayImage.mockResolvedValueOnce(null);

      await request(app)
        .delete(`/api/person/${personId}/display-image`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404, "User or display image does not exist");

      expect(mockedDeleteDisplayImage).toHaveBeenCalledTimes(1);
      expect(mockedDeleteDisplayImage).toHaveBeenCalledWith(personId);

      expect(mockedDeleteFile).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .delete(`/api/person/${personId}/display-image`)
        .expect(401, "No authorization token was found");

      expect(mockedDeleteDisplayImage).toHaveBeenCalledTimes(0);
      expect(mockedDeleteFile).toHaveBeenCalledTimes(0);
    });
  });

  describe("POST /api/person/:personId/image", () => {
    it("Responds with status 201 and created image for png", async () => {
      await request(app)
        .post(`/api/person/${personId}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", pngBuffer, "file.png")
        .expect(201)
        .then((res) => {
          expect(res.header.location).toBe(`${personId}/${randomId}`);
          expect(res.body.filePath).toBe("abc/123");
          expect(res.body.url).toBe("https://storage.com/abc/123");
        });

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(1);
      expect(mockedUploadFile).toHaveBeenCalledWith(
        `${personId}/${randomId}`,
        pngBuffer,
        "image/png"
      );

      expect(mockedAddImage).toHaveBeenCalledTimes(1);
      expect(mockedAddImage).toHaveBeenCalledWith(
        personId,
        `${personId}/${randomId}`,
        "https://storage.com/abc/123"
      );
    });

    it("Responds with status 201 and created image for jpg", async () => {
      await request(app)
        .post(`/api/person/${personId}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", jpgBuffer, "file.jpg")
        .expect(201)
        .then((res) => {
          expect(res.header.location).toBe(`${personId}/${randomId}`);
          expect(res.body.filePath).toBe("abc/123");
          expect(res.body.url).toBe("https://storage.com/abc/123");
        });

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(1);
      expect(mockedUploadFile).toHaveBeenCalledWith(
        `${personId}/${randomId}`,
        jpgBuffer,
        "image/jpeg"
      );

      expect(mockedAddImage).toHaveBeenCalledTimes(1);
      expect(mockedAddImage).toHaveBeenCalledWith(
        personId,
        `${personId}/${randomId}`,
        "https://storage.com/abc/123"
      );
    });

    it("Responds with status 400 for invalid file type", async () => {
      await request(app)
        .post(`/api/person/${personId}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", Buffer.from("invalid-file-buffer"), "file.invalid")
        .expect(400, "File missing or invalid");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(0);
      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if no image provided", async () => {
      await request(app)
        .post(`/api/person/${personId}/image`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "File missing or invalid");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(0);
      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 404 if person does not exist", async () => {
      mockedExistsPerson.mockResolvedValueOnce(false);

      await request(app)
        .post(`/api/person/${personId}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", pngBuffer, "file.png")
        .expect(404, "Not found");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 500 if upload fails", async () => {
      mockedUploadFile.mockRejectedValueOnce(true);

      await request(app)
        .post(`/api/person/${personId}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", pngBuffer, "file.png")
        .expect(500, "Failed to upload image");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(1);
      expect(mockedExistsPerson).toHaveBeenCalledWith(personId);

      expect(mockedUploadFile).toHaveBeenCalledTimes(1);
      expect(mockedUploadFile).toHaveBeenCalledWith(
        `${personId}/${randomId}`,
        pngBuffer,
        "image/png"
      );

      expect(mockedAddImage).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .post(`/api/person/${personId}/image`)
        .attach("image", pngBuffer, "file.png")
        .expect(401, "No authorization token was found");

      expect(mockedExistsPerson).toHaveBeenCalledTimes(0);
      expect(mockedUploadFile).toHaveBeenCalledTimes(0);
      expect(mockedAddImage).toHaveBeenCalledTimes(0);
    });
  });

  describe("DELETE /api/person/:personId/images/:imageId", () => {
    it("Responds with status 204 if image is deleted", async () => {
      await request(app)
        .delete(`/api/person/${personId}/image/${imageId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      expect(mockedDeleteImage).toHaveBeenCalledTimes(1);
      expect(mockedDeleteImage).toHaveBeenCalledWith(personId, imageId);

      expect(mockedDeleteFile).toHaveBeenCalledTimes(1);
      expect(mockedDeleteFile).toHaveBeenCalledWith("abc/123");
    });

    it("Responds with status 404 if person or image is not found", async () => {
      mockedDeleteImage.mockResolvedValueOnce(null);

      await request(app)
        .delete(`/api/person/${personId}/image/${imageId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404, "User or image does not exist");

      expect(mockedDeleteImage).toHaveBeenCalledTimes(1);
      expect(mockedDeleteImage).toHaveBeenCalledWith(personId, imageId);

      expect(mockedDeleteFile).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 400 if image ID is invalid", async () => {
      await request(app)
        .delete(`/api/person/${personId}/image/badid`)
        .set("Authorization", `Bearer ${token}`)
        .expect(400, "Invalid image ID");

      expect(mockedDeleteImage).toHaveBeenCalledTimes(0);
      expect(mockedDeleteFile).toHaveBeenCalledTimes(0);
    });

    it("Responds with status 401 if no Authorization token is provided", async () => {
      await request(app)
        .delete(`/api/person/${personId}/image/${imageId}`)
        .expect(401, "No authorization token was found");

      expect(mockedDeleteImage).toHaveBeenCalledTimes(0);
      expect(mockedDeleteFile).toHaveBeenCalledTimes(0);
    });
  });
});

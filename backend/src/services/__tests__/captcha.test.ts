import axios, { AxiosResponse } from "axios";
import { GoogleReturnProps, verifyCaptchaToken } from "../captcha";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockToken = "mockverificationtoken";

describe("Google RECAPTCHA", () => {
  it("returns true if captcha token is valid.", async () => {
    const mockedResponse: AxiosResponse<GoogleReturnProps> = {
      status: 200,
      data: {
        success: true,
      },
      statusText: "OK",
      headers: {},
      config: {},
    };

    mockedAxios.post.mockResolvedValueOnce(mockedResponse);

    const verified = await verifyCaptchaToken(mockToken);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(verified).toBe(true);
  });

  it("returns false if captcha token is invalid", async () => {
    const mockedResponse: AxiosResponse<GoogleReturnProps> = {
      status: 200,
      data: {
        success: false,
      },
      statusText: "OK",
      headers: {},
      config: {},
    };

    mockedAxios.post.mockResolvedValueOnce(mockedResponse);

    const verified = await verifyCaptchaToken(mockToken);

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(verified).toBe(false);
  });
});

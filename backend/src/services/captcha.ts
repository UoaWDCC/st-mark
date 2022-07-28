import axios from "axios";
import config from "../config";

// props according to the documentation, I couldn't find an actual return type.
// can look at removing these at some point if we don't end up using them.
export interface GoogleReturnProps {
  success: boolean;
  challenge_ts?: Date;
  hostname?: string;
  error_codes?: string[];
}

export const verifyCaptchaToken = async (
  captchaToken: string
): Promise<boolean> => {
  const recaptchaBody = {
    secret: config.get("google_recaptcha_secret_key"),
    response: captchaToken,
  };

  const { data } = await axios.post<GoogleReturnProps>(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams(Object.entries(recaptchaBody)).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { success } = data;

  return success;
};

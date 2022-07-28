import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  // this will return the token that will be sent in the form along with the other information.
  // there is a 2 min timeout to verify before the user has to check again.
  onChange: (value: string | null) => void;
}

const Captcha: React.FC<CaptchaProps> = (props: CaptchaProps) => {
  const { onChange } = props;

  return (
    <ReCAPTCHA
      sitekey={process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY || ""}
      onChange={onChange}
    />
  );
};

export default Captcha;

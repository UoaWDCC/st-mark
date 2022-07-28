import convict from "convict";
import dotenv from "dotenv";

dotenv.config();

const config = convict({
  port: {
    format: "port",
    default: 3001,
    env: "PORT",
  },
  origin: {
    format: "url",
    default: "http://localhost:3000",
    env: "ORIGIN",
  },
  mongo_uri: {
    format: "String",
    default:
      "mongodb+srv://team2022:team2022@cluster0.mww71.mongodb.net/stmarksgraveyard?retryWrites=true&w=majority",
    env: "MONGO_URI",
  },
  google_application_credentials: {
    format: "String",
    default: "google-credentials.json",
    env: "GOOGLE_APPLICATION_CREDENTIALS",
  },
  gcs_bucket: {
    format: "String",
    default: "stmarks-graveyard-images-dev",
    env: "GCS_BUCKET",
  },
  google_recaptcha_secret_key: {
    format: "String",
    default: "",
    env: "GOOGLE_RECAPTCHA_SECRET_KEY",
  },
  mailjet_public_key: {
    format: "String",
    default: "",
    env: "MAILJET_PUBLIC_KEY",
  },
  mailjet_secret_key: {
    format: "String",
    default: "",
    env: "MAILJET_SECRET_KEY",
  },
  mailjet_sender_email: {
    format: "email",
    default: "",
    env: "MAILJET_SENDER_EMAIL",
  },
  mailjet_receiver: {
    format: "email",
    default: "",
    env: "MAILJET_RECEIVER",
  },
  mailjet_email_template: {
    format: "Number",
    default: "",
    env: "MAILJET_EMAIL_TEMPLATE",
  },
  auth0_audience: {
    format: "String",
    default:
      "https://manage.auth0.com/dashboard/au/st-marks-graveyard/applications",
    env: "AUTH0_AUDIENCE",
  },
  auth0_issuer_domain: {
    format: "String",
    default:
      "https://manage.auth0.com/dashboard/au/st-marks-graveyard/applications",
    env: "AUTH0_ISSUER_DOMAIN",
  },
});

config.validate({ allowed: "strict" });

if (process.env.NODE_ENV !== "production") {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = config.get(
    "google_application_credentials"
  );
}

export default config;

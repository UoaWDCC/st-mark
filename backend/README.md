# Express Backend Server

> ## Important: Read the configuration instructions before continuing.

## Environment Variables

> #### This project uses environment variables to handle configuration. These can be set from the command-line or in a `.env` file at the root of this project.

The following environment variables are available to configure this application:

### `PORT`

> Default: `3001`

Determines the port that the server runs on.

### `ORIGIN`

> Default: `http://localhost:3000`

Sets an allowed origin for the server's [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) policy.

### `MONGO_URI`

> Default: `mongodb://localhost:27017/st-marks-graveyard`

Specifies the database to be used by the server.

### `GOOGLE_APPLICATION_CREDENTIALS`

> Default: `google-credentials.json`

Specifies the `KEY_PATH` for [Google Service Account authentication](https://cloud.google.com/docs/authentication/getting-started).

### `GCS_BUCKET`

> Default: `st-marks-graveyard-images`

Specifies which Google Cloud Storage bucket to use for storing images.

### `GOOGLE_RECAPTCHA_SECRET_KEY`

Specifies the key that is used to verify captcha tokens received from the frontend.

### `MAILJET_PUBLIC_KEY`

Specifies the public key used for connecting to Mailjet.

### `MAILJET_SECRET_KEY`

Specifies the secret key used for connecting to Mailjet.

### `MAILJET_SENDER_EMAIL`

Specifies the email which the two keys belong to.

### `MAILJET_RECEIVER`

Specifies the email address to which the emails will be sent to.

### `AUTH0_AUDIENCE`

The Auth0 application client identifier, as specified in [Auth0 Node API Authorization Docs](https://auth0.com/docs/quickstart/backend/nodejs#create-an-api)

### `AUTH0_ISSUER_DOMAIN`

The Auth0 application issuer domain, as specified in [Auth0 Node API Authorization Docs](https://auth0.com/docs/quickstart/backend/nodejs#configure-the-middleware). Don't include `https://`.

## Database

This Backend requires a MongoDB connection to start. For local development, you should
install [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/). For deployment,
a MongoDB URI can be provided through the `MONGO_URI` environment variable.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

The server will reload if you make edits.\

### `npm run build`

Builds the backend for production to the `build` folder.

### `npm test`

Launches the test runner.

### `npm run format`

Formats all files using Prettier

### `npm run lint`

Lints all files using ESLint. Use `npm run lint:fix` to automatically apply available fixes.

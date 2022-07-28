import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import config from "../config";

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.get(
      "auth0_issuer_domain"
    )}/.well-known/jwks.json`,
  }),

  audience: config.get("auth0_audience"),
  issuer: [`https://${config.get("auth0_issuer_domain")}/`],
  algorithms: ["RS256"],
});

export default checkJwt;

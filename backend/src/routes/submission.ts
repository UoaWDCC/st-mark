import { Router } from "express";
import { verifyCaptchaToken } from "../services/captcha";
import { sendMail } from "../services/submission";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, content, profileName, profileID, token } = req.body;

  //check if token is provided
  if (!token) {
    res.status(401).send("`token` is required");
    return;
  }

  //verify token
  const verified = await verifyCaptchaToken(token);
  if (!verified) {
    res.status(401).send("Invalid Captcha Token");
    return;
  }

  // check if all parameters are provided
  if (!name) {
    res.status(400).send("`name` is required");
    return;
  }
  if (!email) {
    res.status(400).send("`email` is required");
    return;
  }
  if (!content) {
    res.status(400).send("`content` is required");
    return;
  }
  if (!profileName) {
    res.status(400).send("`profile name` is required");
    return;
  }
  if (!profileID) {
    res.status(400).send("`profileID` is required");
    return;
  }

  // check for proper email
  const regex = /\S+@\S+\.\S+/;
  if (!regex.test(email)) {
    res.status(400).send("Invalid email");
    return;
  }
  try {
    await sendMail(name, email, content, profileName, profileID);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send("Failed to send email");
  }
});

export default router;

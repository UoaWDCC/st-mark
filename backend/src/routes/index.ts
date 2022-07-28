import { Router } from "express";
import person from "./person";
import plot from "./plot";
import submission from "./submission";

const routes = Router();

routes.use("/person", person);
routes.use("/plot", plot);
routes.use("/submission", submission);
routes.get("/wakeup", (_req, res) => res.send("\uD83D\uDE34"));

export default routes;

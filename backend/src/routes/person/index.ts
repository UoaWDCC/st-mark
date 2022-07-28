import { Router } from "express";
import { isValidObjectId } from "mongoose";
import {
  addPerson,
  getPerson,
  getPeople,
  updatePerson,
  deletePerson,
  getPlotMembers,
} from "../../services/person";
import anecdote from "./anecdote";
import biography from "./biography";
import images from "./image";
import link from "./link";
import { deleteFiles } from "../../services/person/image";
import { IPlot } from "../../models";
import checkJwt from "../../auth/checkJwt";

const router = Router();

router.get("/", async (_req, res) => {
  const people = await getPeople();

  res.status(200).json(people);
});

router.use("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    next();
  } else {
    res.status(400).send("Invalid person ID");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const person = await getPerson(id);

  if (person !== null) {
    const plotMembers = person.plot
      ? await getPlotMembers(id, (person.plot as IPlot)._id.toString())
      : [];

    res.status(200).json({ ...person, plotMembers });
  } else {
    res.status(404).send("Not found");
  }
});

// Verify client is authorized
router.use("/", checkJwt, async (req, res, next) => {
  next();
});

router.post("/", async (req, res) => {
  const { name, dateOfBirth, dateOfDeath, biography } = req.body;

  if (name?.last === undefined) {
    res.status(400).send("`last name` is required");
    return;
  } else if (typeof name?.last !== "string") {
    res.status(400).send("`last name` is not type `string`");
    return;
  }

  try {
    const person = await addPerson(name, dateOfBirth, dateOfDeath, biography);
    res
      .status(201)
      .header("Location", `/api/person/${person._id}`)
      .json(person);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // if updating name, ensure last name is supplied
  if (name) {
    if (name?.last === undefined) {
      res.status(400).send("`last name` is required");
      return;
    } else if (typeof name?.last !== "string") {
      res.status(400).send("`last name` is not type `string`");
      return;
    }
  }

  let person;

  try {
    person = await updatePerson(id, req.body);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
    return;
  }

  if (person) {
    res.status(200).json(person);
  } else {
    res.status(404).send("Not found");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const person = await deletePerson(id);

  if (person) {
    await deleteFiles(id);

    res.sendStatus(204);
  } else {
    res.status(404).send("Not found");
  }
});

router.use("/", biography);
router.use("/", images);
router.use("/", link);
router.use("/", anecdote);

export default router;

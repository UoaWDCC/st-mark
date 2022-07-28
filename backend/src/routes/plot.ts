import { Router } from "express";
import {
  getPlots,
  getPlot,
  addPlot,
  updatePlot,
  deletePlot,
} from "../services/plot";
import { isValidObjectId } from "mongoose";
import { getPeopleByPlot } from "../services/person";
import { IPerson } from "../models";
import checkJwt from "../auth/checkJwt";

const router = Router();

router.get("/", async (_req, res) => {
  const plots = await getPlots();

  // Retrieve all people with plot and group by plot
  const buriedByPlot = (await getPeopleByPlot()).reduce<Map<string, IPerson[]>>(
    (map, person) => {
      if (person.plot === undefined) return map;

      let people = map.get(person.plot.toString());
      if (people === undefined) {
        people = [];
        map.set(person.plot.toString(), people);
      }
      people.push({ ...person, plot: undefined } as IPerson);

      return map;
    },
    new Map()
  );

  res.status(200).json(
    plots.map((plot) => ({
      ...plot,
      buried: buriedByPlot.get(plot._id.toString()) || [],
    }))
  );
});

router.use("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    next();
  } else {
    res.status(400).send("Invalid plot ID");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const plot = await getPlot(id);

  if (plot) {
    const buried = await getPeopleByPlot(id);

    res.status(200).json({ ...plot, buried });
  } else {
    res.status(404).send("Not found");
  }
});

// Verify client is authorized
router.use("/", checkJwt, async (req, res, next) => {
  next();
});

router.post("/", async (req, res) => {
  const { plotNumber, registeredName, coordinates } = req.body;

  if (plotNumber === undefined) {
    res.status(400).send("`plotNumber` is required");
    return;
  }
  if (registeredName === undefined) {
    res.status(400).send("`registeredName` is required");
    return;
  }
  if (coordinates === undefined) {
    res.status(400).send("`coordinates` are required");
    return;
  }

  try {
    const plot = await addPlot(plotNumber, registeredName, coordinates);
    res.status(201).header("Location", `/api/plot/${plot._id}`).json(plot);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  let plot;

  try {
    plot = await updatePlot(id, req.body);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
    return;
  }

  if (plot) {
    res.status(200).json(plot);
  } else {
    res.status(404).send("Not found");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const plot = await deletePlot(id);

  if (plot) {
    res.sendStatus(204);
  } else {
    res.status(404).send("Not found");
  }
});

export default router;

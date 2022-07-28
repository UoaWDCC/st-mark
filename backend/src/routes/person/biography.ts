import { Router } from "express";
import { updateBiography } from "../../services/person/biography";

const router = Router();

router.put("/:id/biography", async (req, res) => {
  const { id } = req.params;
  const { biography } = req.body;

  if (!biography) {
    res.status(400).send("`biography` is required");
    return;
  }

  let person;

  try {
    person = await updateBiography(id, biography);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
    return;
  }

  if (person) {
    res.status(200).json({ biography: person.biography });
  } else {
    res.status(404).send("Not found");
  }
});

export default router;

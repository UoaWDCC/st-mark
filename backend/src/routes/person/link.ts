import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { addLink, deleteLink } from "../../services/person/link";

const router = Router();

router.post("/:id/link", async (req, res) => {
  const { id: personId } = req.params;
  const { title, url } = req.body;

  if (title === undefined) {
    res.status(400).send("`title` is required");
    return;
  }
  if (url === undefined) {
    res.status(400).send("`url` is required");
    return;
  }

  let link;

  try {
    link = await addLink(personId, title, url);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
    return;
  }

  if (link) {
    res
      .status(201)
      .header("Location", `/api/person/${personId}/link/${link._id}`)
      .json(link);
  } else {
    res.sendStatus(404);
  }
});

router.use("/:id/link/:linkId", async (req, res, next) => {
  const { linkId } = req.params;

  if (isValidObjectId(linkId)) {
    next();
  } else {
    res.status(400).send("Invalid link ID");
  }
});

router.delete("/:id/link/:linkId", async (req, res) => {
  const { id: personId, linkId } = req.params;

  const link = await deleteLink(personId, linkId);

  if (link) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

export default router;

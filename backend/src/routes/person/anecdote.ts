import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { addAnecdote, deleteAnecdote } from "../../services/person/anecdote";

const router = Router();

router.post("/:id/anecdote", async (req, res) => {
  const { id: personId } = req.params;
  const { content } = req.body;

  if (content === undefined) {
    res.status(400).send("`content` is required");
    return;
  }

  let anecdote;

  try {
    anecdote = await addAnecdote(personId, content);
  } catch (error) {
    res.status(400).send(error._message || "Validation Error");
    return;
  }

  if (anecdote) {
    res
      .status(201)
      .header("Location", `/api/person/${personId}/anecdote/${anecdote._id}`)
      .json(anecdote);
  } else {
    res.sendStatus(404);
  }
});

router.use("/:id/anecdote/:anecdoteId", async (req, res, next) => {
  const { anecdoteId } = req.params;

  if (isValidObjectId(anecdoteId)) {
    next();
  } else {
    res.status(400).send("Invalid anecdote ID");
  }
});

router.delete("/:id/anecdote/:anecdoteId", async (req, res) => {
  const { id: personId, anecdoteId } = req.params;

  const anecdote = await deleteAnecdote(personId, anecdoteId);

  if (anecdote) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

export default router;

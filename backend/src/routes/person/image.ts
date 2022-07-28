import { Router, Request } from "express";
import {
  deleteFile,
  uploadFile,
  addImage,
  addDisplayImage,
  deleteDisplayImage,
  deleteImage,
} from "../../services/person/image";
import { existsPerson } from "../../services/person";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { isValidObjectId } from "mongoose";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MiB
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
      callback(null, true);
    callback(null, false);
  },
});

const router = Router();

router.post(
  "/:personId/display-image",
  upload.single("image"),
  async (req, res) => {
    const { personId } = req.params;

    if (!req.file) {
      res.status(400).send("File missing or invalid");
      return;
    }

    if (!(await existsPerson(personId))) {
      res.status(404).send("Not found");
      return;
    }

    try {
      const filePath = `${personId}/${uuid()}`;
      const url = await uploadFile(
        filePath,
        req.file.buffer,
        req.file.mimetype
      );
      const image = await addDisplayImage(personId, filePath, url);

      res.status(201).location(filePath).json(image);
    } catch (error) {
      res.status(500).send("Failed to upload image");
    }
  }
);

router.delete("/:personId/display-image", async (req, res) => {
  const { personId } = req.params;

  const image = await deleteDisplayImage(personId);
  if (image) {
    await deleteFile(image?.filePath);

    res.sendStatus(204);
  } else {
    res.status(404).send("User or display image does not exist");
  }
});

router.post("/:personId/image", upload.single("image"), async (req, res) => {
  const { personId } = req.params;

  if (!req.file) {
    res.status(400).send("File missing or invalid");
    return;
  }

  if (!(await existsPerson(personId))) {
    res.status(404).send("Not found");
    return;
  }

  try {
    const filePath = `${personId}/${uuid()}`;
    const url = await uploadFile(filePath, req.file.buffer, req.file.mimetype);
    const image = await addImage(personId, filePath, url);

    res.status(201).location(filePath).json(image);
  } catch (error) {
    res.status(500).send("Failed to upload image");
  }
});

router.use("/:personId/image/:imageId", async (req, res, next) => {
  const { imageId } = req.params;

  if (isValidObjectId(imageId)) {
    next();
  } else {
    res.status(400).send("Invalid image ID");
  }
});

router.delete("/:personId/image/:imageId", async (req, res) => {
  const { personId, imageId } = req.params;

  const image = await deleteImage(personId, imageId);

  if (image) {
    await deleteFile(image.filePath);

    res.sendStatus(204);
  } else {
    res.status(404).send("User or image does not exist");
  }
});

export default router;

import { Storage } from "@google-cloud/storage";
import { IImage, Image, Person } from "../../models";
import config from "../../config";

const storage = new Storage();

const bucket = storage.bucket(config.get("gcs_bucket") || "");

export const addDisplayImage = async (
  personId: string,
  filePath: string,
  url: string
): Promise<IImage | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const image = new Image({ filePath, url });
  await image.save();

  person.displayImage = image._id;
  await person.save();

  return image;
};

export const deleteDisplayImage = async (
  personId: string
): Promise<IImage | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const image = await Image.findByIdAndDelete(person.displayImage);
  if (image) await person.update({ $unset: { displayImage: true } });

  return image;
};

export const addImage = async (
  personId: string,
  filePath: string,
  url: string
): Promise<IImage | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const image = new Image({ filePath, url });
  await image.save();

  person.images.push(image._id);

  await person.save();

  return image;
};

export const deleteImage = async (
  personId: string,
  imageId: string
): Promise<IImage | null> => {
  const person = await Person.findById(personId);

  if (!person) return null;

  const image = await Image.findByIdAndDelete(imageId);
  if (image) await person.update({ $pull: { images: imageId } });

  return image;
};

export const uploadFile = async (
  filePath: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> => {
  await bucket
    .file(filePath)
    .save(buffer, { contentType: mimeType, resumable: false });

  return `https://storage.googleapis.com/${config.get(
    "gcs_bucket"
  )}/${filePath}`;
};

export const deleteFile = async (filePath: string): Promise<void> => {
  await bucket.file(filePath).delete();
};

export const deleteFiles = async (folder: string): Promise<void> => {
  await bucket.deleteFiles({ prefix: folder });
};

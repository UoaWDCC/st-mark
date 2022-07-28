import { model, Schema, Types } from "mongoose";

export interface IImage {
  _id: Types.ObjectId;
  filePath: string;
  url: string;
}

const imageSchema = new Schema<IImage>({
  filePath: { type: String, required: true },
  url: { type: String, required: true },
});

export default model<IImage>("Image", imageSchema);

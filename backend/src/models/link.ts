import { model, Schema, Types } from "mongoose";

export interface ILink {
  _id: Types.ObjectId;
  title: string;
  url: string;
}

const linkSchema = new Schema<ILink>({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export default model<ILink>("Link", linkSchema);

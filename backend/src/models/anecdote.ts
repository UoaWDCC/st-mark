import { model, Schema, Types } from "mongoose";

export interface IAnecdote {
  _id: Types.ObjectId;
  content: string;
}

const anecdoteSchema = new Schema<IAnecdote>({
  content: {
    type: String,
    required: true,
  },
});

export default model<IAnecdote>("Anecdote", anecdoteSchema);

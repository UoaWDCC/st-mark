import { model, PopulatedDoc, Schema, Types } from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import { getFullName } from "../utils/getFullName";
import { Anecdote, IAnecdote, IImage, ILink, Image, IPlot, Link } from ".";

export interface IName {
  first?: string;
  middles?: string;
  last: string;
}

export interface IDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface IPerson {
  _id: Types.ObjectId;
  name: IName;
  readonly fullName: string;
  dateOfBirth?: IDate;
  dateOfDeath?: IDate;
  displayImage?: PopulatedDoc<IImage>;
  biography?: string;
  plot?: PopulatedDoc<IPlot>;
  images: PopulatedDoc<IImage>[];
  links: PopulatedDoc<ILink>[];
  anecdotes: PopulatedDoc<IAnecdote>[];
}

const personSchema = new Schema<IPerson>(
  {
    name: {
      first: String,
      middles: String,
      last: { type: String, required: true },
    },
    dateOfBirth: {
      year: Number,
      month: { type: Number, min: 1, max: 12 },
      day: Number,
    },
    dateOfDeath: {
      year: Number,
      month: { type: Number, min: 1, max: 12 },
      day: Number,
    },
    displayImage: { type: Schema.Types.ObjectId, ref: "Image" },
    biography: String,
    plot: { type: Schema.Types.ObjectId, ref: "Plot" },
    images: { type: [{ type: Schema.Types.ObjectId, ref: "Image" }] },
    links: { type: [{ type: Schema.Types.ObjectId, ref: "Link" }] },
    anecdotes: { type: [{ type: Schema.Types.ObjectId, ref: "Anecdote" }] },
  },
  { toObject: { virtuals: true } }
);

personSchema
  .virtual("fullName")
  .get(function (this: Omit<IPerson, "fullName">) {
    return getFullName(this.name);
  });
personSchema.index({ plot: 1 });
personSchema.plugin(mongooseLeanVirtuals as never);

// middleware to delete documents associated with a person when that person is deleted from the db
personSchema.pre("findOneAndDelete", async function (this, next) {
  const person = await this.model.findOne(this.getQuery());
  if (person) {
    await Image.deleteMany({
      _id: { $in: [...person.images, person.displayImage] },
    });
    await Link.deleteMany({ _id: { $in: person.links } });
    await Anecdote.deleteMany({ _id: { $in: person.anecdotes } });
  }
  next();
});

export default model<IPerson>("Person", personSchema);

import { model, Schema, Types } from "mongoose";

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IPlot {
  _id: Types.ObjectId;
  plotNumber: number;
  registeredName: string;
  coordinates: ICoordinate[];
}

const plotSchema = new Schema<IPlot>({
  plotNumber: { type: Number, required: true, unique: true },
  registeredName: { type: String, required: true },
  coordinates: {
    type: [
      {
        _id: false,
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 },
      },
    ],
    validate: {
      validator: (coordinates: ICoordinate[]) => coordinates.length >= 3,
      message: "Plot requires at least 3 coordinates",
    },
  },
});

export default model<IPlot>("Plot", plotSchema);

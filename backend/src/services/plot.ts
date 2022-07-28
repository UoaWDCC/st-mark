import { Plot, IPlot, ICoordinate, Person } from "../models";
import { UpdateQuery } from "mongoose";

export const addPlot = async (
  plotNumber: number,
  registeredName: string,
  coordinates: ICoordinate[]
): Promise<IPlot> => {
  const plot = new Plot();

  plot.plotNumber = plotNumber;
  plot.registeredName = registeredName;
  plot.coordinates = coordinates;

  await plot.save();

  return plot.toObject();
};

export const deletePlot = async (plotId: string): Promise<IPlot | null> => {
  const plot = await Plot.findByIdAndDelete(plotId).lean().exec();
  if (plot) {
    await Person.updateMany({ plot: plotId }, { $unset: { plot } });
  }
  return plot;
};

export const getPlots = async (): Promise<IPlot[]> => {
  return Plot.find().lean().exec();
};

export const getPlot = async (plotId: string): Promise<IPlot | null> => {
  return Plot.findById(plotId).lean().exec();
};

export const updatePlot = async (
  plotId: string,
  update: UpdateQuery<IPlot>
): Promise<IPlot | null> => {
  return Plot.findByIdAndUpdate(plotId, update, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();
};

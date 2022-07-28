import { ICoordinate } from "../../../../types/schema";

// Helper function to find the average of an array of ICoordinate
const averageCoordinates = (coordinates: ICoordinate[]): ICoordinate => {
  const coordinatesSum = coordinates.reduce(
    (coordinatesSum, coordinates) => {
      coordinatesSum.lat += coordinates.lat;
      coordinatesSum.lng += coordinates.lng;
      return coordinatesSum;
    },
    { lat: 0, lng: 0 }
  );

  return {
    lat: coordinatesSum.lat / coordinates.length,
    lng: coordinatesSum.lng / coordinates.length,
  };
};

export default averageCoordinates;

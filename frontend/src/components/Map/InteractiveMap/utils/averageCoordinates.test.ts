import averageCoordinates from "./averageCoordinates";
import { ICoordinate } from "../../../../types/schema";

const coordinates: ICoordinate[] = [
  { lat: 5, lng: 10 },
  { lat: 2, lng: 15 },
  { lat: 3, lng: 5 },
  { lat: 30, lng: 2 },
];

describe("averageCoordinates", () => {
  it("Calculates the average of an array of ICoordinate", () => {
    const result = averageCoordinates(coordinates);

    expect(result.lat).toBe(10);
    expect(result.lng).toBe(8);
  });
});

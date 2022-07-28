export const addPlot = jest.fn(async () => ({
  _id: "612e02f84667bac8a8b749b1",
  plotNumber: 1,
  registeredName: "Whisker",
  coordinates: [
    { lat: -36, lng: 174 },
    { lat: -36, lng: 175 },
    { lat: -37, lng: 175 },
  ],
}));

export const deletePlot = jest.fn(async () => ({
  _id: "612e02f84667bac8a8b749b1",
  plotNumber: 1,
  registeredName: "Whisker",
  coordinates: [
    { lat: -36, lng: 174 },
    { lat: -36, lng: 175 },
    { lat: -37, lng: 175 },
  ],
}));

export const getPlots = jest.fn(async () => [
  {
    _id: "612e02f84667bac8a8b749b1",
    plotNumber: 1,
    registeredName: "Whisker",
    coordinates: [
      { lat: -36, lng: 174 },
      { lat: -36, lng: 175 },
      { lat: -37, lng: 175 },
    ],
  },
  {
    _id: "612e0308a5603ac8bce5a7ad",
    plotNumber: 2,
    registeredName: "Kidd",
    coordinates: [
      { lat: -37, lng: 174 },
      { lat: -37, lng: 175 },
      { lat: -38, lng: 175 },
    ],
  },
]);

export const getPlot = jest.fn(async () => ({
  _id: "612e02f84667bac8a8b749b1",
  plotNumber: 1,
  registeredName: "Whisker",
  coordinates: [
    { lat: -36, lng: 174 },
    { lat: -36, lng: 175 },
    { lat: -37, lng: 175 },
  ],
}));

export const updatePlot = jest.fn(async () => ({
  _id: "612e02f84667bac8a8b749b1",
  plotNumber: 1,
  registeredName: "Whisker",
  coordinates: [
    { lat: -36.5, lng: 174 },
    { lat: -36.5, lng: 174.5 },
    { lat: -37, lng: 174.5 },
  ],
}));

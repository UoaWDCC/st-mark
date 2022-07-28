export const addDisplayImage = jest.fn(async () => ({
  _id: "612e0308a5603ac8bce5a7ad",
  filePath: "abc/123",
  url: "https://storage.com/abc/123",
}));

export const deleteDisplayImage = jest.fn(async () => ({
  _id: "612e0308a5603ac8bce5a7ad",
  filePath: "abc/123",
  url: "https://storage.com/abc/123",
}));

export const addImage = jest.fn(async () => ({
  _id: "612e0308a5603ac8bce5a7ad",
  filePath: "abc/123",
  url: "https://storage.com/abc/123",
}));

export const deleteImage = jest.fn(async () => ({
  _id: "612e0308a5603ac8bce5a7ad",
  filePath: "abc/123",
  url: "https://storage.com/abc/123",
}));

export const uploadFile = jest.fn(async () => "https://storage.com/abc/123");

export const deleteFile = jest.fn(async () => null);

export const deleteFiles = jest.fn(async () => null);

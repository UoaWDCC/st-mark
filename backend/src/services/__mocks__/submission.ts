// exporting something to say that the function was successful in its call
export const sendMail = jest.fn(async () => ({
  body: {
    Messages: [{}],
  },
}));

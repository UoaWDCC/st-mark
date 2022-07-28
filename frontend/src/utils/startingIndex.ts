export const getStartingIndex = (
  pathname: string,
  tabNames: string[]
): number => {
  for (let i = 0; i < tabNames.length; i++) {
    // average way to do it at the moment, but works for the most part.
    if (pathname.includes(tabNames[i])) {
      return i;
    }
  }

  return 0;
};

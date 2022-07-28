export const range = (min: number, max: number): number[] => {
  const years = [];
  for (let i = min; i <= max; i++) {
    years.push(i);
  }
  return years;
};

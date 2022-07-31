import { IPlot } from "../../../../types/schema";
import { filterWithinWeek } from "../../../../utils/filter";

// // Helper function to find the plots with deathdate matching today
const getAnniversaryPlots = (plots: IPlot[]): IPlot[] => {
  const testDate = new Date(2022, 6, 12);

  const anniversaryPlots = plots.filter((plot) => {
    const people = plot.buried;
    const matchedPeople = filterWithinWeek(people, testDate);
    return matchedPeople.length !== 0;
  });

  return anniversaryPlots;

  // 	// const today = new Date();
  // 	// const todayIDate = {
  // 	// 	month: today.getMonth() + 1,
  // 	// 	day: today.getDate()
  // 	// }
};

export default getAnniversaryPlots;

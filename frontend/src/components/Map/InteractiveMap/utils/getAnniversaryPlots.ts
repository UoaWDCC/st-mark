import { IPlot } from "../../../../types/schema";
import { filterWithinWeek } from "../../../../utils/filter";

// // Helper function to find the plots with deathdate matching today
const getAnniversaryPlots = (plots: IPlot[]): IPlot[] => {
  const today = new Date();

  const anniversaryPlots = plots.filter((plot) => {
    const people = plot.buried;
    const matchedPeople = filterWithinWeek(people, today);
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

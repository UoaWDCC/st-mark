import React, { useState, useEffect, useMemo } from "react";
import { Select, FormControl, FormHelperText } from "@mui/material";
import { monthStrings } from "../../../../../utils/dates";
import { range } from "../../../../../utils/range";
import { IDate } from "../../../../../types/schema";
import styles from "./DateSelector.module.css";

interface DateSelectorProps {
  date: IDate | undefined;
  onChange: (date: IDate) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  date,
  onChange,
}: DateSelectorProps) => {
  const [year, setYear] = useState(date?.year);
  const [month, setMonth] = useState(date?.month);
  const [day, setDay] = useState(date?.day);

  const updateValue = (
    value: string,
    setter: (value: number | undefined) => void
  ) => {
    +value ? setter(+value) : setter(undefined);
  };

  const [maxDay, setMaxDay] = useState(31);

  const dayOptions = useMemo(() => range(1, maxDay), [maxDay]);
  const yearOptions = useMemo(() => range(1700, new Date().getFullYear()), []);

  useEffect(() => {
    onChange({ year: year, month: month, day: day });
    // Set max day given month and year
    year && month ? setMaxDay(new Date(year, month, 0).getDate()) : 0;
  }, [year, month, day, onChange]);

  useEffect(() => {
    if (day && day > maxDay) setDay(undefined);
  }, [maxDay, day]);

  return (
    <div className={styles.container}>
      <FormControl>
        <Select
          value={day}
          inputProps={{ "aria-label": "day-select" }}
          onChange={(e) => updateValue(e.target.value as string, setDay)}
          color="secondary"
          className={styles.select}
          native
        >
          <option>None</option>
          {dayOptions.map((day) => (
            <option key={`day-${day}`} value={day}>
              {day}
            </option>
          ))}
        </Select>
        <FormHelperText>Day</FormHelperText>
      </FormControl>

      <FormControl>
        <Select
          value={month}
          inputProps={{ "aria-label": "month-select" }}
          onChange={(e) => updateValue(e.target.value as string, setMonth)}
          color="secondary"
          className={styles.select}
          native
        >
          <option>None</option>
          {monthStrings.map((month, index) => (
            <option key={`month-${month}`} value={index + 1}>
              {month}
            </option>
          ))}
        </Select>
        <FormHelperText>Month</FormHelperText>
      </FormControl>

      <FormControl>
        <Select
          value={year}
          inputProps={{ "aria-label": "year-select" }}
          onChange={(e) => updateValue(e.target.value as string, setYear)}
          color="secondary"
          className={styles.select}
          native
        >
          <option>None</option>
          {yearOptions.map((year) => (
            <option key={`year-${year}`} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <FormHelperText>Year</FormHelperText>
      </FormControl>
    </div>
  );
};

export default DateSelector;

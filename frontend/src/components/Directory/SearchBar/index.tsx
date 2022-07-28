import React from "react";
import { Paper, InputBase, Tooltip, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import styles from "./SearchBar.module.css";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Dialog from "@mui/material/Dialog";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { IDate } from "../../../types/schema";

import { getDate, getMonth, getYear } from "date-fns";

import IconButton from "@mui/material/IconButton";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Popover from "@mui/material/Popover";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface SearchBarProps {
  onSearchTermChange: (newValue: string) => void;
  onDeathDateChange: (newDate: IDate) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopOver = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const openDatePicker = Boolean(anchorEl);
  const id = openDatePicker ? "simple-popover" : undefined;

  const dateTheme = createTheme({
    palette: {
      // mode: "dark"
      // background: {
      //   paper: '#e3f2fd'
      // },
    },
  });

  const { onSearchTermChange, onDeathDateChange } = props;

  const [date, setDate] = React.useState<Date | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(date);

  return (
    <Paper className={styles.container}>
      <div className={styles.searchBar}>
        <InputBase
          placeholder="Search by name..."
          inputProps={{ "aria-label": "search" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onSearchTermChange(e.target.value);
          }}
          className={styles.searchInput}
          startAdornment={
            <InputAdornment position="start">
              <div>
                <IconButton
                  onClick={handleOpenPopOver}
                  sx={{ p: "10px" }}
                  aria-label="menu"
                >
                  <DateRangeIcon />
                </IconButton>
                <Popover
                  id={id}
                  open={openDatePicker}
                  anchorEl={anchorEl}
                  onClose={handleClosePopOver}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <ThemeProvider theme={dateTheme}>
                      <DatePicker
                        className="date-picker"
                        // views={['year', 'month', 'day']}
                        openTo="year"
                        minDate={new Date(1800, 0, 1)}
                        value={date}
                        onChange={(newDateValue: Date | null) => {
                          setDate(newDateValue);
                          newDateValue
                            ? onDeathDateChange({
                                year: getYear(newDateValue),
                                month: getMonth(newDateValue) + 1,
                                day: getDate(newDateValue),
                              })
                            : onDeathDateChange({});
                        }}
                        renderInput={(params) => {
                          console.log(params.inputProps);
                          return (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => {
                                          setDate(null);
                                          onDeathDateChange({});
                                        }}
                                      >
                                        <AutorenewRoundedIcon />
                                      </IconButton>
                                    </InputAdornment>
                                    {params.InputProps?.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          );
                        }}
                      />
                    </ThemeProvider>
                  </LocalizationProvider>
                </Popover>
              </div>
            </InputAdornment>
          }
        />
        <Tooltip title="Search">
          <SearchIcon onClick={handleClickOpen} />
        </Tooltip>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={dateTheme}>
            <StaticDatePicker
              className="date-picker"
              views={["year", "month", "day"]}
              openTo="year"
              value={date}
              onChange={(newDateValue: Date | null) => {
                setDate(newDateValue);
                newDateValue
                  ? onDeathDateChange({
                      year: getYear(newDateValue),
                      month: getMonth(newDateValue) + 1,
                      day: getDate(newDateValue),
                    })
                  : onDeathDateChange({});
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </ThemeProvider>
        </LocalizationProvider>
      </Dialog>
    </Paper>
  );
};

export default SearchBar;

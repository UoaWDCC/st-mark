import React from "react";
import { Paper, InputBase, Tooltip, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import styles from "./SearchBar.module.css";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Popover from "@mui/material/Popover";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface SearchBarProps {
  onSearchTermChange: (newValue: string) => void;
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
      mode: "light",
    },
  });

  const { onSearchTermChange } = props;

  const [date, setDate] = React.useState<Date | null>(null);

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
                        views={["year", "month", "day"]}
                        openTo="month"
                        minDate={new Date(1800, 0)}
                        value={date}
                        onChange={(newDateValue: Date | null) => {
                          setDate(newDateValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </ThemeProvider>
                  </LocalizationProvider>
                </Popover>
              </div>
            </InputAdornment>
          }
        />
        <InputBase />
        <Tooltip title="Search">
          <SearchIcon />
        </Tooltip>
      </div>
    </Paper>
  );
};

export default SearchBar;

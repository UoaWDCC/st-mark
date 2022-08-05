import React from "react";
import { Paper, InputBase, Tooltip, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import styles from "./SearchBar.module.css";

import { IDate } from "../../../types/schema";

import { getDate, getMonth } from "date-fns";

import IconButton from "@mui/material/IconButton";
import DateRangeIcon from "@mui/icons-material/DateRange";

import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';



import { DateObject, Calendar } from "react-multi-date-picker"
import type { Value } from "react-multi-date-picker"



interface SearchBarProps {
  onSearchTermChange: (newValue: string) => void;
  onDeathDateChange: (newDate: IDate) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {



  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const { onSearchTermChange, onDeathDateChange } = props;

  const [date, setDate] = React.useState<Value>(new Date());

  if (date instanceof DateObject) {
    console.log(date.toDate());

  } else {
    console.log("date not exist");

  }

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
            <div>
              <InputAdornment position="start">
                <IconButton
                  onClick={handleClick}
                  sx={{ p: "10px" }}
                  aria-label="menu"
                >
                  <DateRangeIcon />
                </IconButton>

                <Popper
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <Calendar
                      hideYear={true}
                      value={date}
                      onChange={
                        (v: DateObject) => {
                          setDate(v)
                          v ?
                            onDeathDateChange({
                              month: getMonth(v.toDate()) + 1,
                              day: getDate(v.toDate())
                            })
                            : onDeathDateChange({})
                          handleClose()
                        }
                      }
                    >
                      <button
                        style={{ margin: "5px 0" }}
                        onClick={() => {
                          onDeathDateChange({})
                          handleClose()
                        }
                        }
                      >
                        Reset
                      </button>
                    </Calendar>

                  </ClickAwayListener>
                </Popper>
              </InputAdornment>
            </div>
          }
        />
        <Tooltip title="Search">
          <SearchIcon />
        </Tooltip>
      </div>

    </Paper >
  );
};

export default SearchBar;

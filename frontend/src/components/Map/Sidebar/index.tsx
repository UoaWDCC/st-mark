import React from "react";
import {
  Divider,
  Typography,
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { IPerson, IPlot } from "../../../types/schema";
import PersonLink from "../common/PersonLink";
import SearchResults from "../common/SearchResults";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Popover from "@mui/material/Popover";

const useStyles = makeStyles({
  backButton: {
    left: "-9px",
    marginBottom: "0.5em",
  },
});

interface SidebarProps {
  selectedPlot: IPlot | undefined;
  searchInput: string;
  onChangeSearchInput: (input: string) => void;
  locationKnown: IPerson[];
  locationUnknown: IPerson[];
  isPeopleLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedPlot,
  searchInput,
  onChangeSearchInput,
  locationKnown,
  locationUnknown,
  isPeopleLoading,
}: SidebarProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const [date, setDate] = React.useState<Date | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);

  const handleOpenPopOver = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  date && console.log(date);

  if (selectedPlot)
    return (
      <div className={styles.container} data-testid="sidebar-plot">
        <div className={styles.plotHeader}>
          <Button
            color="secondary"
            startIcon={<ChevronLeftIcon />}
            className={classes.backButton}
            component={Link}
            to="/map"
          >
            Search
          </Button>
          <Typography
            variant="h5"
            style={{
              fontWeight: 500,
              color: `${theme.palette.primary.contrastText}`,
            }}
          >
            {selectedPlot?.registeredName} Plot
          </Typography>
        </div>
        <Divider />
        <div className={`${styles.buriedMembersContainer} ${styles.overflow}`}>
          {selectedPlot?.buried.map((person: IPerson) => (
            <PersonLink
              key={person._id}
              person={person}
              to={`/profile/${person._id}`}
              variant="directory"
            />
          ))}
          {selectedPlot && !selectedPlot?.buried?.length && (
            <Box className={styles.burialsUnkown} fontStyle="italic">
              Burials Unknown
            </Box>
          )}
        </div>
      </div>
    );

  return (
    <div className={styles.container} data-testid="sidebar-search">
      <div className={styles.searchHeader}>
        <TextField
          label="Search by name..."
          color="secondary"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="secondary" onClick={handleOpenPopOver} />
              </InputAdornment>
            ),
          }}
          value={searchInput}
          onChange={(event) => onChangeSearchInput(event.target.value)}
          inputProps={{ "data-testid": "desktop-search-input" }}
        />

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopOver}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              className="date-picker"
              displayStaticWrapperAs="desktop"
              openTo="month"
              // views={['month', 'day']}
              value={date}
              onChange={(newDateValue: Date | null) => {
                setDate(newDateValue);
              }}
              renderInput={(params) => <TextField {...params} />}
              closeOnSelect={true}
            />
          </LocalizationProvider>
        </Popover>
      </div>

      <div className={styles.overflow}>
        <SearchResults
          locationKnown={locationKnown}
          locationUnknown={locationUnknown}
          isPeopleLoading={isPeopleLoading}
        />
      </div>
    </div>
  );
};

export default Sidebar;

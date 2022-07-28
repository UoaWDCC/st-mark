import React from "react";
import { Drawer, IconButton, InputAdornment, TextField } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import styles from "./SearchDrawer.module.css";
import { IPerson } from "../../../types/schema";
import SearchResults from "../common/SearchResults";

const OpaqueDrawer = withStyles({
  paper: {
    background: "white",
    zIndex: 1300, // ensure SearchDrawer is above other MUI drawers
  },
})(Drawer);

interface SearchDrawerProps {
  open: boolean;
  closeDrawer: () => void;
  searchInput: string;
  onChangeSearchInput: (input: string) => void;
  locationKnown: IPerson[];
  locationUnknown: IPerson[];
  isPeopleLoading: boolean;
  onSelectLocationKnownSearchResult: () => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({
  open = false,
  closeDrawer,
  searchInput,
  onChangeSearchInput,
  locationKnown,
  locationUnknown,
  isPeopleLoading,
  onSelectLocationKnownSearchResult,
}: SearchDrawerProps) => {
  return (
    <OpaqueDrawer anchor="bottom" open={open} variant="persistent">
      <div className={styles.content}>
        <div className={styles.header}>
          <IconButton
            color="secondary"
            onClick={closeDrawer}
            data-testid="mobile-search-close"
            size="large"
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <TextField
            label="Search by name..."
            color="secondary"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              ),
            }}
            value={searchInput}
            onChange={(event) => onChangeSearchInput(event.target.value)}
            inputProps={{ "data-testid": "mobile-search-input" }}
          />
        </div>
        <div className={styles.searchResults}>
          <SearchResults
            locationKnown={locationKnown}
            locationUnknown={locationUnknown}
            isPeopleLoading={isPeopleLoading}
            onSelectLocationKnown={onSelectLocationKnownSearchResult}
          />
        </div>
      </div>
    </OpaqueDrawer>
  );
};

export default SearchDrawer;

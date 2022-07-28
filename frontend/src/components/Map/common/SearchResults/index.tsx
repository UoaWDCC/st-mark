import React from "react";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { IPerson } from "../../../../types/schema";
import styles from "./SearchResults.module.css";
import PersonLink from "../PersonLink";

interface SearchResultsProps {
  locationKnown: IPerson[];
  locationUnknown: IPerson[];
  isPeopleLoading: boolean;
  onSelectLocationKnown?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  locationKnown,
  locationUnknown,
  isPeopleLoading,
  onSelectLocationKnown,
}: SearchResultsProps) => (
  <div className={styles.container}>
    {isPeopleLoading ? (
      <div className={styles.loading}>
        <CircularProgress
          size={40}
          color="secondary"
          data-testid="loading-search-spinner"
        />
      </div>
    ) : (
      <div>
        {locationKnown.map((person: IPerson) => (
          <PersonLink
            key={person._id}
            person={person}
            to={`/map/${person.plot?.plotNumber}`}
            variant="map"
            onClick={onSelectLocationKnown}
          />
        ))}

        {!!locationUnknown.length && (
          <>
            <div
              className={styles.sectionDivider}
              data-testid="search-result-divider"
            >
              <Typography variant="h6">Unknown Location</Typography>
              <Divider />
            </div>

            {locationUnknown.map((person: IPerson) => (
              <PersonLink
                key={person._id}
                person={person}
                to={`/profile/${person._id}`}
                variant="directory"
              />
            ))}
          </>
        )}

        {!(locationKnown.length || locationUnknown.length) && (
          <div className={styles.noResults}>No Results</div>
        )}
      </div>
    )}
  </div>
);

export default SearchResults;

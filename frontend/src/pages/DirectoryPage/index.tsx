import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import NavBarDirectory from "../../components/common/NavBarDirectory/indexDirectory";
import Spinner from "../../components/common/Spinner";
import ProfileCard from "../../components/Directory/ProfileCard";
import SearchBar from "../../components/Directory/SearchBar";
import useGet from "../../hooks/useGet";
import { IPerson, IDate } from "../../types/schema";
import styles from "./DirectoryPage.module.css";
import {
  filterPeopleByFullName,
  filterPeopleByDeathDate,
  filterWithinWeek,
} from "../../utils/filter";
import { sortPeopleByFullName } from "../../utils/sort";
import Error from "../../components/common/Error";
import { ServerError } from "../../components/common/Error/ErrorUtils";
import usePageTitle from "../../hooks/usePageTitle";

const DirectoryPage: React.FC = () => {
  usePageTitle("Directory");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deathDate, setDeathDate] = useState<IDate>({});
  const { data: people, status, isLoading } = useGet<IPerson[]>("/api/person");
  const history = useHistory();
  const [anniversaryPeople, setAnniversaryPeople] = useState<IPerson[]>([]);

  useEffect(() => {
    if (people) sortPeopleByFullName(people);
  }, [people]);

  useEffect(() => {
    people && setAnniversaryPeople(filterWithinWeek(people, new Date()));
  }, [people]);

  const handleClick = (id: string): void => {
    history.push(`/profile/${id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBarDirectory />
      {people && (
        <>
          <SearchBar
            onSearchTermChange={setSearchTerm}
            onDeathDateChange={setDeathDate}
          />
          <Divider className={styles.divider} />
          <div className={styles.gridParent}>
            <Grid
              data-testid="profile-collection"
              container
              spacing={3}
              direction="row"
              className={styles.grid}
            >
              {filterPeopleByDeathDate(
                filterPeopleByFullName(people, searchTerm),
                deathDate
              ).map((person: IPerson) => {
                return (
                  <Grid item key={person._id}>
                    <ProfileCard
                      person={person}
                      onClick={() => handleClick(person._id)}
                      isStyled={anniversaryPeople.includes(person)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </>
      )}
      {isLoading && <Spinner />}
      {!!status && status >= 500 && <Error message={ServerError} />}
    </div>
  );
};

export default DirectoryPage;

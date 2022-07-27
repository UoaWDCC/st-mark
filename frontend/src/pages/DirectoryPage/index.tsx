import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import NavBarDirectory from "../../components/common/NavBarDirectory/indexDirectory";
import Spinner from "../../components/common/Spinner";
import ProfileCard from "../../components/Directory/ProfileCard";
import SearchBar from "../../components/Directory/SearchBar";
import useGet from "../../hooks/useGet";
import { IPerson } from "../../types/schema";
import styles from "./DirectoryPage.module.css";
import { filterPeopleByFullName } from "../../utils/filter";
import { sortPeopleByFullName } from "../../utils/sort";
import Error from "../../components/common/Error";
import { ServerError } from "../../components/common/Error/ErrorUtils";
import usePageTitle from "../../hooks/usePageTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InfoIcon from "@mui/icons-material/Info";
import Fab from "@mui/material/Fab";
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import {
  Search as SearchIcon,
  Room as RoomIcon,
  Home,
  MenuBook,
} from "@mui/icons-material";
import PersonIcon from '@mui/icons-material/Person';

const DirectoryPage: React.FC = () => {
  usePageTitle("Directory");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: people, status, isLoading } = useGet<IPerson[]>("/api/person");
  const history = useHistory();

  useEffect(() => {
    if (people) sortPeopleByFullName(people);
  }, [people]);

  const handleClick = (id: string): void => {
    history.push(`/profile/${id}`);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBarDirectory />
      {people && (
        <>
          <SearchBar onSearchTermChange={setSearchTerm} />
          <Divider className={styles.divider} />
          <div className={styles.gridParent}>
            <Grid
              data-testid="profile-collection"
              container
              spacing={3}
              direction="row"
              className={styles.grid}
            >
              {filterPeopleByFullName(people, searchTerm).map(
                (person: IPerson) => {
                  return (
                    <Grid item key={person._id}>
                      <ProfileCard
                        person={person}
                        onClick={() => handleClick(person._id)}
                      />
                    </Grid>
                  );
                }
              )}
            </Grid>
          </div>
        </>
      )}
      {isLoading && <Spinner />}
      {!!status && status >= 500 && <Error message={ServerError} />}
      
      <div className={styles.infoButton}>
      <Fab  size="medium" color="secondary" onClick={handleClickOpen}>
        <InfoIcon fontSize="large" />
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
        <DialogContent>
        
        Directory Button
        <ListItem>
          <ListItemAvatar>
            <MenuBook/>
          </ListItemAvatar>
          <ListItemText primary="Navigate to website page that you can see the list of people who are registered in St. Mark's Church Graveyard." />
          </ListItem>

          Home Button
          <ListItem>
          <ListItemAvatar>
            <Home/>
          </ListItemAvatar>
          <ListItemText primary="Navigate to a website page which introduce St. Mark's Church Graveyard." />
          </ListItem>

          Map Button
          <ListItem>
          <ListItemAvatar>
            <RoomIcon/>
          </ListItemAvatar>
          <ListItemText primary="Navigate to a website page that you can see the location of people they were baried." />
          </ListItem>
          
          Search Button
          <ListItem>
          <ListItemAvatar>
              <SearchIcon/>
          </ListItemAvatar>
          <ListItemText primary="You may search people by their name." />
          </ListItem>

          Profile Button
          <ListItem>
          <ListItemAvatar>
              <PersonIcon/>
          </ListItemAvatar>
          <ListItemText primary="Navigate to a website page that has the person's information." />
          </ListItem>

          

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">Close</Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
};

export default DirectoryPage;

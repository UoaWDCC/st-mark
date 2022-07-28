import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery, Fab } from "@mui/material";
import {
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Room as RoomIcon,
  Home,
  MenuBook,
} from "@mui/icons-material";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useParams, useHistory } from "react-router-dom";
import styles from "./MapPage.module.css";
import InteractiveMap from "../../components/Map/InteractiveMap";
import PlotDrawer from "../../components/Map/PlotDrawer";
import SearchDrawer from "../../components/Map/SearchDrawer";
import Sidebar from "../../components/Map/Sidebar";
import NavBar from "../../components/common/NavBar";
import { sortPeopleByFullName } from "../../utils/sort";
import { IDate, IPerson, IPlot } from "../../types/schema";
import useGet from "../../hooks/useGet";
import useFilterPeople from "./hooks/useFilterPeople";
import usePageTitle from "../../hooks/usePageTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InfoIcon from "@mui/icons-material/Info";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

const MapPage: React.FC = () => {
  const history = useHistory();
  const { plotNumber } = useParams<{ plotNumber: string }>();
  const isMobile = useMediaQuery("(max-width:800px)");

  // drawer states and handlers

  const [plotDrawerOpen, setPlotDrawerOpen] = useState<boolean>(!!plotNumber);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState<boolean>(false);

  const handleOpenPlotDrawer = useCallback(() => {
    setPlotDrawerOpen(true);
  }, []);

  const handleClosePlotDrawer = useCallback(() => {
    setPlotDrawerOpen(false);
  }, []);

  const handleOpenMobileSearch = useCallback(() => {
    setSearchDrawerOpen(true);
  }, []);

  const handleCloseMobileSearch = useCallback(() => {
    setSearchDrawerOpen(false);
  }, []);

  const handleSelectLocationKnownSearchResult = useCallback(() => {
    setPlotDrawerOpen(true);
    setSearchDrawerOpen(false);
  }, []);

  // plots

  const { data: plots } = useGet<IPlot[]>("/api/plot");

  const plotsByNumber = useMemo<Map<string, IPlot>>(
    () =>
      (plots &&
        plots.reduce(
          (map, plot) => map.set(plot.plotNumber.toString(), plot),
          new Map()
        )) ||
      new Map(),
    [plots]
  );

  const selectedPlot = useMemo<IPlot | undefined>(
    () => plotsByNumber.get(plotNumber),
    [plotNumber, plotsByNumber]
  );

  const plotSelectHandler = useCallback(
    (plotNumber: number) => {
      plotNumber === selectedPlot?.plotNumber
        ? history.push("/map")
        : history.push(`/map/${plotNumber}`);
      if (!plotDrawerOpen) {
        handleOpenPlotDrawer();
      }
    },
    [selectedPlot, history, handleOpenPlotDrawer, plotDrawerOpen]
  );

  // page title

  usePageTitle(selectedPlot ? `${selectedPlot.registeredName} Plot` : "Map");

  // search

  const [deathDate, setDeathDate] = useState<IDate>({});

  const { data: people, isLoading: isPeopleLoading } =
    useGet<IPerson[]>("/api/person");

  const [sortedPeople, setSortedPeople] = useState<IPerson[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    if (people) {
      sortPeopleByFullName(people);
      setSortedPeople([...people]);
    }
  }, [people]);

  const { locationKnown, locationUnknown } = useFilterPeople(
    sortedPeople,
    searchInput
  );

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 60,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#9575cd",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#ffebee" : "#81d4fa",
      borderRadius: 20 / 2,
    },
  }));

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.navBarContainer}>
          <NavBar contrast={isMobile} />
        </div>
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}>
          <InteractiveMap
            plots={plots || []}
            selectedPlot={selectedPlot}
            onClick={plotSelectHandler}
            showLocation={isMobile}
            className={styles.map}
          />
        </Wrapper>
        {!isMobile && (
          <div className={styles.sideBarContainer}>
            <Sidebar
              selectedPlot={selectedPlot}
              searchInput={searchInput}
              onChangeSearchInput={setSearchInput}
              onDeathDateChange={setDeathDate}
              locationKnown={locationKnown}
              locationUnknown={locationUnknown}
              isPeopleLoading={isPeopleLoading}
            />
          </div>
        )}
      </div>
      {isMobile && (
        <>
          <div className={styles.searchButton}>
            <Fab
              color="primary"
              data-testid="search-button"
              onClick={handleOpenMobileSearch}
            >
              <SearchIcon fontSize="large" />
            </Fab>
          </div>
          {selectedPlot && (
            <>
              <div className={styles.bottomPanelButton}>
                <Fab
                  color="primary"
                  onClick={handleOpenPlotDrawer}
                  data-testid="drawer-open-button"
                >
                  <ExpandLessIcon fontSize="large" />
                </Fab>
              </div>

              <PlotDrawer
                open={plotDrawerOpen}
                closeDrawer={handleClosePlotDrawer}
                selectedPlot={selectedPlot}
                onOpenMobileSearch={handleOpenMobileSearch}
              />
            </>
          )}
          <SearchDrawer
            open={searchDrawerOpen}
            closeDrawer={handleCloseMobileSearch}
            searchInput={searchInput}
            onChangeSearchInput={setSearchInput}
            locationKnown={locationKnown}
            locationUnknown={locationUnknown}
            isPeopleLoading={isPeopleLoading}
            onSelectLocationKnownSearchResult={
              handleSelectLocationKnownSearchResult
            }
          />
        </>
      )}{" "}
      <div className={styles.infoButton}>
        <Fab size="medium" color="secondary" onClick={handleClickOpen}>
          <InfoIcon fontSize="large" />
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Navigation"} </DialogTitle>
          <DialogContent>
            Dark Mode Button
            <ListItem>
              <ListItemAvatar>
                <MaterialUISwitch checked={true} />
              </ListItemAvatar>
              <ListItemText primary="Dark theme map will be displayed." />
            </ListItem>
            Directory Button
            <ListItem>
              <ListItemAvatar>
                <MenuBook />
              </ListItemAvatar>
              <ListItemText primary="A website page that you can see a list of people who are registered in St. Mark's Church Graveyard." />
            </ListItem>
            Home Button
            <ListItem>
              <ListItemAvatar>
                <Home />
              </ListItemAvatar>
              <ListItemText primary="A website page which introduce St. Mark's Church Graveyard." />
            </ListItem>
            Search Button
            <ListItem>
              <ListItemAvatar>
                <SearchIcon />
              </ListItemAvatar>
              <ListItemText primary="You may search people by their name." />
            </ListItem>
            Map Button
            <ListItem>
              <ListItemAvatar>
                <RoomIcon />
              </ListItemAvatar>
              <ListItemText primary="Show you the lcoation where the person is buried." />
            </ListItem>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="success">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default MapPage;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery, Fab } from "@mui/material";
import {
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
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
      )}
    </div>
  );
};

export default MapPage;

import React from "react";
import { Drawer, IconButton, Divider, Typography, Fab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import styles from "./PlotDrawer.module.css";
import { IPerson, IPlot } from "../../../types/schema";
import PersonLink from "../common/PersonLink";

interface PlotDrawerProps {
  open: boolean;
  closeDrawer: () => void;
  selectedPlot?: IPlot;
  onOpenMobileSearch: () => void;
}

const TransparentDrawer = withStyles({
  paper: {
    background: "rgba(0,0,0,0)",
    borderTop: 0,
    pointerEvents: "none",
  },
})(Drawer);

const PlotDrawer: React.FC<PlotDrawerProps> = ({
  open = false,
  closeDrawer,
  selectedPlot,
  onOpenMobileSearch,
}: PlotDrawerProps) => {
  const theme = useTheme();

  return (
    <TransparentDrawer
      anchor="bottom"
      open={open}
      variant="persistent"
      data-testid="bottom-panel-drawer"
    >
      <div className={styles.searchButton}>
        <Fab
          color="primary"
          data-testid="drawer-search-button"
          onClick={onOpenMobileSearch}
        >
          <SearchIcon fontSize="large" />
        </Fab>
      </div>
      <div className={styles.drawerContent}>
        <div className={styles.header}>
          <Typography
            variant="h5"
            style={{
              fontWeight: 500,
              color: `${theme.palette.primary.contrastText}`,
            }}
          >{`${selectedPlot?.registeredName} Plot`}</Typography>
          <IconButton
            onClick={closeDrawer}
            className={styles.closeButton}
            data-testid="drawer-close-button"
            size="large"
          >
            <ExpandMoreIcon
              htmlColor={theme.palette.primary.contrastText}
              fontSize="large"
            />
          </IconButton>
        </div>
        <Divider />
        <div className={styles.buriedMembersContainer}>
          {selectedPlot?.buried.map((person: IPerson) => (
            <PersonLink
              key={person._id}
              person={person}
              to={`/profile/${person._id}`}
              variant="directory"
            />
          ))}

          {!selectedPlot?.buried?.length && (
            <div className={styles.burialsUnknown}>Burials Unknown</div>
          )}
        </div>
      </div>
    </TransparentDrawer>
  );
};

export default PlotDrawer;

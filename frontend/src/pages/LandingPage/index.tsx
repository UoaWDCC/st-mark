import React from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";
import {
  ArrowBackIos as ArrowBackIosIcon,
  MenuBook as MenuBookIcon,
  Room as RoomIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import LandingBackdrop from "../../components/LandingBackdrop";
import useGet from "../../hooks/useGet";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InfoIcon from "@mui/icons-material/Info";
import Fab from "@mui/material/Fab";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

const ModalCard = withStyles({
  root: {
    backgroundColor: "rgba(255,255,255,0.75)",
  },
})(Card);

interface LandingPageProps {
  title: string;
  description: string;
  mobileDescription: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  title = "St. Mark's Church Graveyard",
  description = "Welcome!",
  mobileDescription = "Welcome!",
}: LandingPageProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:515px)"); // 515px is the point where currently the non-mobile description overflows

  useGet("/api/wakeup"); // Prevent backend cold starts

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <LandingBackdrop />
      <div className={styles.pageContent}>
        <a
          href="https://stmarks.org.nz/"
          id="homelink"
          data-testid="homelink"
          className={styles.backToStMarks}
        >
          <Tooltip title="To St Mark's Website">
            <Button color="primary">
              <ArrowBackIosIcon fontSize="small" />
              <Typography variant="button">Back to St Mark&apos;s</Typography>
            </Button>
          </Tooltip>
        </a>
        <Typography
          className={styles.title}
          style={{ color: `${theme.palette.primary.main}` }}
          variant="h3"
          align="center"
          gutterBottom
        >
          {title}
        </Typography>
        <ModalCard className={styles.modal}>
          <CardContent>
            {isMobile ? (
              <Typography variant="body2" align="center" gutterBottom>
                {mobileDescription}
              </Typography>
            ) : (
              <Typography variant="body1" align="center" gutterBottom>
                {description}
              </Typography>
            )}
          </CardContent>
          <div className={styles.buttonWrapper}>
            <Button
              variant="contained"
              className={styles.button}
              component={Link}
              to="/directory"
              data-testid="directory-button"
            >
              <MenuBookIcon className={styles.icon} />
              Directory
            </Button>
            <div className={styles.buttonBreak} />
            <Button
              variant="contained"
              className={styles.button}
              component={Link}
              to="/map"
              data-testid="map-button"
            >
              <RoomIcon className={styles.icon} />
              Map
            </Button>
          </div>
        </ModalCard>
      </div>
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
          <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
          <DialogContent>
            Directory Button
            <ListItem>
              <ListItemAvatar>
                <MenuBookIcon />
              </ListItemAvatar>
              <ListItemText primary="Navigate to a website page to see the list of people who are registered in St. Mark's Church Graveyard." />
            </ListItem>
            Map Button
            <ListItem>
              <ListItemAvatar>
                <RoomIcon />
              </ListItemAvatar>
              <ListItemText primary="Navigate to a website page to see the location of where people they were buried." />
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

export default LandingPage;

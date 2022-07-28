import React from "react";
import { Paper, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

interface BiographyProps {
  className?: string;
  biography: string | undefined;
  showTitle: boolean;
}

const useStyles = makeStyles({
  biographyHeading: {
    marginBottom: "1em",
  },
});

export const Biography: React.FC<BiographyProps> = (props: BiographyProps) => {
  const classes = useStyles();
  const { className, biography, showTitle } = props;

  return (
    <Paper data-testid="biography" className={className}>
      {showTitle && (
        <Typography variant="h5" className={classes.biographyHeading}>
          Biography
        </Typography>
      )}
      {biography ? (
        <Typography style={{ whiteSpace: "pre-line" }}>{biography}</Typography>
      ) : (
        <Typography>
          <i>Sorry, no biography available.</i>
        </Typography>
      )}
    </Paper>
  );
};

import React from "react";
import { Card, CardContent, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IAnecdote } from "../../../types/schema";
import styles from "./Anecdotes.module.css";

const useStyles = makeStyles({
  cardcontent: {
    padding: "1em",
    "&:last-child": {
      paddingBottom: "1em",
    },
  },
  anecdotesHeading: {
    marginBottom: "1em",
  },
});

interface AnecdotesProps {
  className?: string;
  anecdotes: IAnecdote[] | undefined;
  showTitle: boolean;
}

export const Anecdotes: React.FC<AnecdotesProps> = (props: AnecdotesProps) => {
  const classes = useStyles();
  const { className, anecdotes = [], showTitle } = props;

  return (
    <Paper data-testid="anecdotes" className={className}>
      {showTitle && (
        <Typography variant="h5" className={classes.anecdotesHeading}>
          Anecdotes
        </Typography>
      )}
      {anecdotes.length ? (
        anecdotes.map((anecdote, index) => (
          <Card className={styles.card} key={index}>
            <CardContent className={classes.cardcontent}>
              <Typography
                variant="body1"
                component="p"
                style={{ whiteSpace: "pre-line" }}
              >
                {anecdote.content}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>
          <i>Sorry, no anecdotes available.</i>
        </Typography>
      )}
    </Paper>
  );
};

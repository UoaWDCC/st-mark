import React from "react";
import {
  Card,
  IconButton,
  Link as A,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./PlotMemberDisplay.module.css";
import { IPerson } from "../../../types/schema";
import { Room as RoomIcon } from "@mui/icons-material";

interface PlotMemberDisplayProps {
  plotMembers: Pick<IPerson, "_id" | "name" | "fullName">[];
  plotNumber: number | undefined;
}

const PlotMemberDisplay: React.FC<PlotMemberDisplayProps> = ({
  plotMembers,
  plotNumber,
}: PlotMemberDisplayProps) => {
  return (
    <Paper className={styles.container}>
      <div className={styles.summaryHeader}>
        {plotNumber && (
          <>
            <Typography variant="h5">Plot Members</Typography>
            <Tooltip title="Go to plot" placement="bottom">
              <IconButton
                component={Link}
                to={`/map/${plotNumber}`}
                className={styles.plotIcon}
                data-testid="plot-icon"
                size="large"
              >
                <RoomIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </div>
      <div className={styles.plotMembersList}>
        {plotMembers.length ? (
          plotMembers.map((plotMember, index) => (
            <Card key={`relative-${index}`}>
              <A
                className={styles.link}
                component={Link}
                to={`/profile/${plotMember._id}`}
              >
                <Typography
                  variant="body1"
                  color="secondary"
                  className={styles.linkTitle}
                >
                  {plotMember.fullName}
                </Typography>
              </A>
            </Card>
          ))
        ) : (
          <Typography>
            <i>
              {plotNumber
                ? "No other known plot members."
                : "Unknown burial location."}
            </i>
          </Typography>
        )}
      </div>
    </Paper>
  );
};

export default PlotMemberDisplay;

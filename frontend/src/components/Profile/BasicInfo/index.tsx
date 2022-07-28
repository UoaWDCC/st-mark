import React from "react";
import { Paper, Typography } from "@mui/material";

import styles from "./BasicInfo.module.css";
import { IPersonAll } from "../../../types/schema";
import { dateToString } from "../../../utils/dates";

interface BasicInfoProps {
  person: IPersonAll;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ person }: BasicInfoProps) => {
  const { fullName, dateOfBirth, dateOfDeath, displayImage } = person;
  return (
    <Paper className={styles.padded}>
      <Typography variant="h5">{fullName}</Typography>
      <Typography>
        Born: {dateOfBirth ? dateToString(dateOfBirth) : "Unknown"}
      </Typography>
      <Typography>
        Died: {dateOfDeath ? dateToString(dateOfDeath) : "Unknown"}
      </Typography>
      <div className={styles.profilePictureContainer}>
        <img
          src={displayImage ? displayImage?.url : "/images/default-dp.png"}
          alt="Profile Picture"
          className={styles.profilePicture}
        />
      </div>
    </Paper>
  );
};

export default BasicInfo;

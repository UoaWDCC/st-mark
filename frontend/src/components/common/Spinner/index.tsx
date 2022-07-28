import React from "react";
import { CircularProgress } from "@mui/material";
import styles from "./Spinner.module.css";

const Spinner: React.FC = () => {
  return (
    <div className={styles.spinner}>
      <CircularProgress size={50} data-testid="loading-spinner" />
    </div>
  );
};

export default Spinner;

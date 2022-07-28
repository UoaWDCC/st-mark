import React from "react";
import styles from "./LandingBackdrop.module.css";

const LandingBackdrop: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image} data-testid="backdropImage" />
    </div>
  );
};

export default LandingBackdrop;

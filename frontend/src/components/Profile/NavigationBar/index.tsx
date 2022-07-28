import React from "react";
import { Paper, Tab, Tabs } from "@mui/material";
import styles from "./NavigationBar.module.css";

interface NavigationBarProps {
  value: number;
  setValue: (value: number) => void;
  tabNames: string[];
}

const NavigationBar: React.FC<NavigationBarProps> = (
  props: NavigationBarProps
) => {
  const { value, setValue, tabNames } = props;

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper className={styles.container}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        centered
      >
        {tabNames &&
          tabNames.map((tabName) => (
            <Tab
              key={`${tabName}-tab`}
              label={<span className={styles.tabLabel}>{tabName}</span>}
              data-testid={`${tabName}-tab`}
            />
          ))}
      </Tabs>
    </Paper>
  );
};

export default NavigationBar;

import React from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

interface NavBarProps {
  title?: string;
  backDestination?: string;
  children?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  const { title, backDestination, children } = props;
  const theme = useTheme();

  return (
    <Box className={styles.container}>
      <div className={styles.content}>
        {backDestination && (
          <Tooltip title="Profiles" placement="right">
            <IconButton
              component={Link}
              to={backDestination}
              data-testid="admin-nav-back-button"
              size="large"
            >
              <ArrowBackIcon
                htmlColor={theme.palette.primary.main}
                fontSize="large"
              />
            </IconButton>
          </Tooltip>
        )}
        {title && (
          <Typography
            style={{ color: `${theme.palette.primary.main}` }}
            variant="h5"
            data-testid="admin-nav-title"
          >
            {title}
          </Typography>
        )}
        {children}
      </div>
    </Box>
  );
};

export default NavBar;

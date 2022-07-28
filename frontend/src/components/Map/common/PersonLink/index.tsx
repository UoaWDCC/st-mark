import React from "react";
import { Link as A, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Room as MapMarkerIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./PersonLink.module.css";
import { IPerson } from "../../../../types/schema";

interface PersonLinkProps {
  person: IPerson;
  to: string;
  variant: "map" | "directory";
  onClick?: () => void;
}

const PersonLink: React.FC<PersonLinkProps> = ({
  person,
  to,
  variant,
  onClick,
}: PersonLinkProps) => {
  const theme = useTheme();

  return (
    <A
      className={styles.person}
      component={Link}
      to={to}
      onClick={onClick}
      data-testid="person-link"
    >
      <Typography color="textPrimary">{person.fullName}</Typography>
      <Tooltip title={variant.replace(/./, (c) => c.toUpperCase())}>
        {variant === "map" ? (
          <MapMarkerIcon htmlColor={theme.palette.primary.contrastText} />
        ) : variant === "directory" ? (
          <MenuBookIcon htmlColor={theme.palette.primary.contrastText} />
        ) : (
          <></>
        )}
      </Tooltip>
    </A>
  );
};

export default PersonLink;

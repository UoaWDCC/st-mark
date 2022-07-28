import React from "react";
import { Link, Paper, Typography, Card, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { ILink } from "../../../types/schema";
import styles from "./Links.module.css";
import { getValidLink } from "../../../utils/links";

interface LinksProps {
  className?: string;
  links: ILink[];
  showTitle: boolean;
}

const useStyles = makeStyles({
  linksHeading: {
    marginBottom: "1em",
  },
});

export const Links: React.FC<LinksProps> = (props: LinksProps) => {
  const classes = useStyles();
  const { className, links, showTitle } = props;
  const theme = useTheme();

  return (
    <Paper data-testid="links" className={className}>
      {showTitle && (
        <Typography variant="h5" className={classes.linksHeading}>
          Links
        </Typography>
      )}
      {links.length ? (
        links.map((link, index) => (
          <div key={index} className={styles.linkCard}>
            <Card>
              <Link
                href={getValidLink(link.url)}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                <Typography
                  variant="body1"
                  color="secondary"
                  className={styles.linkTitle}
                >
                  {link.title}
                </Typography>
                <IconButton size="large">
                  <ChevronRightIcon
                    htmlColor={theme.palette.primary.contrastText}
                  />
                </IconButton>
              </Link>
            </Card>
          </div>
        ))
      ) : (
        <Typography>
          <i>Sorry, no links available.</i>
        </Typography>
      )}
    </Paper>
  );
};

import React from "react";
import { Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import styles from "./Error.module.css";
import { ErrorMessage, URLDirection } from "./ErrorUtils";

interface ErrorProps {
  message: ErrorMessage;
  director?: URLDirection;
}

const Error: React.FC<ErrorProps> = (props: ErrorProps) => {
  const { title, message } = props.message;
  const director = props.director;
  const history = useHistory();

  const goToUrl = async (url: string) => {
    history.replace(url);
  };

  return (
    <div className={styles.fullPageContainer}>
      <div className={styles.componentPadding}>
        <Typography variant="h5" component="h2" color="primary">
          {title}
        </Typography>

        <Typography variant="subtitle1" component="h6" color="primary">
          <i>{message}</i>
        </Typography>
        {director && (
          <>
            <br />
            <Button
              variant="contained"
              data-testid="url-redirect"
              onClick={() => goToUrl(director.url)}
            >
              {director.prompt}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Error;

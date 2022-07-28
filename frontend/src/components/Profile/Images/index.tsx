import React from "react";
import {
  ImageList,
  ImageListItem,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { IImage } from "../../../types/schema";
import styles from "./Images.module.css";

interface ImageProps {
  className?: string;
  images: IImage[];
  showTitle: boolean;
}

const useStyles = makeStyles({
  imagesHeading: {
    marginBottom: "1em",
  },
});

export const Images: React.FC<ImageProps> = (props: ImageProps) => {
  const classes = useStyles();
  const { className, images: personImages, showTitle } = props;

  const largeScreen = useMediaQuery(`(min-width: 1024px)`);

  return (
    <Paper data-testid="images" className={className}>
      {showTitle && (
        <Typography variant="h5" className={classes.imagesHeading}>
          Images
        </Typography>
      )}
      {personImages.length ? (
        <ImageList
          cols={largeScreen ? 3 : 2}
          gap={8}
          variant="masonry"
          className={styles.imageList}
        >
          {personImages.map((image, index) => (
            <ImageListItem key={`image-${index}`}>
              <img src={image.url} data-testid={`image-${index}`} />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography>
          <i>Sorry, no images available.</i>
        </Typography>
      )}
    </Paper>
  );
};

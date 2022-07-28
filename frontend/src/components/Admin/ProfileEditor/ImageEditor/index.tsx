import React, { useState } from "react";
import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  Typography,
} from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import { Delete as DeleteIcon } from "@mui/icons-material";
import useDelete from "../../../../hooks/useDelete";
import usePost from "../../../../hooks/usePost";
import { IImage, IPersonAll } from "../../../../types/schema";
import ConfirmationModal from "../../../common/ConfirmationModal";
import AddImageModal from "./AddImageModal";
import styles from "./ImageEditor.module.css";

const ImageHeader = withStyles({
  root: {
    backgroundColor: "transparent",
  },
})(ImageListItemBar);

interface ImageEditorProps {
  person: IPersonAll;
  updatePerson: () => void;
  onSave: (message: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = (props: ImageEditorProps) => {
  const { person, updatePerson, onSave } = props;
  const { _id: personId, images } = person;

  // Delete functions and state
  const [imageToDelete, setImageToDelete] = useState<IImage>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const deleteImage = useDelete();

  const handleOpenDeleteModal = (image: IImage) => {
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setImageToDelete(undefined);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    const { status } = await deleteImage(
      `/api/person/${personId}/image/${imageToDelete._id}`
    );
    setDeleteModalOpen(false);
    if (status == 204) {
      updatePerson();
      onSave("Successfully deleted image.");
    } else {
      onSave("Failed to delete image. Please try again.");
    }
  };

  // Post/Create functions and state
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const addImage = usePost();

  const handleCancelUpload = () => {
    setAddModalOpen(false);
  };

  const handleConfirmUpload = async (images: File[]) => {
    const results = await Promise.all(
      images.map((image) => {
        const form = new FormData();
        form.append("image", image);
        return addImage(`/api/person/${personId}/image`, form);
      })
    );

    setAddModalOpen(false);

    const failed = results.filter((result) => result.status !== 201);

    if (failed.length) {
      onSave(`All but ${failed.length} images saved`);
    } else {
      onSave("All images uploaded successfully.");
    }
    updatePerson();
  };

  return (
    <Paper className={styles.container}>
      <Typography variant="h6">Images</Typography>

      <div className={styles.imagesContainer}>
        {images && images.length > 0 ? (
          <ImageList cols={5} gap={8} className={styles.imageList}>
            {images.map((image, index) => (
              <ImageListItem key={image._id}>
                <img src={image.url} className={styles.image} />
                <ImageHeader
                  actionIcon={
                    <IconButton
                      onClick={() => handleOpenDeleteModal(image)}
                      data-testid={`image-${index}`}
                      size="large"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                  actionPosition="right"
                  position="top"
                  className={styles.imageListItemBar}
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Typography className={styles.noImagesMessage} align="center">
            No images found.
          </Typography>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <Button variant="contained" onClick={() => setAddModalOpen(true)}>
          Add New
        </Button>
      </div>

      <ConfirmationModal
        message="Are you sure you want to delete this image? This is irreversible."
        confirmButtonText="Delete"
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <AddImageModal
        open={addModalOpen}
        onClose={handleCancelUpload}
        onConfirm={handleConfirmUpload}
      />
    </Paper>
  );
};

export default ImageEditor;

import React, { useEffect, useRef, useState } from "react";
import { Button, Paper, Typography } from "@mui/material";
import { IPersonAll, IImage } from "../../../../types/schema";
import styles from "./DisplayImageEditor.module.css";
import usePost from "../../../../hooks/usePost";
import useDelete from "../../../../hooks/useDelete";
import ConfirmationModal from "../../../common/ConfirmationModal";

interface DisplayImageEditorProps {
  person: IPersonAll;
  onSave: (message: string) => void;
}

const defaultImage = "/images/default-dp.png";

const DisplayImageEditor: React.FC<DisplayImageEditorProps> = ({
  person,
  onSave,
}: DisplayImageEditorProps) => {
  const [file, setFile] = useState<File>();
  const [imageSrc, setImageSrc] = useState<string>("");
  const [displayImage, setDisplayImage] = useState<string>(
    person.displayImage?.url || defaultImage
  );
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLFormElement>(null);

  const sendDisplayImage = usePost<IImage>();
  const deleteDisplayImage = useDelete();

  const clearData = () => {
    setImageSrc("");
    setFile(undefined);
    imageInputRef.current?.reset();
  };

  const save = async () => {
    if (!file) {
      onSave("No image selected");
      return;
    }

    // add the file to a form to be sent to the backend.
    const form = new FormData();
    form.append("image", file);

    setImageLoading(true);
    const { status, data: image } = await sendDisplayImage(
      `/api/person/${person._id}/display-image`,
      form
    );
    setImageLoading(false);

    // if sucessful, inform user that it worked and clear the data.
    if (status === 201 && image) {
      onSave("Image was successfully saved");
      setDisplayImage(image.url);
      clearData();
    } else {
      onSave("Failed to save. Please try again.");
    }
  };

  const deleteImage = async () => {
    if (displayImage !== defaultImage && !imageSrc) {
      const { status } = await deleteDisplayImage(
        `/api/person/${person._id}/display-image`
      );

      if (status === 204) {
        onSave("Image was successfully deleted");
        setDisplayImage(defaultImage);
      } else {
        onSave("Failed to delete image. Please try again.");
      }
    }
    clearData();
  };

  const checkAndSetFile = (files: FileList | null): void => {
    if (files && files.length > 0) setFile(files[0]);
  };

  useEffect(() => {
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <Paper className={styles.container}>
      <ConfirmationModal
        message="Are you sure you want to delete this display image? This is irreversible."
        confirmButtonText="Delete"
        open={deleteConfirmationModalOpen}
        onClose={() => {
          setDeleteConfirmationModalOpen(false);
        }}
        onConfirm={async () => {
          await deleteImage();
          setDeleteConfirmationModalOpen(false);
        }}
      />
      <Typography variant="h6" className={styles.title}>
        Display Image
      </Typography>
      <div className={styles.displayImageContainer}>
        <img
          src={imageSrc || displayImage}
          className={styles.imagePreview}
          alt="Display Image Preview"
          data-testid={"display-image"}
        />
        <div className={styles.buttonContainer}>
          <form ref={imageInputRef}>
            <input
              accept="image/png, image/jpeg"
              className={styles.input}
              id="contained-button-file"
              type="file"
              onChange={(e) => checkAndSetFile(e.target.files)}
              data-testid="upload-image-input"
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                data-testid="upload-image-button"
                disabled={imageLoading}
              >
                Select
              </Button>
            </label>
          </form>
          <Button
            variant="contained"
            onClick={() =>
              !imageSrc ? setDeleteConfirmationModalOpen(true) : clearData()
            }
            // enabled if there is no input file input, or the display image is not the default
            disabled={
              (!imageSrc && displayImage === defaultImage) || imageLoading
            }
            data-testid="delete-image-button"
          >
            {!imageSrc ? "Delete" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={save}
            disabled={!file || imageLoading}
            data-testid="save-image-button"
          >
            Save
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default DisplayImageEditor;

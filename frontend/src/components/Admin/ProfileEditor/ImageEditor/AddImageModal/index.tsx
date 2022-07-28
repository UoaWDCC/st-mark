import React, { useRef, useState } from "react";
import { Button, Modal, Tooltip, Typography } from "@mui/material";
import styles from "./AddImageModal.module.css";
import WhitePaper from "../../../common/WhitePaper";

interface AddImageModalProps {
  open: boolean;
  onConfirm: (files: File[]) => Promise<void>;
  onClose: () => void;
}

const AddImageModal: React.FC<AddImageModalProps> = ({
  open,
  onConfirm,
  onClose,
}: AddImageModalProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const imageInputRef = useRef<HTMLFormElement>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const clearData = () => {
    setFiles([]);
    imageInputRef.current?.reset();
  };

  const handleClose = () => {
    clearData();
    onClose();
  };

  const handleConfirm = async () => {
    setImageLoading(true);
    await onConfirm(files);
    setImageLoading(false);
    clearData();
  };

  const checkAndSetFiles = (inputFiles: FileList | null): void => {
    setFiles(Array.from(inputFiles || []));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <WhitePaper className={styles.container}>
        <Typography variant="h6" align="center">
          Add New Images
        </Typography>
        <div className={styles.uploadContainer}>
          <form ref={imageInputRef}>
            <input
              accept="image/png, image/jpeg"
              className={styles.input}
              id="add-image-modal-input"
              type="file"
              onChange={(e) => checkAndSetFiles(e.target.files)}
              data-testid="add-image-modal-input"
              multiple
            />
            <label htmlFor="add-image-modal-input">
              <Button
                variant="outlined"
                color="secondary"
                component="span"
                data-testid="add-image-modal-button"
              >
                Select
              </Button>
            </label>
          </form>
          <div className={styles.imageListContainer}>
            <div className={styles.images}>
              {files?.length ? (
                files.map((file, index) => (
                  <Typography
                    variant="body2"
                    key={index}
                    data-testid={`uploaded-image-${index}`}
                  >
                    {file.name}
                  </Typography>
                ))
              ) : (
                <Typography className={styles.noImagesSelected} variant="body2">
                  No images selected.
                </Typography>
              )}
            </div>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="secondary"
            data-testid="cancel-button"
            onClick={handleClose}
            disabled={imageLoading}
          >
            Cancel
          </Button>
          <Tooltip title="Images required" arrow>
            <span>
              <Button
                variant="contained"
                color="secondary"
                disabled={!files?.length || imageLoading}
                data-testid="confirm-button"
                onClick={handleConfirm}
              >
                Add Image(s)
              </Button>
            </span>
          </Tooltip>
        </div>
      </WhitePaper>
    </Modal>
  );
};

export default AddImageModal;

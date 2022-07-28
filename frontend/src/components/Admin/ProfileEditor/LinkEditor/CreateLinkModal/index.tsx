import React, { useState } from "react";
import { Button, Modal, TextField, Tooltip, Typography } from "@mui/material";
import styles from "./CreateLinkModal.module.css";
import WhitePaper from "../../../common/WhitePaper";

interface CreateLinkModalProps {
  open: boolean;
  onConfirm: (title: string, url: string) => void;
  onClose: () => void;
}

const CreateLinkModal: React.FC<CreateLinkModalProps> = ({
  open,
  onConfirm,
  onClose,
}: CreateLinkModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const handleClose = () => {
    setTitle("");
    setUrl("");
    onClose();
  };

  const handleConfirm = () => {
    setTitle("");
    setUrl("");
    onConfirm(title, url);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <WhitePaper className={styles.container}>
        <Typography variant="h6" align="center">
          Add a New Link
        </Typography>
        <div className={styles.textFields}>
          <TextField
            color="secondary"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            inputProps={{ "data-testid": "title-field" }}
          />
          <TextField
            type="url"
            color="secondary"
            label="URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            inputProps={{ "data-testid": "url-field" }}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="secondary"
            data-testid="cancel-button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Tooltip title="Title and URL required" arrow>
            <span>
              <Button
                variant="contained"
                color="secondary"
                disabled={!title || !url}
                data-testid="confirm-button"
                onClick={handleConfirm}
              >
                Add Link
              </Button>
            </span>
          </Tooltip>
        </div>
      </WhitePaper>
    </Modal>
  );
};

export default CreateLinkModal;

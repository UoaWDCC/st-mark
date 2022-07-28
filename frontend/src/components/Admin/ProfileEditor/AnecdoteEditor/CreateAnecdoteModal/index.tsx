import React, { useState } from "react";
import { Button, TextField, Tooltip, Typography, Modal } from "@mui/material";
import styles from "./CreateAnecdoteModal.module.css";
import WhitePaper from "../../../common/WhitePaper";

interface CreateAnecdoteModalProps {
  open: boolean;
  onConfirm: (content: string) => void;
  onClose: () => void;
}

const CreateAnecdoteModal: React.FC<CreateAnecdoteModalProps> = ({
  open,
  onConfirm,
  onClose,
}: CreateAnecdoteModalProps) => {
  const [content, setContent] = useState<string>("");

  const handleClose = () => {
    setContent("");
    onClose();
  };

  const handleConfirm = () => {
    setContent("");
    onConfirm(content);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <WhitePaper className={styles.container}>
        <Typography variant="h6" align="center">
          Add a New Anecdote
        </Typography>
        <TextField
          color="secondary"
          label="Content"
          value={content}
          multiline
          minRows={8}
          maxRows={8}
          onChange={(event) => setContent(event.target.value)}
          inputProps={{ "data-testid": "content-field" }}
        />
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="secondary"
            data-testid="cancel-button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Tooltip title="Content required" arrow>
            <span>
              <Button
                variant="contained"
                color="secondary"
                disabled={!content}
                data-testid="confirm-button"
                onClick={handleConfirm}
              >
                Add Anecdote
              </Button>
            </span>
          </Tooltip>
        </div>
      </WhitePaper>
    </Modal>
  );
};

export default CreateAnecdoteModal;

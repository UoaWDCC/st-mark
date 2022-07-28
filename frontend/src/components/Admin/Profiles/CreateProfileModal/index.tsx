import React, { useState } from "react";
import { Button, Modal, Paper, TextField, Tooltip } from "@mui/material";
import styles from "./CreateProfileModal.module.css";

interface CreateProfileModalProps {
  open: boolean;
  onConfirm: (first: string, middles: string, last: string) => void;
  onClose: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  open,
  onConfirm,
  onClose,
}: CreateProfileModalProps) => {
  const [first, setFirst] = useState<string>("");
  const [middles, setMiddles] = useState<string>("");
  const [last, setLast] = useState<string>("");

  const handleClose = () => {
    setFirst("");
    setMiddles("");
    setLast("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper className={styles.modal}>
        <div className={styles.message}>Create New Profile</div>
        <div className={styles.input}>
          <TextField
            id="outlined-basic"
            color="secondary"
            label="First"
            value={first}
            onChange={(event) => setFirst(event.target.value)}
            inputProps={{ "data-testid": "first-name-field" }}
          />
          <TextField
            id="outlined-basic"
            color="secondary"
            label="Middle"
            value={middles}
            onChange={(event) => setMiddles(event.target.value)}
          />
          <TextField
            id="outlined-basic"
            color="secondary"
            label="Last"
            required
            value={last}
            onChange={(event) => setLast(event.target.value)}
            inputProps={{ "data-testid": "last-name-field" }}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
          <div className={styles.buttonSpace} />
          <Tooltip title="Last name is required" arrow>
            <span>
              <Button
                variant="contained"
                color="secondary"
                disabled={!last}
                onClick={() => onConfirm(first, middles, last)}
                data-testid="create-button"
              >
                Create
              </Button>
            </span>
          </Tooltip>
        </div>
      </Paper>
    </Modal>
  );
};

export default CreateProfileModal;

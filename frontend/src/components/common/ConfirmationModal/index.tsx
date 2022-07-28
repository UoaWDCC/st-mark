import React, { useState } from "react";
import { Button, Modal, TextField } from "@mui/material";
import styles from "./ConfirmationModal.module.css";
import WhitePaper from "../../Admin/common/WhitePaper";

interface ConfirmationModalProps {
  message?: string;
  confirmButtonText: string;
  verificationText?: string;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message = "Are you sure you want to proceed? This is irreversible.",
  confirmButtonText,
  verificationText = "",
  open,
  onConfirm,
  onClose,
}: ConfirmationModalProps) => {
  const [confirmationInput, setConfirmationInput] = useState<string>("");

  return (
    <Modal open={open} onClose={onClose}>
      <WhitePaper className={styles.modal}>
        <div className={styles.message}>{message}</div>
        {verificationText && (
          <div
            className={styles.message}
          >{`Please type '${verificationText}' to confirm.`}</div>
        )}
        {verificationText && (
          <div className={styles.input}>
            <TextField
              color="secondary"
              label="Confirmation"
              fullWidth
              onChange={(event) => setConfirmationInput(event.target.value)}
            />
          </div>
        )}
        <div className={styles.buttons}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
          <div className={styles.buttonSpace} />{" "}
          <Button
            variant="contained"
            color="secondary"
            onClick={onConfirm}
            data-testid="modal-confirm-button"
            disabled={confirmationInput !== verificationText}
          >
            {confirmButtonText}
          </Button>
        </div>
      </WhitePaper>
    </Modal>
  );
};

export default ConfirmationModal;

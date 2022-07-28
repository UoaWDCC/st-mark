import React from "react";
import { Button, Modal } from "@mui/material";
import styles from "./SuccessModal.module.css";
import WhitePaper from "../../Admin/common/WhitePaper";

interface SuccessModalProps {
  message?: string;
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  message = "Success",
  open,
  onClose,
}: SuccessModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <WhitePaper className={styles.modal}>
        <div className={styles.message}>{message}</div>
        <div className={styles.buttons}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            data-testid="ok-button"
          >
            Ok
          </Button>
        </div>
      </WhitePaper>
    </Modal>
  );
};

export default SuccessModal;

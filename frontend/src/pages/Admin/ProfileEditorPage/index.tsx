import React, { useState } from "react";
import { Button, Snackbar, SnackbarContent } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import NavBar from "../../../components/Admin/common/NavBar";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import Spinner from "../../../components/common/Spinner";
import BasicInfoEditor from "../../../components/Admin/ProfileEditor/BasicInfoEditor";
import BiographyEditor from "../../../components/Admin/ProfileEditor/BiographyEditor";
import DisplayImageEditor from "../../../components/Admin/ProfileEditor/DisplayImageEditor";
import LinkEditor from "../../../components/Admin/ProfileEditor/LinkEditor";
import useGet from "../../../hooks/useGet";
import useDelete from "../../../hooks/useDelete";
import { IPersonAll } from "../../../types/schema";
import styles from "./ProfileEditorPage.module.css";
import AnecdoteEditor from "../../../components/Admin/ProfileEditor/AnecdoteEditor";
import Error from "../../../components/common/Error";
import {
  ProfileError,
  ServerError,
} from "../../../components/common/Error/ErrorUtils";
import ImageEditor from "../../../components/Admin/ProfileEditor/ImageEditor";
import usePageTitle from "../../../hooks/usePageTitle";

const ProfileEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const {
    data: person,
    isLoading,
    status,
    reFetch,
  } = useGet<IPersonAll>(`/api/person/${id}`);
  const deletePerson = useDelete<void>();

  // Set page title
  usePageTitle(person ? `Editing ${person?.fullName}` : "Admin");

  const [open, setOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const showMessage = (message: string) => {
    setSnackbarMsg(message);
    setOpen(true);
  };

  const [deleteModelOpen, setDeleteModelOpen] = useState<boolean>(false);

  const handleOpenDeleteModal = () => {
    setDeleteModelOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModelOpen(false);
  };

  const handleConfirmDelete = async () => {
    const { error } = await deletePerson(`/api/person/${id}`);
    if (error) {
      setSnackbarMsg(`Profile was not deleted succesfully. Please try again.`);
      setOpen(true);
      handleCloseDeleteModal();
      return;
    }
    history.replace("/admin");
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar backDestination="/admin">
        {person && (
          <Button
            variant="contained"
            color="secondary"
            data-testid="delete-profile-button"
            onClick={handleOpenDeleteModal}
          >
            Delete Profile
          </Button>
        )}
      </NavBar>
      {person && (
        <div className={styles.pageContent}>
          <div className={styles.row}>
            <BasicInfoEditor person={person} onSave={showMessage} />
            <DisplayImageEditor person={person} onSave={showMessage} />
          </div>

          <BiographyEditor person={person} onSave={showMessage} />

          <ImageEditor
            person={person}
            onSave={showMessage}
            updatePerson={reFetch}
          />

          <AnecdoteEditor
            person={person}
            onSave={showMessage}
            updatePerson={reFetch}
          />

          <LinkEditor
            person={person}
            onSave={showMessage}
            updatePerson={reFetch}
          />

          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
          >
            <SnackbarContent message={snackbarMsg} />
          </Snackbar>

          <ConfirmationModal
            message={`Are you sure you want to delete this profile? This is irreversible.`}
            confirmButtonText="Delete"
            verificationText={person.fullName}
            open={deleteModelOpen}
            onConfirm={handleConfirmDelete}
            onClose={handleCloseDeleteModal}
          />
        </div>
      )}
      {isLoading && <Spinner />}
      {!!status && status >= 400 && status < 500 && (
        <Error
          message={ProfileError}
          director={{
            url: "/admin",
            prompt: "Return to profile list",
          }}
        />
      )}
      {!!status && status >= 500 && <Error message={ServerError} />}
    </div>
  );
};

export default ProfileEditorPage;

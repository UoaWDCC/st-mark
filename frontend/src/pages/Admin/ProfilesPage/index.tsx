import React, { useState } from "react";
import { Button, Snackbar, SnackbarContent } from "@mui/material";
import { useHistory } from "react-router";
import NavBar from "../../../components/Admin/common/NavBar";
import Spinner from "../../../components/common/Spinner";
import Table from "../../../components/Admin/Profiles/Table";
import CreateProfileModal from "../../../components/Admin/Profiles/CreateProfileModal";
import useGet from "../../../hooks/useGet";
import usePost from "../../../hooks/usePost";
import { IPerson } from "../../../types/schema";
import styles from "./ProfilesPage.module.css";
import usePageTitle from "../../../hooks/usePageTitle";
import LogoutButton from "../../../components/Admin/common/LogoutButton";

const ProfilesPage: React.FC = () => {
  usePageTitle("Admin");

  const history = useHistory();

  const { data: people } = useGet<IPerson[]>("/api/person");
  const post = usePost<IPerson>();

  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };
  const handleConfirmCreate = async (
    first: string,
    middles: string,
    last: string
  ) => {
    const { data, error } = await post(`/api/person`, {
      name: { first, middles, last },
    });
    if (error) {
      setSnackBarMessage("Failed to create profile. Please try again.");
      setErrorSnackBarOpen(true);
    }
    handleCloseCreateModal();
    data && history.push(`/admin/edit/profile/${data?._id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar title="Profiles">
        <LogoutButton />
        {people && (
          <Button
            variant="contained"
            color="secondary"
            data-testid="create-new-button"
            onClick={handleOpenCreateModal}
          >
            Create New Profile
          </Button>
        )}
      </NavBar>
      {people ? (
        <div className={styles.content}>
          <Table people={people || []} />
        </div>
      ) : (
        <Spinner />
      )}
      <CreateProfileModal
        open={createModalOpen}
        onConfirm={handleConfirmCreate}
        onClose={handleCloseCreateModal}
      />

      <Snackbar
        open={errorSnackBarOpen}
        autoHideDuration={6000}
        onClose={() => setErrorSnackBarOpen(false)}
      >
        <SnackbarContent message={snackBarMessage} />
      </Snackbar>
    </div>
  );
};

export default ProfilesPage;

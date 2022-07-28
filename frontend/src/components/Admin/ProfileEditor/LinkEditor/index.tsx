import React, { useState } from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { IPersonAll, ILink } from "../../../../types/schema";
import { getValidLink } from "../../../../utils/links";
import styles from "./LinkEditor.module.css";
import useDelete from "../../../../hooks/useDelete";
import usePost from "../../../../hooks/usePost";
import CreateLinkModal from "./CreateLinkModal";

interface LinkEditorProps {
  person: IPersonAll;
  updatePerson: () => void;
  onSave: (message: string) => void;
}

const LinkEditor: React.FC<LinkEditorProps> = ({
  person,
  updatePerson,
  onSave,
}: LinkEditorProps) => {
  const [linkToDelete, setLinkToDelete] = useState<ILink>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteLink = useDelete();

  const handleOpenDeleteModal = (link: ILink) => {
    setLinkToDelete(link);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setLinkToDelete(undefined);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    const { status } = await deleteLink(
      `/api/person/${person._id}/link/${linkToDelete._id}`
    );
    setDeleteModalOpen(false);
    if (status == 204) {
      updatePerson();
      onSave("Deleted link.");
    } else {
      onSave("Failed to delete link. Please try again.");
    }
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const post = usePost();

  const handleCancelPost = () => {
    setCreateModalOpen(false);
  };

  const handleConfirmPost = async (title: string, url: string) => {
    const { status } = await post(`/api/person/${person._id}/link`, {
      title,
      url,
    });
    setCreateModalOpen(false);
    if (status == 201) {
      updatePerson();
      onSave("Added new link.");
    } else {
      onSave("Failed to add new link. Please try again.");
    }
  };

  return (
    <Paper className={styles.container}>
      <Typography variant="h6">Links</Typography>

      <Paper className={styles.linkContainer}>
        {person.links && person.links.length > 0 ? (
          <List>
            {person.links.map((link) => (
              <ListItem
                key={`link-${link._id}`}
                data-testid={`link-${link._id}`}
                button
                component="a"
                href={getValidLink(link.url)}
                target="_blank"
                rel="noreferrer"
                divider
              >
                <ListItemText primary={link.title} secondary={link.url} />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleOpenDeleteModal(link)}
                    edge="end"
                    size="large"
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography className={styles.noLinksMessage} align="center">
            No links found.
          </Typography>
        )}
      </Paper>

      <div className={styles.buttonContainer}>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Add New
        </Button>
      </div>

      <CreateLinkModal
        open={createModalOpen}
        onClose={handleCancelPost}
        onConfirm={handleConfirmPost}
      />

      <ConfirmationModal
        message="Are you sure you want to delete this link? This is irreversible."
        confirmButtonText="Delete"
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Paper>
  );
};

export default LinkEditor;

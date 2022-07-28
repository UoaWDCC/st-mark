import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { Delete as DeleteIcon } from "@mui/icons-material";
import useDelete from "../../../../hooks/useDelete";
import usePost from "../../../../hooks/usePost";
import { IAnecdote, IPersonAll } from "../../../../types/schema";
import ConfirmationModal from "../../../common/ConfirmationModal";
import styles from "./AnecdoteEditor.module.css";
import CreateAnecdoteModal from "./CreateAnecdoteModal";

const DeleteIconButton = withStyles({
  root: { marginLeft: "0.5em" },
})(IconButton);

const OverflowCard = withStyles({
  root: { overflowY: "auto" },
})(Card);

interface AnecdoteEditorProps {
  person: IPersonAll;
  updatePerson: () => void;
  onSave: (message: string) => void;
}

const AnecdoteEditor: React.FC<AnecdoteEditorProps> = (
  props: AnecdoteEditorProps
) => {
  const { person, updatePerson, onSave } = props;
  const { _id: personId, anecdotes } = person;

  // Delete functions and state
  const [anecdoteToDelete, setAnecdoteToDelete] = useState<IAnecdote>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const deleteAnecdote = useDelete();

  const handleOpenDeleteModal = (anecdote: IAnecdote) => {
    setAnecdoteToDelete(anecdote);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setAnecdoteToDelete(undefined);
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!anecdoteToDelete) return;
    const { status } = await deleteAnecdote(
      `/api/person/${personId}/anecdote/${anecdoteToDelete._id}`
    );
    setDeleteModalOpen(false);
    if (status == 204) {
      updatePerson();
      onSave("Deleted anecdote.");
    } else {
      onSave("Failed to delete anecdote. Please try again.");
    }
  };

  // Post/Create functions and state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const post = usePost();

  const handleCancelPost = () => {
    setCreateModalOpen(false);
  };

  const handleConfirmPost = async (content: string) => {
    const { status } = await post(`/api/person/${personId}/anecdote`, {
      content,
    });
    setCreateModalOpen(false);
    if (status == 201) {
      updatePerson();
      onSave("Added new anecdote.");
    } else {
      onSave("Failed to add new anecdote. Please try again.");
    }
  };

  return (
    <Paper className={styles.container}>
      <Typography variant="h6">Anecdotes</Typography>

      {anecdotes && anecdotes.length > 0 ? (
        <div className={styles.anecdotesContainer}>
          {anecdotes.map((anecdote) => (
            <OverflowCard
              className={styles.anecdoteCard}
              key={`anecdote-${anecdote._id}`}
              data-testid={`anecdote-${anecdote._id}`}
            >
              <CardContent>
                <DeleteIconButton
                  className={styles.deleteIcon}
                  onClick={() => handleOpenDeleteModal(anecdote)}
                >
                  <DeleteIcon color="error" />
                </DeleteIconButton>
                <Typography style={{ whiteSpace: "pre-line" }}>
                  {anecdote.content}
                </Typography>
              </CardContent>
            </OverflowCard>
          ))}
        </div>
      ) : (
        <Typography className={styles.noAnecdotesMessage} align="center">
          No anecdotes found.
        </Typography>
      )}

      <div className={styles.buttonContainer}>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Add New
        </Button>
      </div>

      <ConfirmationModal
        message="Are you sure you want to delete this anecdote? This is irreversible."
        confirmButtonText="Delete"
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <CreateAnecdoteModal
        open={createModalOpen}
        onClose={handleCancelPost}
        onConfirm={handleConfirmPost}
      />
    </Paper>
  );
};

export default AnecdoteEditor;

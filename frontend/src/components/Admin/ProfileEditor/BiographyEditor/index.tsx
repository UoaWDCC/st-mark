import React, { useState } from "react";
import { Button, Paper, TextField, Typography } from "@mui/material";
import usePatch from "../../../../hooks/usePatch";
import { IPersonAll } from "../../../../types/schema";
import styles from "./BiographyEditor.module.css";

interface BiographyEditorProps {
  person: IPersonAll;
  onSave: (message: string) => void;
}

const BiographyEditor: React.FC<BiographyEditorProps> = ({
  person,
  onSave,
}: BiographyEditorProps) => {
  const [bio, setBio] = useState<string | undefined>(person.biography);
  const patch = usePatch<IPersonAll>();
  const [canSave, setCanSave] = useState(true);

  const save = async () => {
    setCanSave(false);
    const { status } = await patch(`/api/person/${person._id}`, {
      biography: bio,
    });
    if (status == 200) {
      onSave("Biography saved successfully");
    } else {
      onSave("Failed to save biography");
    }
    setCanSave(true);
  };

  return (
    <Paper className={styles.container}>
      <Typography variant="h6">Biography</Typography>
      <TextField
        defaultValue={person.biography}
        placeholder="Enter a Biography"
        inputProps={{ "aria-label": "biography-field" }}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        color="secondary"
        multiline
        minRows={8}
        maxRows={8}
        className={styles.textField}
      />
      <div className={styles.saveButtonContainer}>
        <Button
          variant="contained"
          aria-label="biography-save"
          onClick={save}
          disabled={!canSave}
        >
          Save
        </Button>
      </div>
    </Paper>
  );
};

export default BiographyEditor;

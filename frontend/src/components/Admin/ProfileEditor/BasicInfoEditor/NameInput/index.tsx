import React, { useState, useEffect } from "react";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { IName } from "../../../../../types/schema";
import styles from "./NameInput.module.css";

interface NameInputProps {
  name: IName;
  onChange: (name: IName) => void;
}

const NameInput: React.FC<NameInputProps> = ({
  name,
  onChange,
}: NameInputProps) => {
  const [first, setFirst] = useState(name.first);
  const [middles, setMiddles] = useState(name.middles);
  const [last, setLast] = useState(name.last);

  useEffect(() => {
    onChange({ first, middles, last });
  }, [first, middles, last, onChange]);

  return (
    <div className={styles.container}>
      <FormControl>
        <TextField
          defaultValue={name.first}
          placeholder="First"
          inputProps={{ "aria-label": "first-name-field" }}
          onChange={(e) => setFirst(e.target.value)}
          color="secondary"
          className={styles.input}
        />
        <FormHelperText>First</FormHelperText>
      </FormControl>

      <FormControl>
        <TextField
          defaultValue={name.middles}
          placeholder="Middle"
          inputProps={{ "aria-label": "middle-name-field" }}
          onChange={(e) => setMiddles(e.target.value)}
          color="secondary"
          className={styles.input}
        />
        <FormHelperText>Middle</FormHelperText>
      </FormControl>

      <FormControl>
        <TextField
          defaultValue={name.last}
          placeholder="Last"
          inputProps={{ "aria-label": "last-name-field" }}
          error={!last}
          onChange={(e) => setLast(e.target.value)}
          color="secondary"
          className={styles.input}
        />
        <FormHelperText error={!last}>
          {last ? "Last" : "Last - must be non-empty"}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default NameInput;

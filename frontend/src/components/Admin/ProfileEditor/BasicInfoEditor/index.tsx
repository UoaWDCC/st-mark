import React, { useMemo, useState } from "react";
import { Button, Paper, Select, Typography } from "@mui/material";
import usePatch from "../../../../hooks/usePatch";
import useGet from "../../../../hooks/useGet";
import { IPersonAll, IPlot } from "../../../../types/schema";
import DateSelector from "./DateSelector";
import NameInput from "./NameInput";
import styles from "./BasicInfoEditor.module.css";
import { invalidDate } from "../../../../utils/dates";

interface BasicInfoEditorProps {
  person: IPersonAll;
  onSave: (message: string) => void;
}

const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({
  person,
  onSave,
}: BasicInfoEditorProps) => {
  const patch = usePatch<IPersonAll>();
  const [canSave, setCanSave] = useState(true);
  const { data: plots } = useGet<IPlot[]>("/api/plot");

  const [name, setName] = useState(person.name);
  const [dob, setDob] = useState(person.dateOfBirth);
  const [dod, setDod] = useState(person.dateOfDeath);
  const [plot, setPlot] = useState<string | undefined>(person.plot?._id);

  const memoizedPlots = useMemo(
    () => plots?.sort((plot1, plot2) => plot1.plotNumber - plot2.plotNumber),
    [plots]
  );

  const save = async () => {
    setCanSave(false);
    if (invalidDate(dob, dod)) {
      onSave(
        "Invalid dates provided. DOB and DOD cannot be set ahead of today's date. DOD can't be before DOB"
      );
      setCanSave(true);
      return;
    }

    const { status } = await patch(`/api/person/${person._id}`, {
      name: name,
      dateOfBirth: dob,
      dateOfDeath: dod,
      plot: plot !== "none" ? plot : null,
    });
    if (status == 200) {
      onSave("Successfully saved changes.");
    } else {
      onSave("Failed to save. Please try again.");
    }
    setCanSave(true);
  };

  return (
    <Paper className={styles.container}>
      <div className={styles.row}>
        <Typography variant="h6" className={styles.title}>
          Name
        </Typography>
        <NameInput name={person.name} onChange={setName} />
      </div>

      <div className={styles.row}>
        <Typography variant="h6" className={styles.title}>
          DOB
        </Typography>
        <DateSelector date={person.dateOfBirth} onChange={setDob} />
      </div>

      <div className={styles.row}>
        <Typography variant="h6" className={styles.title}>
          DOD
        </Typography>
        <DateSelector date={person.dateOfDeath} onChange={setDod} />
      </div>

      <div className={styles.row}>
        <Typography variant="h6" className={styles.title}>
          Plot
        </Typography>
        <Select
          value={plot || "none"}
          onChange={(e) => setPlot(e.target.value as string)}
          color="secondary"
          className={styles.plotSelect}
          native
        >
          <option value={"none"}>None</option>
          {memoizedPlots?.map((plot) => (
            <option key={`plot-${plot.plotNumber}`} value={plot._id}>
              {`${plot.registeredName} (${plot.plotNumber})`}
            </option>
          ))}
        </Select>
      </div>

      <div className={styles.saveButtonContainer}>
        <Button
          variant="contained"
          onClick={save}
          disabled={!canSave || !name.last}
        >
          Save
        </Button>
      </div>
    </Paper>
  );
};

export default BasicInfoEditor;

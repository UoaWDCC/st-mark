import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { withStyles } from "@mui/styles";
import { Paper } from "@mui/material";
import { useHistory } from "react-router";
import styles from "./Table.module.css";
import { IDate, IPerson } from "../../../../types/schema";
import { dateToString } from "../../../../utils/dates";
import {
  dateComparator,
  numberComparator,
  stringComparator,
} from "./utils/comparators";

const columns: GridColDef[] = [
  {
    field: "name.first",
    headerName: "First Name",
    valueGetter: (params) => params.row?.name?.first,
    sortComparator: (v1, v2) =>
      stringComparator(v1 as string | undefined, v2 as string | undefined),
    minWidth: 200,
  },
  {
    field: "name.middles",
    headerName: "Middle Name(s)",
    valueGetter: (params) => params.row?.name?.middles,
    sortComparator: (v1, v2) =>
      stringComparator(v1 as string | undefined, v2 as string | undefined),
    minWidth: 200,
  },
  {
    field: "name.last",
    headerName: "Last Name",
    valueGetter: (params) => params.row?.name?.last,
    sortComparator: (v1, v2) =>
      stringComparator(v1 as string | undefined, v2 as string | undefined),
    minWidth: 200,
  },
  {
    field: "dateOfBirth",
    headerName: "Date of Birth",
    valueFormatter: (params) => dateToString(params.row?.dateOfBirth, true),
    minWidth: 200,
    sortComparator: (v1, v2) =>
      dateComparator(v1 as IDate | undefined, v2 as IDate | undefined),
    filterable: false,
  },
  {
    field: "dateOfDeath",
    headerName: "Date of Death",
    valueFormatter: (params) => dateToString(params.row?.dateOfDeath, true),
    minWidth: 200,
    sortComparator: (v1, v2) =>
      dateComparator(v1 as IDate | undefined, v2 as IDate | undefined),
    filterable: false,
  },
  {
    field: "plotNumber",
    headerName: "Plot #",
    valueGetter: (params) => params.row?.plot?.plotNumber,
    sortComparator: (v1, v2) =>
      numberComparator(v1 as number | undefined, v2 as number | undefined),
    minWidth: 125,
  },
  {
    field: "registeredName",
    headerName: "Plot Name",
    valueGetter: (params) => params.row?.plot?.registeredName,
    sortComparator: (v1, v2) =>
      stringComparator(v1 as string | undefined, v2 as string | undefined),
    minWidth: 160,
  },
];

const StyledDataGrid = withStyles({
  root: {
    "& .MuiDataGrid-row": { cursor: "pointer" },
    "& .MuiDataGrid-cell:focus": { outline: "solid #ececec 1px" },
  },
})(DataGrid);

interface ProfilesTableProps {
  people: IPerson[];
}

const Table: React.FC<ProfilesTableProps> = ({
  people,
}: ProfilesTableProps) => {
  const history = useHistory();

  return (
    <Paper className={styles.table}>
      <StyledDataGrid
        rows={[...people].reverse()}
        columns={columns}
        autoPageSize
        disableSelectionOnClick
        onRowClick={(params) =>
          history.push(`/admin/edit/profile/${params.row?.id}`)
        }
      />
    </Paper>
  );
};

export default Table;

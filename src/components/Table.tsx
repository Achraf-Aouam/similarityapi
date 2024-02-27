"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridColumnHeaderParams } from "@mui/x-data-grid";
import { ApiRequest } from "@prisma/client";
import { useTheme } from "next-themes";
import { FC } from "react";

const columnsDraft: GridColDef[] = [
  {
    field: "col1",
    headerName: "API Key used",
    width: 400,
    renderHeader(params) {
      return (
        <strong className="font-semibold">{params.colDef.headerName} 🔑</strong>
      );
    },
  },
  { field: "col2", headerName: "Path", width: 250 },
  { field: "col3", headerName: "Recency", width: 250 },
  { field: "col4", headerName: "Duration", width: 150 },
  { field: "col5", headerName: "Status", width: 150 },
];

const colums = columnsDraft.map((col) => {
  if (col.field === "col1") {
    return col;
  }
  return {
    ...col,
    renderHeader(params: GridColumnHeaderParams<any, any, any>) {
      return (
        <strong className="font-semibold">{params.colDef.headerName}</strong>
      );
    },
  };
});

type ModifiedRequestType<K extends keyof ApiRequest> = Omit<ApiRequest, K> & {
  timestamp: string;
};

interface TableProps {
  userRequests: ModifiedRequestType<"timestamp">[];
}

const Table: FC<TableProps> = ({ userRequests }) => {
  const { theme: applicationTheme } = useTheme();
  const theme = createTheme({
    palette: {
      mode: applicationTheme === "light" ? "light" : "dark",
    },
  });
  const rows = userRequests.map((req) => ({
    id: req.id,
    col1: req.usedApiKey,
    col2: req.path,
    col3: `${req.timestamp} ago`,
    col4: `${req.duration}ms`,
    col5: req.Status,
  }));
  return (
    <ThemeProvider theme={theme}>
      <DataGrid
        style={{
          backgroundColor: applicationTheme === "light" ? "white" : "#152238",
          fontSize: "1rem",
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        columns={colums}
        rows={rows}
      />
    </ThemeProvider>
  );
};

export default Table;

import React from "react";
import { ThemeProvider } from "@material-ui/core";
import MUIDataTable from "mui-datatables"
import themeDatatable from "../../../styles/web/Datatable";

const DataTable = (props) => <ThemeProvider theme={themeDatatable}>
    <MUIDataTable {...props} />
</ThemeProvider>

export default DataTable;
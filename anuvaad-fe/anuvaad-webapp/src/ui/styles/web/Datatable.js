import { createMuiTheme } from "@material-ui/core/styles";

const style = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontWeight: "bold",
  },
  overrides: {
    MuiTableRow: {
      root: {
        // borderTop: "2px solid white",
        // borderBottom: "2px solid white",
        // height: "60px",
        // margin: "10px",
        "&$hover:hover:nth-child(odd)": { backgroundColor: "#D6EAF8" },
        "&$hover:hover:nth-child(even)": { backgroundColor: "#E9F7EF" },
      },
    },
    MUIDataTableBodyRow: {
      root: {
        "&:nth-child(odd)": {
          backgroundColor: "#D6EAF8",
        },
        "&:nth-child(even)": {
          backgroundColor: "#E9F7EF",
        },
      },
    },
    MUIDataTableFilterList: {
      chip: {
        display: "none",
      },
    },
    MuiMenu: {
      list: {
        minWidth: "269px",
      },
    },
    MUIDataTableFilter: {
      root: {
        backgroundColor: "white",
        width: "80%",
        fontFamily: '"Roboto" ,sans-serif',
      },
      checkboxFormControl: {
        minWidth: "200px",
      },
    },
    MuiList: {
      root: {
        fontFamily: '"Roboto" ,sans-serif',
      },
    },
    MUIDataTable: {
      paper: {
        minHeight: "674px",
        // boxShadow: "0px 0px 2px #00000029",
        // border: "0",

      },
      responsiveBase: {
        minHeight: "560px",
      },
    },
    MUIDataTableToolbar: {
      filterPaper: {
        width: "310px",
      },
      MuiButton: {
        root: {
          display: "none",
        },
      },
    },

    MUIDataTableToolbarSelect: {
        root: {
          backgroundColor: "#FFFFFF",
          zIndex: 120
        }
    },

    MuiGrid: {
      grid: {
        maxWidth: "100%",
      },
    },

    MuiTableCell: {
      head: {
        padding: ".6rem .5rem .6rem 1.5rem",
        backgroundColor: "#F8F8FA !important",
        marginLeft: "25px",
        letterSpacing: "0.74",
        fontWeight: "bold",
        minHeight: "700px",
      },
    },

    // MuiTableFooter:{
    //   root:{

    //     "@media (min-width: 1050px)": {
    //       position:"absolute",
    //       right:"15%",
    //       top:"46.5rem",
    //       borderBottom:"1px"

    //     },

    //   }
    // },
    MuiPaper: {
      root: {
        // boxShadow: "none !important",
        borderRadius: 0,
        // border: "1px solid rgb(224 224 224)",
      },
    },
    MuiDialog: {
      paper: { minWidth: "360px", minHeight: "116px" },
    },
    MuiAppBar: {
      root: {
        boxSizing: "none",
        margin: "-1px",
        padding: "0px",
      },
    },
    MuiToolbar: {
      root: {
        // padding: 0,
      },
      gutters: {
        // padding: 0,
        "@media (min-width: 600px)": {
          // padding: 0,
        },
      },
    },
    MuiFormControlLabel: {
      root: {
        height: "36px",
      },
      label: {
        fontFamily: '"Roboto" ,sans-serif',
        fontSize: "0.875rem",
      },
    },

    MUIDataTableBodyCell: {
      root: { padding: ".5rem .5rem .5rem .8rem", textTransform: "capitalize" },

      stackedParent: {
        "@media (max-width: 400px)": {
          display: "table-row",

        }
      },

    },
    MuiButton: {
      root: {
        minWidth: "25",
        borderRadius: "0",
      },
      label: {
        textTransform: "none",
        fontFamily: '"Segoe UI","Roboto"',
        fontSize: "15px",
        fontWeight: "bold",
        lineHeight: "1.14",
        letterSpacing: "0.5px",
        textAlign: "center",
        height: "26px",
      },
      sizeLarge: {
        height: "48px",
      },
      sizeSmall: {
        height: "36px",
      },
    },
  },
  palette: {
    primary: {
      light: "#60568d",
      main: "#2C2799",
      dark: "#271e4f",
      contrastText: "#FFFFFF",
    },
    secondary: {
      light: "#FFFFFF",
      main: "#FFFFFF",
      dark: "#FFFFFF",
      contrastText: "#000000",
    },
    background: {
      default: "#2C2799",
    },
  },
});

export default style;

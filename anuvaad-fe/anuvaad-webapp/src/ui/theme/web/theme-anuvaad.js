import { createMuiTheme } from "@material-ui/core/styles";

const themeAnuvaad = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontWeight: "400",
  },
  overrides: {
    MuiTableRow: {
      root: {
        height: "60px",
        margin: "10px",
        // cursor: "pointer",
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
        minWidth: "210px",
      },
    },
    MuiMenuItem:{
      root: {
        "@media (max-width:670px)": {
          fontSize: '0.875rem'
        },
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
      padding:{
        "@media (max-width:670px)": {
          padding: "0px",
          paddingLeft:'9px',
        },
      }
    },
    MUIDataTable: {
      paper: {
        minHeight: "674px",
        boxShadow: "0px 0px 2px #00000029",
        border: "1px solid #0000001F",
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
    MUIDataTableHeadCell: {
      root: {
        "&:nth-child(1)": {
          width: "25%",
        },
        "&:nth-child(2)": {
          width: "18%",
        },
        "&:nth-child(3)": {
          width: "18%",
        },
        "&:nth-child(4)": {
          width: "18%",
        },
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
        boxShadow: "none !important",
        borderRadius: 0,
        border: "1px solid rgb(224 224 224)",
      },
    },
    MuiDialog: {
      paper: { minWidth: "360px", minHeight: "116px" },
    },
    MuiAppBar: {
      root: {
        boxSizing: "border-box",
        margin: "-1px",
        padding: "0px",
      },
    },
    MuiToolbar: {
      root: {
        padding: 0,
      },
    },
    MuiFormControlLabel: {
      root: {
        height: "36px",
      },
      label: {
        fontFamily: '"Roboto" ,sans-serif',
        fontSize: "0.875rem",
        "@media (max-width:640px)": {
          fontSize: "10px",
        },
      },
    },

    MUIDataTableBodyCell: {
      root: { padding: ".5rem .5rem .5rem .8rem"},
    },
    MuiButton: {
      root: {
        minWidth: "25",
        borderRadius: "none",
      },
      label: {
        textTransform: "none",
        fontFamily: '"Roboto", "Segoe UI"',
        fontSize: "16px",
        //fontWeight: "500",
        //lineHeight: "1.14",
        letterSpacing: "0.5px",
        textAlign: "center",
        display:'flex',
        justifyContent:'center',
        height: "19px",
        "@media (max-width:640px)": {
          fontSize: "10px",
        },
      },
      sizeLarge: {
        height: "40px",
        borderRadius: "20px",
      },
      sizeMedium: {
        height: "40px",
        borderRadius: "20px",
      },
      sizeSmall: {
        height: "30px",
        borderRadius: "20px",
      },
    },
    MuiTabs: {
      indicator: {
        // display:'none',
        backgroundColor: "#FD7F23",
      
       
      },
    },
    MuiTab: {
      root: {
        width: "auto",
        fontSize: "18px",
        fontWeight: "300",
        letterSpacing: "0px",
        fontFamily: "Roboto",
        // '&:first-child':{
        padding: "0",
        marginRight: "28px",
        "@media (min-width:600px)": {
          minWidth: "auto",
        },
        "@media (max-width:600px)": {
          marginRight: "20px",
          minWidth: "auto",
        },
        "@media (max-width:550px)": {
          fontSize: "1rem",
        },
      },
      textColorInherit: {
        color: "#3A3A3A",
        opacity: 1,
        "&.Mui-selected": {
          fontWeight: "bold",
        },
      },
      wrapper: {
        alignItems: "flex-start",
        textTransform: "none",
      },
    },
    MuiBox: {
      root: {
        padding: "24px 0px",
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
      default: "#FFFFFF",
    },
  },
});

themeAnuvaad.typography.h1 = {
  fontSize: "3.125rem",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  "@media (max-width:550px)": {
    fontSize: "2rem",
  },
};
themeAnuvaad.typography.h2 = {
  fontSize: "2.5rem",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  "@media (max-width:550px)": {
    fontSize: "1.5rem",
  },
};
themeAnuvaad.typography.h3 = {
  fontSize: "1.6875rem",
  //letterSpacing: "1.98px",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  letterSpacing: "0px",
  "@media (max-width:550px)": {
    fontSize: "1.3rem",
  },
};
themeAnuvaad.typography.h4 = {
  fontSize: "1.5rem",
  // letterSpacing: "1.98px",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  "@media (max-width:550px)": {
    fontSize: "0.9rem",
  },
};
themeAnuvaad.typography.h5 = {
  fontSize: "1.3125rem",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  "@media (max-width:550px)": {
    fontSize: "1rem",
  },
};
themeAnuvaad.typography.h6 = {
  fontSize: "1.125rem",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  paddingTop: "4px",
  "@media (max-width:550px)": {
    fontSize: "1rem",
  },
};
themeAnuvaad.typography.body1 = {
  fontSize: "1.25rem",
  fontFamily: '"Roboto", sans-serif ,sans-serif',
  fontWeight: "400",
};
themeAnuvaad.typography.body2 = {
  fontSize: "0.875rem",
  fontFamily: '"Roboto", sans-serif',
  fontWeight: "400",
  color: "#0C0F0F",
  lineHeight: "22px",
};
themeAnuvaad.typography.caption = {
  fontSize: "0.75rem",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: "400",
};
themeAnuvaad.typography.subtitle1 = {
  fontSize: "1.125rem",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: "400",
  "@media (max-width:550px)": {
    fontSize: ".9rem",
  },
};
themeAnuvaad.typography.subtitle2 = {
  fontSize: "1rem",
  fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
  fontWeight: "300",
  "@media (max-width:550px)": {
    fontSize: ".7rem",
  },
};

export default themeAnuvaad;

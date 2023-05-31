import { createTheme } from "@mui/material/styles";

const themeDefault = createTheme({

      typography: {
        fontFamily: "rubik,sans-serif",
        fontWeight: "500",
        h1: {
          fontSize: "3.125rem",
          fontFamily: '"rubik" ,sans-serif',
          fontWeight: "500",
          "@media (max-width:550px)": {
            fontSize: "2rem",
          },
        },
        h2: {
          fontSize: "2.5rem",
          fontFamily: '"rubik" ,sans-serif',
          fontWeight: "500",
          "@media (max-width:550px)": {
            fontSize: "1.5rem",
          },
        },
        h3: {
          fontSize: "1.6875rem",
          fontFamily: '"rubik" ,sans-serif',
          fontWeight: "500",
          letterSpacing: "0px",
          "@media (max-width:550px)": {
            fontSize: "1.3rem",
          },
        },
        h4: {
          fontSize: "1.999rem",
          fontFamily: '"rubik" ,"Roboto","Rowdies" ,sans-serif',
          fontWeight: "500",
          "@media (max-width:550px)": {
            fontSize: "1.5rem",
          },
        },
        h5: {
          fontSize: "1.3125rem",
          fontFamily: '"Rowdies",sans-serif',
          fontWeight: "300",
          "@media (max-width:550px)": {
            fontSize: "1rem",
          },
        },
        h6: {
          fontSize: "1.125rem",
          fontFamily: '"Rowdies",sans-serif',
          fontWeight: "300",
          paddingTop: "4px",
          "@media (max-width:550px)": {
            fontSize: "1rem",
          },
        },
        body1: {
          fontSize: "1.25rem",
          fontFamily: '"Roboto" ,sans-serif',
          fontWeight: "400",
        },
        body2: {
          fontSize: "0.875rem",
          fontFamily: '"Roboto", sans-serif',
          fontWeight: "400",
          color: "#0C0F0F",
          lineHeight: "22px",
        },
        caption: {
          fontSize: "0.75rem",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "400",
          color: "#3A3A3A"
        },
        subtitle1: {
          fontSize: "1.125rem",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "400",
          "@media (max-width:550px)": {
            fontSize: ".9rem",
          },
        },
        subtitle2: {
          fontSize: "1rem",
          fontFamily: '"Rowdies" ,sans-serif',
          fontWeight: "300",
          "@media (max-width:550px)": {
            fontSize: ".7rem",
          },
        },
      },

    
});



;

export default themeDefault;

import { makeStyles } from "@mui/styles";
import AnuvaadbackgroundImage from "../../img/Slide.png"

const DatasetStyle = makeStyles({
  Anuvaanlogo: {
    width: "90%",
    margin: "0px 0px 0px 0px",
    filter: "grayscale(100%)",
    "&:hover": {
      filter: "grayscale(0%)",
    },
  },
  section:{
    backgroundImage: `url(${AnuvaadbackgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "0 5%",
        display: "flex",
        alignItems: "center",

  },
  headerbtn: {
    color: "#51504f",
    textTransform: "capitalize",
    fontSize: "16px",
    fontFamily: "roboto,sans-serif",
  },


  Anuvaadtitle: {
    fontWeight: "500",
    fontSize: "62px",
    lineHeight: 1.17,
    color: "#3a3a3a",
    textAlign: "left",
    margin: "0 35px 25px 45px",
  },
  footerGridMain: {
    backgroundColor: "#51504f",
    padding: "30px",
    color: "white",
    display: "grid",
    textAlign: "end",
  },
  footerGridMains: {
    backgroundColor: "#51504f",
    padding: "10px",
    color: "white",
    display: "flex",
    textAlign: "start",
  },
  footerGrid: {
    backgroundColor: "#636365",
    padding: "20px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
  },
  integrationPaper: {
    padding: "2px 4px",
    display: "block",
    alignItems: "center",
    width: "250px",
    border: "1px solid gray",
  },
  featuresimg: {
    width: "150px",
    margin: "20px 50px 12px 0px",
    float: "left",
  },
  titles:{
    fontSize: "55px",
    lineHeight: 1.17,
    color: "#51504f",
    marginBottom: "50px",
  },
  featuresTitle: {
    display: "flex",
    fontWeight: 500,
    lineHeight: "1.17px",
    color: "#51504f",
    letterSpacing: "1px",
  },
  PrinciplesContent:{
    fontSize: "16px", color: "#707070", lineHeight: "25px" 
  },
  featuresContent:{
    textAlign: "left",
    fontSize: "16px",
    color: "#707070",
    lineHeight: "25px",
  },
  principlesTitle: {
    // fontWeight: 500,
    letterSpacing: "1px",
    fontSize: "35px",
    lineHeight: 1.17,
    color: "#51504f",
    justifyContent: "center",
    //    fontFamily:" roboto,sans-serif!important"
  },
  homeLink: {
    color: "#000",
    textDecoration: "underline",
    "&:hover": {
      color: "#000",
      textDecoration: "underline",
    },
  },

  description: {
    fontSize: "1.25rem",
    lineHeight: "2rem",
    margin: "0 35px 25px 0",
    textAlign: "justify",
  },
  footerimg: {
    width: "100px",
    margin: "20px 0px 12px 0px",
  },
  buttons: {
    textTransform: "capitalize",
    padding: "10px",
    backgroundColor: "rgb(44, 39, 153)",
    borderRadius: "5px",
    textAlign: "left",
    marginRight:"65%"
   
  },
  thanks:{
    "&:hover": {
        textDecoration: "underline",
        cursor: "pointer",
      },
      userImg:{
        maxHeight: "300px",
        maxWidth: "200px",
        borderRadius: "50%",
        marginTop: "5px",

      }

  }
});

export default DatasetStyle;

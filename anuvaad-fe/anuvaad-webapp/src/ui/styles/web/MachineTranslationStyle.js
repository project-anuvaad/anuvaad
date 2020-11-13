const MachineTranslationStyles = theme => ({
  paper: {
    border: "1px solid #1C9AB7",
    minHeight: "100%",
    backgroundColor: "#F4FDFF",
    marginBottom: "20px"
  },
  paper2: {
    border: "1px solid grey",
    minHeight: "100%",
    backgroundColor: "#e3e3e4"
  },
  header: {
    color: '#000000',
    paddingLeft: "3%",
    textAlign: "left",
  },
  div: {
    minHeight: "60%",
    padding: "0% 3%",
    textAlign: "justify"
  },
  dictionary: {
    border: "1px solid #1C9AB7",
    minHeight: "100%",
    overflow: "auto",
    marginTop: "20px",
    maxHeight: window.innerHeight - 600,
  },

  sourcediv: {
    padding: "3%",
    fontWeight: "bold",
    textAlign: "justify"
  },
  targetdiv:{
    textAlign: "justify"
  }
  
});


export default MachineTranslationStyles;



const PdfToDocStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%'
  },
  withoutLabel: {
    marginTop: theme.spacing(3) 
  },
  typographyHeader: {
    marginTop: '30%'
  },
  paper: {
    width: "40%",
    minWidth: "20%",
    marginTop: "2%",
    padding: "3%",
    marginBottom: '5%',
  },
  button: {
    marginTop: "6%",
    width: "100%",
    
    borderRadius: "20px 20px 20px 20px",
    height: '45px'
  },

  dropZoneArea: {
    paddingTop: '80px',
    minHeight: '363px',
    height: "60px",
    borderColor: '#1C9AB7',
    backgroundColor: '#F5F9FA',
    border: '1px dashed #1C9AB7',
    fontColor: '#1C9AB7',
    "& svg": { color: '#1C9AB7', },
    "& p": {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      fontSize: "19px",
      color: '#1C9AB7',

    },


  }



});


export default PdfToDocStyles;

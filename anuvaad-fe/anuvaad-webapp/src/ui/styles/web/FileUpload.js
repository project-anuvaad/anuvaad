

const FileUploadStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%'
  },
  withoutLabel: {
    marginTop: theme.spacing(2)
  },
  div: {
    display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', paddingTop: "5%"
  },
  typographyHeader: {
    paddingTop: '1%',
    minWidth: "5%",
    fontWeight: "bold"


  },
  typographySubHeader: {
    textAlign: 'center',
    fontWeight: '450',
    color: '#000000'
  },

  typography: {
    // marginLeft:"2%",
    marginTop: '1.7%',
    marginBottom: '2%',
    height: "18px"

  },
  select: {
    // marginRight: "30%",
    width: "100%",
    height: '40px',


  },
  paper: {
    width: "60%",
    minWidth: "200px",
    marginTop: "2%",
    marginBottom: '1%',
    padding: "3% 3% 3% 3%",
    // marginLeft: "15%",

    minHeight: '400px'
  },
  note: {
    width: "60%",
    minWidth: "200px",
    textAlign: 'center'
  },
  warningDialog: {
    padding: '2%',
    textAlign: 'center'
  },

  btnStyle: {
    width:'100%',
    backgroundColor: '#1C9AB7',
    borderRadius: "20px 20px 20px 20px",
    color: "#FFFFFF",
    height: '46px'
  },
  grid: {
    marginLeft: "5.5%"
  },
  textfield: {
    width: '95%',
    //marginLeft:"1%"
  },
  span: {
    color: 'red'
  },
  button
    : {
    marginTop: "6%",
    marginLeft: "2%",
    width: "100%",
    backgroundColor: '#1C9AB7',
    borderRadius: "20px 20px 20px 20px",
    color: "#FFFFFF"
  },
  button1: {
    //marginTop: "9%",
    marginLeft: '6.3%',
    width: "92.7%",
    backgroundColor: '#1C9AB7',
    borderRadius: "20px 20px 20px 20px",
    color: "#FFFFFF",
    height: '46px'
  },
  button2: {
    //arginTop: "9%",
    marginLeft: "5%",
    width: "88%",
    backgroundColor: '#1C9AB7',
    borderRadius: "20px 20px 20px 20px",
    color: "#FFFFFF",
    height: '46px'
  },
  // dropZoneArea:{


  //   paddingTop: '13%',
  //   top: "auto",
  //   width:'91%',
  //   minHeight:'340px',
  //   height: "100%",
  //   borderColor:'#1C9AB7',
  //   backgroundColor: '#F5F9FA',
  //   border: '1px dashed #1C9AB7',
  //   fontColor:'#1C9AB7',
  //   "& svg":{color:'#1C9AB7',},
  //   "& p": {
  //     textOverflow: "ellipsis",
  //     whiteSpace: "nowrap",
  //     overflow: "hidden",
  //     fontSize: "19px",
  //     color:'#1C9AB7',

  //   }
  // }

});


export default FileUploadStyles;

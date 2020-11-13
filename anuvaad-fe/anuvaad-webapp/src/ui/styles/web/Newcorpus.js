

const Newcorpus = theme => ({
  root: {
    display: 'flex', 
    flexDirection: 'column', 
    flex: 1, 
    textAlign: 'center', 
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%'
  },
  withoutLabel: {
    marginTop: theme.spacing(3) 
  },
  textField: {
    flexBasis:40,
    height:'30%',
    marginLeft: theme.spacing(-0.1),
    marginRight: theme.spacing(1),
    marginBottom:'10px'

  },
  typographyHeader:{
    paddingTop: "2%"
  },
  
  createButton: {
  justifyContent: 'center',
},

label:{
  paddingLeft:'30%',
  paddingRight:'3%'
},
select:{
  minWidth: 120, width: '95%', align: 'right',marginLeft:'4.9%' 
},
button: {
  justifyContent: 'center',
  left: theme.spacing(22),
  marginBottom:'2%',
  marginTop:'5%'
  ,
  width:'220px'
},
buttons: {
  justifyContent: 'center',
  left: theme.spacing(26),
  marginBottom:'2%',
  marginTop:'5%',
  width:'240px',
  marginLeft:'10%'
},

button1: {
  // justifyContent: 'center',
  // left: theme.spacing(1)*12,
  marginTop:'5%',
  marginLeft:'0.1%',
  width:'48%',
  height:'43px',
  
   borderRadius:"20px 20px 20px 20px",
},
btns: {
  justifyContent: 'center',
  left: theme.spacing(6),
  marginTop:'5%',
  width:'48%',
  height:'43px',
  marginLeft:'-2.6%',
  
   borderRadius:"20px 20px 20px 20px",
},
  paper: {
    marginTop:'2%',
    overflow: 'auto',
    width: '40%',
    padding:'3%',
  },
  buttonsDiv: {
    textAlign: 'center',
    padding: 10
  },
  flatButton: {
    color: '#ECEFF1'
  },
  checkRemember: {
    style: {
      float: 'left',
      maxWidth: 180,
      paddingTop: 5
    },
    labelStyle: {
      color: '#ECEFF1'
    },
    iconStyle: {
      color: '#ECEFF1',
      borderColor: '#ECEFF1',
      fill: '#ECEFF1'
    }
  },
  loginBtn: {
    float: 'right'
  },
  btn: {
    background: '#4f81e9',
    color: "white",
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13,
  },
  dropZoneArea:{
    paddingTop: '7%',
    minHeight:'200px',
    height: "300px",
    borderColor:'#1C9AB7',
    backgroundColor: '#F5F9FA',
    border: '1px dashed #1C9AB7',
    fontColor:'#1C9AB7',
    "& svg":{color:'#1C9AB7',},
    "& p": {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      fontSize: "19px",
      color:'#1C9AB7',
      
    }
  }
});


export default Newcorpus;

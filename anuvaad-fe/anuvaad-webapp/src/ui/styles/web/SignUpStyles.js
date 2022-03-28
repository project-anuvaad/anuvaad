

const SignUpStyles = theme => ({
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
  typographyHeader:{
    marginTop: '5%', 
    marginBottom: '5%', 
    fontSize: '33px',
     color: '#003366' 
    

  },
  typographySubHeader:{
    marginLeft:'38%'
  },

  typography: {
    marginLeft:"3%",
    marginTop:'4%',
    height:"18px",
    fontSize:"18px" 
    
  },
  select:{
    marginRight: "30%",
    width:"100%" ,
    
  },
 paper: {
    width: "60%",
    minWidth: "200px",
    marginTop: "3%",
    padding: "2% 2% 4% 2%",
    marginLeft: "15%",
  },
  grid:{
    marginLeft: "4%" 
  },
  textfield:{
    width: '87%',
    marginLeft:"3%"
  },
  button: {
    marginTop: "4%",
    marginLeft: "5%",
    width: "90%",
    backgroundColor:'#1ca9c9',
    borderRadius:"20px 20px 20px 20px",
    color:"#FFFFFF"
  },
  dropZoneArea:{
    minHeight:'385px',
    height: "304px"

  }
  
 
  
});


export default SignUpStyles;

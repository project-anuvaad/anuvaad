

const IntractiveTranslationStyles = theme => ({
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
  textField: {
    flexBasis:40,
    height:'30%',
    marginLeft: theme.spacing(-0.1),
    marginRight: theme.spacing(1),
    marginBottom:'10px'

  },
  typographyHeader:{
    paddingBottom: "12px", paddingTop: "5%"
  },
  typography:{
    marginLeft: "11.5%", paddingTop: "9.5%" 
  },
  select:{
    marginBottom: "4%", marginTop: "4%"
  },
  textArea:{
    width: "98%", padding: "1%",height:'90px', fontFamily: '"Source Sans Pro", "Arial", sans-serif', fontSize: "21px"
  },
  button1:
  {
    marginLeft: "16%", width: "84%", marginBottom: "4%", marginTop: "5%", backgroundColor:"#1C9AB7",
    color:"#FFFFFF", borderRadius: "20px 20px 20px 20px",height:'46px'
  },
  button2:{
    width: "84%", marginBottom: "4%",marginLeft:'11%', marginTop: "5%", backgroundColor:"#1C9AB7",
    color:"#FFFFFF", borderRadius: "20px 20px 20px 20px",height:'46px' 
  },
  
paper: {
    marginLeft: "23.4%", width: "50%", marginTop: "3%",marginBottom:"4%",padding:'2% 2% 2% 2%'

  
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


export default IntractiveTranslationStyles;

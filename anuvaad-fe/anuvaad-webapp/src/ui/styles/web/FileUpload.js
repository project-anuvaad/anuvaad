

const FileUploadStyles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    margin: {
      margin: theme.spacing.unit,
      width: '100%'
    },
    withoutLabel: {
      marginTop: theme.spacing(3)
    },
    div:{
      display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center'
    },
    typographyHeader:{
      paddingTop:'1%',
      minWidth: "5%",
     
      
  
    },
    typographySubHeader:{
    textAlign:'center',
      fontWeight:'450',
      color:'#000000'
    },
  
    typography: {
      marginLeft:"2%",
      marginTop:'1.7%',
      marginBottom:'2%',
      height:"18px"
      
    },
    select:{
      // marginRight: "30%",
      width:"100%" ,
      height:'40px',
      
    },
   paper: {
      width: "60%",
      minWidth: "200px",
      marginTop: "2%",
      marginBottom:'4%',
      padding: "3% 3% 3% 3%",
      // marginLeft: "15%",
      
      minHeight:'400px'
    },
    grid:{
      marginLeft: "5.5%" 
    },
    textfield:{
      width: '87.9%',
      marginLeft:"2.3%"
    },
    span:{
      color:'red'
    },
    button
    : {
      marginTop: "6%",
      marginLeft: "2%",
      width: "100%",
      backgroundColor:'#1C9AB7',
      borderRadius:"20px 20px 20px 20px",
      color:"#FFFFFF"
    },
    button1: {
      marginTop: "9%",
     
      width: "90.5%",
      backgroundColor:'#1C9AB7',
      borderRadius:"20px 20px 20px 20px",
      color:"#FFFFFF"
    },
    button2: {
      marginTop: "9%",
      marginLeft: "7%",
      width: "91.4%",
      backgroundColor:'#1C9AB7',
      borderRadius:"20px 20px 20px 20px",
      color:"#FFFFFF"
    },
    dropZoneArea:{
      paddingTop: '13%',
      top: "auto",
      width:'91%',
      minHeight:'340px',
      height: "100%",
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
  
  
  export default FileUploadStyles;
  
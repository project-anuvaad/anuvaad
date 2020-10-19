

const PdfTranslateStyles = theme => ({
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
    div:{
      width: '55%', marginLeft: "20%", marginTop: '5%', marginBottom: '9%',
       padding: "2.5% 2.5% 3% 2.5%", minWidth: "200px",
    },
    typographyHeader:{
      marginTop: '6%',
          minWidth: "5%",
          textAlign: "center",
          fontfamily: '"Source Sans Pro", sans-serif',
          color: '#003366'
    },
    
    dropZoneArea:{
      paddingTop: '80px',
      
      height: "370px",
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
        
      },
  
  
    }
    
   
    
  });
  
  
  export default PdfTranslateStyles;
  
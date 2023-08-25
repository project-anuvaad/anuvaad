// @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap');




const LoginStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
    width: '100%'
  },
  withoutLabel: {
    marginTop: theme.spacing(3) 
  },
  textField: {
    flexBasis: 200
  },
  loginContainer: {
    minWidth: '15%',
    maxWidth: '25%',
    height: 'auto',
    position: 'absolute',
    top: '20%',
    left: '32%',
  },
  signUpContainer: {
    minWidth: '15%',
    maxWidth: '25%',

    height: 'auto',

    marginTop: '2%',
    marginLeft: '32%',


  },
  paper: {
    width: '30%',
    // minWidth: '260px',
    paddingLeft: '20%',
    paddingRight: '20%',
    paddingTop: '3%',
    paddingBottom: '3%',
    overflow: 'auto',
    marginLeft: '0%',
    // maxHeight:'400px'

  },
  paperSign: {
    width: '100%',
    paddingLeft: '20%',
    paddingRight: '20%',
    paddingTop: '3%',
    paddingBottom: '3%',
    overflow: 'auto',
    marginLeft: '0%',
    marginTop: '30%'
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
    fontSize: 13
  },
  btnFacebook: {
    background: '#4f81e9'
  },
  btnGoogle: {
    background: '#e14441'
  },
  btnSpan: {
    marginLeft: 5
  },
  //for signup page
  signUpPaper: {
    // backgroundColor: '#f1f5f7',

  },

  signInPaper: {
    // backgroundColor: '#f1f5f7',
  },
  
  typographyHeader: {
    marginTop: '10%',
    marginBottom: '5%',
    fontSize: '33px',
    color: '#003366',
    fontWeight: '549',
    fontfamily: '"Source Sans Pro", sans-serif',
  },
  textArea: {
    width: '50%',
    marginBottom: '2%',
    backgroundColor: 'white'
  },
  hrTag: {
    height: '2px',
    borderwidth: '0',
    width: '70%',
    backgroundColor: ' #D8D8D8',
    color: '#D8D8D8',
    border: '0',
    // marginTop: '2%'
  },
  formControl: {
    marginLeft: '25%'
  },
  typography1: {
    marginLeft: '27%',
    marginBottom: '4%',
    fontfamily: '"Source Sans Pro", sans-serif',
  },
  typographyFooter: {
    marginTop: '3%',
    fontSize: "100%",
    // marginBottom: "5%",
    fontfamily: '"Source Sans Pro", sans-serif',
  },
  typographyForgotPwd: {
    marginLeft: '25.5%',
    marginBottom: '4%',
    fontfamily: '"Source Sans Pro", sans-serif',
  },
  buttonProgress: {
    color: 'green[500]',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  appInfo: {
    background: "rgba(44, 39, 153, 1)",
    minHeight: "100vh",
    color:"white",
    "@media (max-width:650px)": {
      background: "white",
      minHeight: "15vh",
    },
  },
  title: {
    width: "20%",
    height: "auto",
    margin: "22% 294px 10% 39px",
    cursor:"pointer",
    lineHeight: "1.53",
    letterSpacing: "3.9px",
    textAlign: "left",
    "@media (max-width:650px)": {
      margin: "0% 0% 00% 90%",
      color: "black",
    },
    fontSize: "2.5rem",    
  },
  body: {
    width: "80%",
    height: "auto",
    margin: "30px 0px 50px 39px",
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    color: "#f2f2f4",
    "@media (max-width:1040px)": {
      letterSpacing: "1px",
      maxWidth: "280px",
    },
    "@media (min-width:1790px)": {
      width: "85%",
    },
    fontSize: "1.25rem",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 400,
  },
  parent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  forgotPassLink: {
    color: "rgb(44, 39, 153)",
    textDecoration: "underline rgba(44, 39, 153, 0.4)",
    cursor: "pointer",
    fontFamily: "Roboto, san-serif",
    fontSize: "14px",
  },
  loginBtn: {
    borderRadius: "20px",
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(44, 39, 153)",
    textTransform: "none",
    fontFamily: "Roboto, san-serif",
    "&:hover": {
      backgroundColor: 'rgb(39, 30, 79);'
    },
  },
  headingStyle: {
    marginBottom: "15px",
    fontSize: "1.6875rem",
    fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
    fontWeight: 300,
    letterSpacing: 0,
    lineHeight: "1.167",
  },
  VerifyOtpButton:{
    alignSelf: "center",
    width: "50%",
    borderRadius:"15px"
  },
  ResendOtpButton:{
    alignSelf: "center",
    padding: "10px 0px 0px 0px",
    fontFamily: "Roboto, san-serif",
  },
 
});

export default LoginStyles;

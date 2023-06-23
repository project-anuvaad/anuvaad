import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import OTPInput from "otp-input-react";
import {
  Button,
  IconButton,
  ThemeProvider,
  Typography,
  withStyles,
  Grid,
} from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import CloseIcon from "@material-ui/icons/Close";
import LoginStyles from "../../../styles/web/LoginStyles";
import ResendOtpimg from "../../../../assets/Resend.png";
import VerifyMFA from "../../../../flux/actions/apis/user/MFA_verify";
import Snackbar from "../../../components/web/common/Snackbar";
import CircularProgressWithLabel from "../../../components/web/common/CircularLoader";
import LoginAPI from "../../../../flux/actions/apis/user/login";
import history from "../../../../web.history";
import profileDetails from "../../../../flux/actions/apis/user/profile_details";




// const EnterOTPModal = (props) => {
//   const { classes } = props;
//   const [OTP, setOTP] = useState("");
//   const {
//     open,
//     handleClose,
//     onResend,
//     onSubmit,
//     OTPModalTitle,
//     hideResendOTPButton,
//     showTimer,
//     // loading,
//   } = { ...props };

//   const [time, setTime] = useState(120);
//   const [running, setRunning] = useState(true);
//   useEffect(() => {
//     let interval;
//     if (showTimer && running) {
//       interval = setInterval(() => {
//         setTime((prevTime) => {
//           if (prevTime > 0) {
//             return prevTime - 1;
//           } else if (prevTime === 0) {
//             clearInterval(interval);
//             setTimeout(() => setTime(120), 60000);
//             setRunning(false);
//             return prevTime;
//           }
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [showTimer, running]);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       handleClose();
//     }, 10 * 60 * 1000);
//     return () => clearTimeout(timerId);
//   }, []);

//   return (
//     <ThemeProvider theme={themeAnuvaad}>
//       <Dialog
//         open={open}
//         // onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//         fullWidth
//         style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
//       >
//         <DialogContent
//           style={{
//             display: "flex",
//             justifyContent: "end",
//             padding: "5px 0px 0px 0px",
//           }}
//         >
//           {" "}
//           <Button
//             onClick={() => {
//               handleClose();
//               setOTP("");
//             }}
//           >
//             <CloseIcon />
//           </Button>
//         </DialogContent>

//         <DialogTitle
//           id="alert-dialog-title"
//           align="center"
//           style={{ paddingTop: "0px" }}
//         >
//           {OTPModalTitle}
//         </DialogTitle>
//         <DialogContent
//           style={{
//             alignSelf: "center",
//             margin: !time == 0 ? "28px 50px 28px 50px" : "28px 50px 28px 50px",
//             display: "flex",
//           }}
//         >
//           <OTPInput
//             value={OTP}
//             onChange={setOTP}
//             autoFocus
//             OTPLength={6}
//             otpType="number"
//           />
//         </DialogContent>
//         <DialogContent className={classes.ResendOtpButton}>
//           Resend Verification Code ?
//           {!time == 0 && showTimer ? (
//             <span style={{ paddingLeft: "8px" }}>
//               {`${Math.floor(time / 60)}`.padStart(2, 0)}:
//               {`${time % 60}`.padStart(2, 0)}
//             </span>
//           ) : (
//             <Button
//               style={{
//                 alignSelf: "center",
//                 fontFamily: "Roboto, san-serif",
//               }}
//               disabled={!time == 0 && showTimer}
//               color="primary"
//               onClick={() => {
//                 onResend();
//                 setOTP("");
//                 setTime(120);
//                 setRunning(true);
//               }}
//             >
//               Resend OTP
//             </Button>
//           )}
//         </DialogContent>

//         <DialogActions
//           style={{
//             margin: "25px 0px 5px 0px",
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <Button
//             onClick={() => onSubmit(OTP)}
//             color="primary"
//             variant="contained"
//             disabled={!OTP}
//             className={classes.VerifyOtpButton}
//           >
//             VERIFY OTP{" "}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </ThemeProvider>
//   );
// };

// export default withStyles(LoginStyles)(EnterOTPModal);

function EnterOTPModal() {
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [resendWithUseHOTP, setResendWithUseHOTP] = useState(false);
  const [ResData, setResData] = useState(JSON.parse(localStorage.getItem("resData")));
//   const ResData = JSON.parse(localStorage.getItem("resData"));
  const Email = localStorage.getItem("email");
  const Password = localStorage.getItem("password");
  const [time, setTime] = useState(120);
  const [running, setRunning] = useState(true);
  const [resendOtpButtonClicked, setResendOtpButtonClicked] = useState(false);
  useEffect(() => {
    let interval;
    if (ResData && running) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else if (prevTime === 0) {
            clearInterval(interval);
            setTimeout(() => setTime(120), 60000);
            setRunning(false);
            return prevTime;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ResData, running]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleClose();
    }, 10 * 60 * 1000);
    return () => clearTimeout(timerId);
  }, []);

  const onSubmitOTP = (otp, callback) => {
    setError(false);
    setLoading(true);
    // call mfa register API here
    const apiObj = new VerifyMFA(
      ResData?.data?.email?.registered_email,
      ResData?.data.session_id,
      OTP,
      resendWithUseHOTP && resendOtpButtonClicked
    );

    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody()),
    })
      .then(async (response) => {
        const rsp_data = await response.json();
        console.log(rsp_data, "rsp_datarsp_data1");
        if (!rsp_data.ok) {
          setError(true);
          setLoading(false);
          setErrMessage(rsp_data.message);
          console.log(rsp_data, "rsp_datarsp_data2");
        } else {
          //   this.setState({ error: false, loading: false, verifySuccessMessage: true });
          setError(false);
          setLoading(false);
          localStorage.setItem("token", rsp_data.data.token);
          fetchUserProfileDetails(rsp_data.data.token);
        }
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
        setErrMessage("Unable to Verify OTP!");
      });
  };

  const processLoginButtonPressed = (reSendOTPClicked ) => {

    // const { email, password ,ResendWithUseHOTP} = this.state;
    setError(false);
    setLoading(true);
    setResendOtpButtonClicked(reSendOTPClicked)
    const apiObj = new LoginAPI(Email, Password, reSendOTPClicked );
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        const rsp_data = await response.json();
      
        if (!response.ok) {
          return Promise.reject(rsp_data.message);
        } else {
          let resData = rsp_data && rsp_data.data;
          setResData(rsp_data)
        //   localStorage.setItem("resData",JSON.stringify(rsp_data));  
        //   history.push(`${process.env.PUBLIC_URL}/user/resend-otp`)
        //   this.setState({showTimer : true})
        //   setTimeout(() => {
        //     this.setState({showTimer : false})
        //   }, 120*1000);
         
          if (resData.session_id) {
            if (resData.mfa_required && resData.mfa_registration) {
            //   this.setState({ 
                
            //     ResendWithUseHOTP: reSendOTPClicked && resData.mfa_type === "TOTP" ? true : false
            //   });
              setResendWithUseHOTP(resData.mfa_type === "TOTP" ? true : false)
            }
          } else if (resData.token){
              localStorage.setItem("token", resData.token);
              fetchUserProfileDetails(resData.token);  
              
          }
          setError(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        // this.setState({ error: true, loading: false, errMessage: error });
        setError(true);
        setLoading(false);
        setErrMessage(error);
      });
  };


  const handleRoles = (value) => {
    let result = [];
    value.roles.map((element) => {
      result.push(element.roleCode);
    });
    return result;
  };

  const fetchUserProfileDetails = (token) => {
    const apiObj = new profileDetails(token);
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        const rsp_data = await response.json();
        if (!response.ok) {
          return Promise.reject("");
        } else {
          let resData = rsp_data && rsp_data.data;
          var roles = handleRoles(resData);
          localStorage.setItem("roles", roles);
          localStorage.setItem("lang", "en");
          localStorage.setItem("userProfile", JSON.stringify(resData));
          if (roles.includes("SUPERADMIN")) {
            history.replace(`${process.env.PUBLIC_URL}/user-details`);
          } else if (roles.includes("ADMIN")) {
            history.replace(`${process.env.PUBLIC_URL}/user-details`);
          } else if (roles.includes("REVIEWER")) {
            history.replace(`${process.env.PUBLIC_URL}/review-documents`);
          } else if (roles.includes("TRANSLATOR")) {
            history.replace(`${process.env.PUBLIC_URL}/intro`);
          } else {
            history.replace(`${process.env.PUBLIC_URL}/intro`);
          }
        }
      })
      .catch((error) => {
        console.log("api failed because of server or network");
      });
  };



  const handleClose = () => {
    // this.setState({ showMFAMethodSelectionModal: false });
    setTimeout(() => {
      setError(false);
    }, 4000);
  };

  return (
    <ThemeProvider theme={themeAnuvaad}>
      {loading && <CircularProgressWithLabel value={100} />}
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src={ResendOtpimg}
          alt="log"
          style={{
            width: "10%",
          }}
        />
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography align="center" variant="h3">
            {" "}
            OTP Verification
          </Typography>
          <Typography
            align="center"
            variant="subtitle1"
            style={{
              fontFamily: "Roboto, san-serif",
              fontSize: "16px",
              margin: "10px 0px 40px 0px",
            }}
          >
            {ResData?.data?.mfa_message}
          </Typography>
        </Grid>

        <OTPInput
          value={OTP}
          onChange={setOTP}
          autoFocus
          OTPLength={6}
          otpType="number"
        />
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography
            align="center"
            variant="subtitle1"
            style={{
              fontFamily: "Roboto, san-serif",
              fontSize: "16px",
              margin: "30px 0px 30px 0px",
            }}
          >
            {" "}
            Session expires in - 
            <span style={{ paddingLeft: "8px" }}>
              {`${Math.floor(time / 60)}`.padStart(2, 0)}:
              {`${time % 60}`.padStart(2, 0)}
            </span>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Button
            style={{
              width: "300px",
              borderRadius: "15px",
              padding: "6px",
            }}
            color="primary"
            variant="contained"
            onClick={() => {
              processLoginButtonPressed(true);
              setOTP("");
              setTime(120);
              setRunning(true);
            }}
          >
            Resend OTP
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={() => onSubmitOTP()}
            color="primary"
            variant="contained"
            disabled={!OTP}
            // className={classes.VerifyOtpButton}
            style={{
              width: "300px",
              borderRadius: "15px",
              padding: "6px",
            }}
          >
            VERIFY OTP{" "}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={error}
          autoHideDuration={4000}
          onClose={handleClose}
          variant="error"
          message={errMessage}
        />
      )}
    </ThemeProvider>
  );
}
export default EnterOTPModal;

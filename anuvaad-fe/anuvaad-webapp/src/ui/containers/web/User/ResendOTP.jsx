import React, { useEffect, useState } from "react";
import OTPInput from "otp-input-react";
import {
  Button,
  ThemeProvider,
  Typography,
  withStyles,
  Grid,
} from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import LoginStyles from "../../../styles/web/LoginStyles";
import ResendOtpimg from "../../../../assets/Resend.png";
import VerifyMFA from "../../../../flux/actions/apis/user/MFA_verify";
import Snackbar from "../../../components/web/common/Snackbar";
import CircularProgressWithLabel from "../../../components/web/common/CircularLoader";
import LoginAPI from "../../../../flux/actions/apis/user/login";
import history from "../../../../web.history";
import profileDetails from "../../../../flux/actions/apis/user/profile_details";


function ReSendOTP(props) {
  const { classes } = props;
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [resendWithUseHOTP, setResendWithUseHOTP] = useState(false);
  const [time, setTime] = useState(120);
  const [running, setRunning] = useState(true);
  const [resendOtpButtonClicked, setResendOtpButtonClicked] = useState(false);
  const [resData, setResData] = useState(
    JSON.parse(localStorage.getItem("resData"))
  );
  const [showtimer, setShowtimer] = useState(false);
  const Email = localStorage.getItem("email");
  const Password = localStorage.getItem("password");

  useEffect(() => {
    if (resData) {
      setShowtimer(true);
    }
    setTimeout(() => {
      setShowtimer(false);
    }, 120 * 1000);
  }, [resData]);

  useEffect(() => {
    setResendWithUseHOTP(resData.data.mfa_type === "TOTP" ? true : false);
    let interval;
    if (showtimer && running) {
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
  }, [showtimer, running, resData]);

// useEffect(() => {
//   let interval;
//   if (running) {
//     interval = setInterval(() => {
//       setTime((prevTime) => {
//         if (prevTime > 0) {
//           return prevTime - 1;
//         } else if (prevTime === 0) {
//           clearInterval(interval);
//           setTimeout(() => setTime(120), 60000);
//           setRunning(false);
//           return prevTime;
//         }
//       });
//     }, 1000);
//   }
//   return () => clearInterval(interval);
// }, [showTimer, running]);

  const onSubmitOTP = (otp, callback) => {
    setError(false);
    setLoading(true);
    // call mfa register API here
    const apiObj = new VerifyMFA(
      resData?.data?.email?.registered_email,
      resData?.data.session_id,
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

  const processLoginButtonPressed = (reSendOTPClicked = false) => {
    // const { email, password ,ResendWithUseHOTP} = this.state;
    setError(false);
    setLoading(true);
    setResendOtpButtonClicked(reSendOTPClicked);
    const apiObj = new LoginAPI(
      Email,
      Password,
      reSendOTPClicked && resendWithUseHOTP
    );
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
          setResData(rsp_data);
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
            }
          } else if (resData.token) {
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
        className={classes.imageStyle}
      >
        <img
          src={ResendOtpimg}
          alt="log"
          style={{
            width: "12%",
          }}
        />
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid>
          {" "}
          <Typography align="center" variant="h3">
            {" "}
            OTP Verification
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
            padding: 15,
            columnGap: 30
          }}
        >
          <Typography
            align="center"
            variant="subtitle1"
            className={classes.OTPTitle}
          >
            {resData?.data?.mfa_message}
          </Typography>
        </Grid>

        <OTPInput
          value={OTP}
          onChange={setOTP}
          autoFocus
          OTPLength={6}
          otpType="number"
        />

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
            marginTop: "40px",
          }}
        >
          <Button
            onClick={() => onSubmitOTP()}
            color="primary"
            variant="contained"
            disabled={!OTP}
            className={classes.VerifyOtpButton}
          >
            VERIFY OTP{" "}
          </Button>
        </Grid>
        {/* <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ marginTop: "40px" }}
        >
          {!showtimer == 0 && running ? (
            <Typography
              align="center"
              variant="subtitle1"
              style={{
                fontFamily: "Roboto, san-serif",
                fontSize: "16px",
                margin: "40x 0px 40px 0px",
              }}
            >
              {" "}
              Session expires in -
              <span style={{ paddingLeft: "8px" }}>
                {`${Math.floor(time / 60)}`.padStart(2, 0)}:
                {`${time % 60}`.padStart(2, 0)}
              </span>
            </Typography>
          ) : (
            <Typography
              variant="subtitle1"
              align="center"
              style={{
                fontFamily: "Roboto, san-serif",
                fontSize: "16px",
                margin: "40x 0px 40px 0px",
              }}
            >
              Session has expired. Please re-login
            </Typography>
          )}
        </Grid> */}
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
            marginTop: "20px",
          }}
        >
          <Typography
            variant="subtitle1"
            style={{ fontSize: "16px", marginTop: "5px" }}
          >
            Didn't Receive OTP ?
          </Typography>
          {!showtimer == 0 && running ? (
            <div
              style={{
                fontFamily: "Roboto, san-serif",
                fontSize: "16px",
               marginTop:"4px"
              }}
            >
              {" "}
             
              <span style={{ paddingLeft: "10px" ,}}>
                {`${Math.floor(time / 60)}`.padStart(2, 0)}:
                {`${time % 60}`.padStart(2, 0)}
              </span>
            </div>
          ):

          <Button
            color="primary"
            variant="text"
            onClick={() => {
              processLoginButtonPressed(true);
              setOTP("");
              setTime(120);
              setRunning(true);
            }}
          >
            Resend OTP
          </Button>}
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
export default withStyles(LoginStyles)(ReSendOTP);

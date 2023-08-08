import React, { useEffect, useRef, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import OTPInput from "otp-input-react";
import {
  Button,
  IconButton,
  TextField,
  ThemeProvider,
  Typography,
  withStyles,
} from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import CloseIcon from "@material-ui/icons/Close";
import LoginStyles from "../../../styles/web/LoginStyles";

const EnterOTPModal = (props) => {
  const { classes } = props;
  // const [OTP, setOTP] = useState("");
  const {
    open,
    handleClose,
    onResend,
    onSubmit,
    OTPModalTitle,
    hideResendOTPButton,
    showTimer,
    ResendButtonTitle
    // loading,
  } = { ...props };

  const [OTP1, setOTP1] = useState("");
  const [OTP2, setOTP2] = useState("");
  const [OTP3, setOTP3] = useState("");
  const [OTP4, setOTP4] = useState("");
  const [OTP5, setOTP5] = useState("");
  const [OTP6, setOTP6] = useState("");

  const digit1 = useRef(null);
  const digit2 = useRef(null);
  const digit3 = useRef(null);
  const digit4 = useRef(null);
  const digit5 = useRef(null);
  const digit6 = useRef(null);

  const [OTP, setOTP] = useState("");

  const [time, setTime] = useState(120);
  const [running, setRunning] = useState(true);

  const OTPTextFieldData = [
    {
      name: "OTP1",
      inputRef: digit1,
      type: "tel",
      style: { textAlignLast: "center" },
      inputProps: { maxLength: 1 },
      value: OTP1,
      onChange: (e) => handleOTPChange(e, setOTP1, 1, digit2, null)
    },
    {
      name: "OTP2",
      inputRef: digit2,
      type: "tel",
      style: { textAlignLast: "center" },
      inputProps: { maxLength: 1 },
      value: OTP2,
      onChange: (e) => handleOTPChange(e, setOTP2, 2, digit3, digit1)
    },
    {
      name: "OTP3",
      inputRef: digit3,
      type: "tel",
      style: { textAlignLast: "center" },
      inputProps: { maxLength: 1 },
      value: OTP3,
      onChange: (e) => handleOTPChange(e, setOTP3, 3, digit4, digit2)
    },
    {
      name: "OTP4",
      inputRef: digit4,
      type: "tel",
      style: { textAlignLast: "center" },
      inputProps: { maxLength: 1 },
      value: OTP4,
      onChange: (e) => handleOTPChange(e, setOTP4, 4, digit5, digit3)
    },
    {
      name: "OTP5",
      inputRef: digit5,
      type: "tel",
      style: { textAlignLast: "center" },
      inputProps: { maxLength: 1 },
      value: OTP5,
      onChange: (e) => handleOTPChange(e, setOTP5, 5, digit6, digit4)
    },
    {
      name: "OTP6",
      inputRef: digit6,
      type: "tel",
      style: { textAlignLast: "center" },
      inputProps: { maxLength: 1 },
      value: OTP6,
      onChange: (e) => handleOTPChange(e, setOTP6, 6, null, digit5)
    }
  ]

useEffect(() => {
  let interval;
  if (showTimer && running) {
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
}, [showTimer, running]);

useEffect(() => {
  setOTP(`${OTP1}${OTP2}${OTP3}${OTP4}${OTP5}${OTP6}`);
}, [OTP1, OTP2, OTP3, OTP4, OTP5, OTP6])

useEffect(() => {

  const timerId = setTimeout(() => {
    handleClose();
  }, 10 * 60 * 1000);

  return () => {
    clearTimeout(timerId);
  };



}, []);

const onOTPSubmit = (e) => {
  e.preventDefault();
  onSubmit(OTP);
}

const handleOTPChange = (e, setter, index, nextRef, prevRef) => {
  setter(e.target.value);
  if (e.target.value.toString().length > 0 && index < 6 && nextRef?.current) {
    nextRef.current.focus();
  } else if (e.target.value.toString().length <= 0 && index > 1 && prevRef?.current) {
    prevRef.current.focus();
  }
}

return (
  <ThemeProvider theme={themeAnuvaad}>
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
    >
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "5px 0px 0px 0px",
        }}
      >
        {" "}
        <Button
          onClick={() => {
            handleClose();
            setOTP("");
          }}
        >
          <CloseIcon />
        </Button>
      </DialogContent>

      <DialogTitle
        id="alert-dialog-title"
        align="center"
        style={{ paddingTop: "0px" }}
      >
        {OTPModalTitle}
      </DialogTitle>
      <form autoComplete="off" onSubmit={onOTPSubmit}>
        <div
          style={{
            alignSelf: "center",
            margin: !time == 0 ? "28px 50px 28px 50px" : "28px 50px 28px 50px",
            display: "flex",
            gridGap: 30
          }}
        >
          {OTPTextFieldData.map((el,i)=>{
            return <TextField name={el.name}
            autoFocus={i === 0}
            inputRef={el.inputRef}
            type={el.type}
            style={el.style}
            inputProps={el.inputProps}
            variant="outlined"
            value={el.value}
            onChange={el.onChange} />
          })}
        </div>
        <div
          style={{
            margin: "25px 0px 5px 0px",
            display: "flex",
            justifyContent: "center",
            padding: 20,
            columnGap: 30
          }}
        >
          <Button
            onClick={(e) => {
              onResend(e);
              setOTP("");
              setTime(120);
              setRunning(true);
            }}
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            disabled={!time == 0 && showTimer}
            className={classes.VerifyOtpButton}
          >
            {ResendButtonTitle}{" "}{!time == 0 && showTimer && <span style={{ paddingLeft: "8px" }}>
              {`${Math.floor(time / 60)}`.padStart(2, 0)}:
              {`${time % 60}`.padStart(2, 0)}
            </span>}
          </Button>
          <Button
            // onClick={() => onSubmit(OTP)}
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            disabled={!OTP || OTP.length < 6}
            className={classes.VerifyOtpButton}
          >
            VERIFY OTP{" "}
          </Button>
        </div>
      </form>

    </Dialog>
  </ThemeProvider>
);
};

export default withStyles(LoginStyles)(EnterOTPModal);

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
} from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";

const EnterOTPModal = (props) => {
  const [OTP, setOTP] = useState("");
  //   const [time, setTime] = useState(60);
  //   const[isActive,setIsActive] = useState(false)
  const {
    open,
    handleClose,
    onResend,
    onSubmit,
    OTPModalTitle,
    hideResendOTPButton,
    time,
    handleResendOtp,
    setTime,
    showTimer,
  } = { ...props };

  useEffect(() => {
    setTimeout(function () {
      handleClose();
    }, 600000);
  }, [open]);


  return (
    <ThemeProvider theme={themeAnuvaad}>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
      >
        <DialogTitle id="alert-dialog-title" align="center">
          {OTPModalTitle}
        </DialogTitle>

        {!time == 0 && showTimer == true && (
          <DialogTitle style={{ alignSelf: "center", fontSize: "18px" }}>
            {" "}
            Time left: {`${Math.floor(time / 60)}`.padStart(2, 0)}:
            {`${time % 60}`.padStart(2, 0)}
          </DialogTitle>
        )}

        <DialogContent
          style={{
            alignSelf: "center",
            margin: !time == 0 ? "15px 70px 70px 70px" : 70,
            display: "flex",
          }}
        >
          <OTPInput
            value={OTP}
            onChange={setOTP}
            autoFocus
            OTPLength={6}
            otpType="number"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              setOTP("");
            }}
            color="primary"
            variant="outlined"
            style={{ borderRadius: 15 }}
          >
            Cancel
          </Button>
          {!hideResendOTPButton && (
            <Button
              onClick={() => {
                onResend();
                setOTP("");
                setTime(60);
                handleResendOtp();
              }}
              color="primary"
              variant="contained"
              style={{ borderRadius: 15 }}
              disabled={!time == 0}
            >
              Resend OTP
            </Button>
          )}
          <Button
            onClick={() => onSubmit(OTP)}
            color="primary"
            variant="contained"
            disabled={!OTP}
            style={{ borderRadius: 15 }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default EnterOTPModal;

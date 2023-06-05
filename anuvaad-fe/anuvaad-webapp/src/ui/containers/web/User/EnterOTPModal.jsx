import React, { useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import OTPInput from "otp-input-react";
import { Button, IconButton, ThemeProvider, Typography } from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const EnterOTPModal = (props) => {
    const [OTP, setOTP] = useState("");
    const [showOtp, setShowOTP] = useState(false);

    const {
        open,
        handleClose,
        onResend,
        onSubmit,
    } = { ...props };

    return (
        <ThemeProvider theme={themeAnuvaad}>
            <Dialog
                open={open}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                style={{backgroundColor: "rgba(255,255,255,0.6)"}}
            >
                <DialogTitle id="alert-dialog-title">{"Enter OTP sent to your E-mail Id"}</DialogTitle>
                <DialogContent style={{ alignSelf: "center", margin: 50, display: "flex" }}>
                    <OTPInput
                        value={OTP}
                        onChange={setOTP}
                        autoFocus
                        OTPLength={6}
                        otpType="number"
                        disabled={false}
                        secure={!showOtp}
                    />
                    <IconButton onClick={() => setShowOTP(!showOtp)} title={!showOtp ? "Show OTP" : "Hide OTP"}>
                        {showOtp ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="outlined" style={{ marginRight: "auto", borderRadius: 15 }}>
                        Cancel
                    </Button>
                    <Button onClick={onResend} color="primary" variant="contained" style={{ borderRadius: 15 }}>
                        Resend OTP
                    </Button>
                    <Button onClick={onSubmit} color="primary" variant="contained" style={{ borderRadius: 15 }}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>

    )
}

export default EnterOTPModal
import React, { useEffect, useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Divider, IconButton, ThemeProvider, Typography } from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";

const RegisterMFAModal = (props) => {

    const [selectedAuthMethod, setsSlectedAuthMethod] = useState("TOTP");

    const {
        open,
        handleClose,
        onRegisterMFAClick,
        registerSuccessMessage
    } = { ...props };

    useEffect(() => {
        if (registerSuccessMessage) {
            setTimeout(() => {
                handleClose()
            }, 4000)
        }
    }, [registerSuccessMessage])

    return (
        <ThemeProvider theme={themeAnuvaad}>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                style={{ backgroundColor: "rgba(255,255,255,0.6)", textAlign: "center" }}
            >

                {!registerSuccessMessage && <><DialogTitle id="alert-dialog-title">{"You have not enabled MFA "}</DialogTitle>
                    <Typography>To login securely, Please choose an authentication method</Typography>
                    <DialogContent style={{ overflow: "hidden", marginTop: 50, marginBottom: 50, columnCount: 2 }}>
                        <div>
                            <Button
                                style={{
                                    padding: 10,
                                    backgroundColor: selectedAuthMethod === "TOTP" ? "rgba(44, 39, 153, 0.04)" : "rgba(0, 0, 0, 0.04)",
                                    color: selectedAuthMethod === "TOTP" ? "#2C2799" : "#00000047",
                                    height: 100,
                                }}
                                title="A QR code with an app link will be emailed to you. Install the app on your mobile device and scan the QR code. The app will generate OTP for each login."
                                fullWidth
                                onClick={() => setsSlectedAuthMethod("TOTP")}>
                                <div>
                                    <Typography variant="h4">TOTP</Typography>
                                    
                                </div>
                            </Button>
                            <div 
                                onClick={() => setsSlectedAuthMethod("TOTP")}
                                style={{
                                        fontSize: "14px", 
                                        backgroundColor: selectedAuthMethod === "TOTP" ? "rgba(44, 39, 153, 0.04)" : "rgba(0, 0, 0, 0.04)", 
                                        color: selectedAuthMethod === "TOTP" ? "#2C2799" : "#00000047",
                                        height: "100px",
                                        cursor: "pointer",
                                        fontFamily: "Roboto"
                                    }}>
                                A QR code with an app link will be emailed to you. Install the app on your mobile device and scan the QR code. The app will generate OTP for each login.
                            </div>
                        </div>
                        <div>
                            <Button
                                style={{
                                    padding: 10,
                                    backgroundColor: selectedAuthMethod === "HOTP" ? "rgba(44, 39, 153, 0.04)" : "rgba(0, 0, 0, 0.04)",
                                    color: selectedAuthMethod === "HOTP" ? "#2C2799" : "#00000047",
                                    height: 100,
                                }}
                                title="An email will be sent to you with a unique OTP for each login."
                                fullWidth
                                onClick={() => setsSlectedAuthMethod("HOTP")}>
                                <div>
                                    <Typography variant="h4">HOTP</Typography>
                                    
                                </div>
                            </Button>
                            <div 
                                onClick={() => setsSlectedAuthMethod("HOTP")}
                                style={{
                                    fontSize: "14px", 
                                    backgroundColor: selectedAuthMethod === "HOTP" ? "rgba(44, 39, 153, 0.04)" : "rgba(0, 0, 0, 0.04)", 
                                    color: selectedAuthMethod === "HOTP" ? "#2C2799" : "#00000047",
                                    height: "100px",
                                    cursor: "pointer",
                                    fontFamily: "Roboto"
                                }}>
                                An email will be sent to you with a unique OTP for each login.
                            </div>
                        </div>

                    </DialogContent></>}
                <DialogActions>
                    {registerSuccessMessage ?
                        <div style={{ margin: "auto", }}>
                            <Typography variant="subtitle1">Successfully registered for MFA, Please login again to continue!</Typography>
                            <Button onClick={handleClose} color="primary" variant="contained" style={{ borderRadius: 10, marginTop: 35 }}>
                                Login
                            </Button>
                        </div>
                        : <div>
                            <Button onClick={handleClose} color="primary" variant="outlined" style={{ borderRadius: 10, marginRight: 10 }}>
                                Cancel
                            </Button>
                            <Button onClick={() => onRegisterMFAClick(selectedAuthMethod)} color="primary" variant="contained" style={{ borderRadius: 10 }}>
                                Proceed
                            </Button>
                        </div>}
                </DialogActions>
                <Divider style={{margin: 10}} />
                <Typography variant="caption" style={{textAlign: "start"}}>Note: <b>The selection between TOTP and HOTP can be changed later on under My Profile section by clicking "Reset MFA Method" button.</b></Typography>
            </Dialog>
        </ThemeProvider>
    )
}

export default RegisterMFAModal
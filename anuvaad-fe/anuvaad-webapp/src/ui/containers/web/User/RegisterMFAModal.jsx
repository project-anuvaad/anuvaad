import React, { useEffect, useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Avatar, Button, Divider, IconButton, ThemeProvider, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import CheckIcon from '@material-ui/icons/Check';
import emailIconLight from "../../../../assets/Email_Icon_light.png"
import emailIconDark from "../../../../assets/Email_Icon_dark.png"
import QRIconLight from "../../../../assets/QR_Icon_light.png"
import QRIconDark from "../../../../assets/QR_Icon_dark.png"

const useStyles = makeStyles({
    label: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        textAlign: "center",
        alignSelf: "baseline",
        alignItems: "inherit",
        fontFamily: `"Roboto", "Segoe UI"`,
        letterSpacing: "0.5px",
        textTransform: "none",
        justifyContent: "center",
        height: "auto",
    },
});

const RegisterMFAModal = (props) => {

    const classes = useStyles();

    const [selectedAuthMethod, setsSlectedAuthMethod] = useState("TOTP");

    const OTPButtonData = [
        {
            title: "TOTP",
            description: "A QR code with an app link will be emailed to you. Install the app on your mobile device and scan the QR code. The app will generate OTP for each login.",
            onclick: () => setsSlectedAuthMethod("TOTP"),
            selected: selectedAuthMethod === "TOTP" ? true : false,
            otpIcon: selectedAuthMethod === "TOTP" ? QRIconLight : QRIconDark,
        },
        {
            title: "HOTP",
            description: "An email will be sent to you with a unique OTP for each login.",
            onclick: () => setsSlectedAuthMethod("HOTP"),
            selected: selectedAuthMethod === "HOTP" ? true : false,
            otpIcon: selectedAuthMethod === "HOTP" ? emailIconLight : emailIconDark,
        }
    ]

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

    const OTPSelectionButton = (props) => {
        const { buttonTitle, buttonDescription, selected, onSelectionClick, otpIcon, buttonStyle } = { ...props };
        return (
            <Button
                classes={{ label: classes.label }}
                variant="contained"
                color={selected ? "primary" : "secondary"}
                onClick={onSelectionClick}
                style={buttonStyle}
            >
                {selected &&
                    <Avatar
                        style={{ 
                            position: "absolute" ,
                            top: 5,
                            left: "80%",
                            // padding: 0,
                            // borderRadius: 5
                            backgroundColor: "green"
                        }}
                    >
                        <CheckIcon />
                    </Avatar>}
                <div>
                    <img src={otpIcon} />
                </div>
                <div><Typography variant="h5">{buttonTitle}</Typography></div>
                <Typography variant="caption">{buttonDescription}</Typography>
            </Button>
        )
    }

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
                    <DialogContent
                        style={{
                            overflow: "hidden",
                            marginTop: 15,
                            marginBottom: 15,
                            // columnCount: 2 
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                        {OTPButtonData.map((el) => {
                            return (
                                <OTPSelectionButton
                                    buttonTitle={el.title}
                                    buttonDescription={el.description}
                                    selected={el.selected}
                                    onSelectionClick={el.onclick}
                                    buttonStyle={{ width: "45%", borderRadius: 15 }}
                                    otpIcon={el.otpIcon}
                                />
                            )
                        })}

                    </DialogContent></>}
                <DialogActions style={{paddingLeft: 24, paddingRight: 24}}>
                    {registerSuccessMessage ?
                        <div style={{ margin: "auto", }}>
                            <Typography variant="subtitle1">Successfully registered for MFA, Please login again to continue!</Typography>
                            {/* <Button onClick={handleClose} color="primary" variant="contained" style={{ borderRadius: 10, marginTop: 35 }}>
                                Login
                            </Button> */}
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
                <Divider style={{ margin: 5 }} />
                <Typography variant="caption" style={{ textAlign: "start", padding: 10 }}>Note: <b>The selection between TOTP and HOTP can be changed later on under My Profile section by clicking "Reset MFA Method" button.</b></Typography>
            </Dialog>
        </ThemeProvider>
    )
}

export default RegisterMFAModal
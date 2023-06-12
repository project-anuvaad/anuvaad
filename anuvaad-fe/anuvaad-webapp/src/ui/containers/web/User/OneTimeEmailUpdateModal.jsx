import React, { useEffect, useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Divider, IconButton, TextField, ThemeProvider, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import themeAnuvaad from "../../../theme/web/theme-anuvaad";

const useStyles = makeStyles({
    label: {
        display: "inline",
        width: "100%",
        textAlign: "center",
        alignItems: "inherit",
        fontFamily: `"Roboto", "Segoe UI"`,
        letterSpacing: "0.5px",
        textTransform: "none",
        justifyContent: "center"
    },
});

const OneTimeEmailUpdateModal = (props) => {

    const classes = useStyles();

    const [emailToUpdate, setEmailToUpdate] = useState("");

    const {
        open,
        onUpdateEmailId,
        currentEmail,
        oneTimeUpdateEmailIdSuccessMessage
    } = { ...props };

    const updateEmailIdClick = (event) => {
        event.preventDefault();
        onUpdateEmailId(emailToUpdate);
        return false
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

                {oneTimeUpdateEmailIdSuccessMessage ?
                    <DialogContent style={{ overflow: "hidden", marginTop: 50, marginBottom: 50, display: "flex", justifyContent: "space-around", alignItems: "center", color: "green" }}>
                        <Typography variant="subtitle2">Email Id Updated!</Typography>
                    </DialogContent>
                    : <>
                        <DialogTitle id="alert-dialog-title">{"Update your email ID"}</DialogTitle>
                        <Typography>For Accessing this portal, you will need to go through MFA (multi factore authentication) which requires a valid email Id. Please update or confirm your email Id - </Typography>
                        <DialogContent style={{ overflow: "hidden", marginTop: 50, marginBottom: 50, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            <form onSubmit={updateEmailIdClick}>
                                <TextField
                                    value={emailToUpdate}
                                    onChange={(e) => setEmailToUpdate(e.target.value)}
                                    label={"email"}
                                    variant="outlined"
                                    type="email"
                                    fullWidth
                                />

                                <Button variant="contained" type="submit" disabled={!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailToUpdate)} color="primary" fullWidth style={{ marginTop: 20, borderRadius: 10 }}>Update</Button>
                            </form>
                            <Typography style={{ width: 70 }}>OR</Typography>
                            <div>
                                {/* <Typography variant="subtitle2">{currentEmail}</Typography> */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ height: 120, borderRadius: 10, display: "block" }}
                                    onClick={() => onUpdateEmailId(currentEmail)}
                                    classes={{label: classes.label}}
                                >
                                    <div>
                                        <Typography variant="subtitle1">Continue with : </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="subtitle1"><b>{currentEmail}</b></Typography>
                                    </div>

                                </Button>
                            </div>
                        </DialogContent>
                    </>}
            </Dialog>
        </ThemeProvider>
    )
}

export default OneTimeEmailUpdateModal
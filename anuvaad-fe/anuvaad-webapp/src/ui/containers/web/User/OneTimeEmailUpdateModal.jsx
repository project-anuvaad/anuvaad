import React, { useEffect, useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Divider, IconButton, TextField, ThemeProvider, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import themeAnuvaad from "../../../theme/web/theme-anuvaad";
import EmailIcon from '@material-ui/icons/Email';

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
                        <DialogContent style={{ overflow: "hidden", marginTop: 20, marginBottom: 50, textAlign: "-webkit-center" }}>
                            <form onSubmit={updateEmailIdClick}>
                                <TextField
                                    value={emailToUpdate}
                                    onChange={(e) => setEmailToUpdate(e.target.value)}
                                    label={"email"}
                                    variant="outlined"
                                    type="email"
                                    fullWidth
                                />

                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailToUpdate)}
                                    color="primary"
                                    fullWidth
                                    style={{ marginTop: 20, borderRadius: 10, paddingTop: 15, paddingBottom: 15 }}
                                >Update</Button>
                            </form>
                            <fieldset style={{
                                textAlign: "center",
                                borderBottom: "none",
                                borderLeft: "none",
                                borderRight: "none",
                                marginTop: 20
                            }}
                            >
                                <legend
                                    style={{ fontFamily: "Roboto" }}
                                >OR</legend>
                            </fieldset>
                            {/* <Divider style={{marginTop: 30}} />
                            <Typography style={{ width: 70, marginBottom: 30 }}>OR</Typography> */}
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EmailIcon />}
                                    fullWidth
                                    style={{borderRadius: 10, fontWeight: "100", paddingTop: 15, paddingBottom: 15}}
                                >
                                    Continue with <b>&nbsp;{currentEmail}</b>
                                </Button>
                            </div>
                        </DialogContent>
                    </>}
            </Dialog>
        </ThemeProvider>
    )
}

export default OneTimeEmailUpdateModal
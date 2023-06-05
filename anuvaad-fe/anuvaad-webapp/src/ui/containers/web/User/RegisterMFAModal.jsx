import React, { useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, IconButton, ThemeProvider, Typography } from "@material-ui/core";
import themeAnuvaad from "../../../theme/web/theme-anuvaad";

const RegisterMFAModal = (props) => {

    const [selectedAuthMethod, setsSlectedAuthMethod] = useState("totp");

    const {
        open,
        handleClose,
        onSubmit,
    } = { ...props };

    return (
        <ThemeProvider theme={themeAnuvaad}>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                style={{ backgroundColor: "rgba(255,255,255,0.6)", textAlign: "center" }}
            >
                <DialogTitle id="alert-dialog-title">{"You have not enabled MFA "}</DialogTitle>
                <Typography>To login securely, Please choose an authentication method</Typography>
                <DialogContent style={{ overflow: "hidden", marginTop: 50, marginBottom: 50, display: "flex", justifyContent: "space-around" }}>
                    <Button
                        style={{
                            padding: 50, 
                            backgroundColor: selectedAuthMethod === "totp" ? "rgba(44, 39, 153, 0.04)" : "rgba(0, 0, 0, 0.04)", 
                            color: selectedAuthMethod === "totp" ? "#2C2799" : "#00000047"
                        }}
                        onClick={() => setsSlectedAuthMethod("totp")}>
                        <div style={{ padding: 30}}>
                            <Typography variant="h4">TOTP</Typography>
                        </div>
                    </Button>
                    <Button
                        style={{
                            padding: 50, 
                            backgroundColor: selectedAuthMethod === "hotp" ? "rgba(44, 39, 153, 0.04)" : "rgba(0, 0, 0, 0.04)", 
                            color: selectedAuthMethod === "hotp" ? "#2C2799" : "#00000047"
                        }}
                        onClick={() => setsSlectedAuthMethod("hotp")}>
                        <div style={{ padding: 30}}>
                            <Typography variant="h4">HOTP</Typography>
                        </div>
                    </Button>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button onClick={handleClose} color="primary" variant="outlined" style={{ borderRadius: 10, marginRight: 10 }}>
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} color="primary" variant="contained" style={{ borderRadius: 10 }}>
                            Proceed
                        </Button>
                    </div>
                    
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}

export default RegisterMFAModal
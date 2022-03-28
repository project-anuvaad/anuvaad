import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { translate } from "../../../../assets/localisation";
import Typography from "@material-ui/core/Typography";

export default class SimpleDialog extends React.Component {


    render() {
        var { value, message, handleSubmit, handleClose, open, title, status } = this.props
        return (
            <div>

                <Dialog
                    // inputProps={{
                    //     name: 'max-width',
                    //     id: 'max-width',
                    //   }}
                    open={open}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    style={this.props.type ? { width: "100%" } : {}}
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {title}
                    </DialogTitle>
                    <DialogContent style={{minWidth: "500px"}}>
                        {this.props.type && this.props.type !== "warning"?
                            <div>
                                <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold" }}>Job ID: </Typography><Typography>&nbsp; {message.jobID}</Typography></div>
                                <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold" }}>Status: </Typography><Typography>&nbsp; {message.status}</Typography></div>
                                {message.errorMessage && <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold" }}>Error: </Typography><Typography>&nbsp; {message.errorMessage}</Typography></div>}
                                 {message.timelines && Array.isArray(message.timelines) && message.timelines.length > 0 &&
                                    <div>
                                        <div>&nbsp;</div>
                                        <Typography style={{ fontWeight: "bold", fontSize: "18px" }}>Completed Tasks:</Typography>
                                        {
                                            message.timelines.map((task, i) => {
                                                return (
                                                    <div key={i}>
                                                        <div>&nbsp;</div>
                                                        <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold" }}>State: </Typography><Typography>&nbsp; {task.module}</Typography></div>
                                                        <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold" }}>Status: </Typography><Typography>&nbsp; {task.status}</Typography></div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>}
                            </div>
                            : <DialogContentText id="alert-dialog-slide-description">
                                {message}
                            </DialogContentText>}
                    </DialogContent>
                    {
                        this.props.type ? <DialogActions>
                            <Button onClick={(event) => { this.props.handleClose() }} color="primary">{translate("common.page.label.ok")}</Button>
                        </DialogActions> : <DialogActions>
                                <Button onClick={(event) => { handleClose() }} color="primary">{translate("common.page.label.no")}</Button>
                                <Button onClick={(event) => { handleSubmit(value, status) }} color="primary">{translate("common.page.label.yes")}</Button>
                            </DialogActions>
                    }

                </Dialog>

            </div>
        );
    }
}
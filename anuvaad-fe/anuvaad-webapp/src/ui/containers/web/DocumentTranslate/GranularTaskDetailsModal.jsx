import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { translate } from "../../../../assets/localisation";
import Typography from "@material-ui/core/Typography";
import { IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export default class GranularTaskDetailsModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textCopy: false
        }
    }

    msToTime = (ms) => {
        let seconds = (ms / 1000).toFixed(1);
        let minutes = (ms / (1000 * 60)).toFixed(1);
        let hours = (ms / (1000 * 60 * 60)).toFixed(1);
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        if (seconds < 60) return Math.ceil(seconds) + " Sec";
        else if (minutes < 60) return Math.ceil(minutes) + " Min";
        else if (hours < 24) return Math.ceil(hours) + " Hrs";
        else return Math.ceil(days) + " Days"
    }

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
                    {/* <DialogTitle id="alert-dialog-slide-title">
                        {title}
                    </DialogTitle> */}
                    <DialogContent style={{ minWidth: "500px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Job ID: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.jobID}</Typography></div>
                                <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>File Name: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.filename}</Typography></div>
                                <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Status: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.status}</Typography></div>
                                {message.errorMessage && <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Error: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.errorMessage}</Typography></div>}
                                {message.granularStatus && Array.isArray(message.granularStatus) && message.granularStatus.length > 0 &&
                                    <div>
                                        <div>&nbsp;</div>
                                        <Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Completed Tasks:</Typography>
                                        {
                                            message.granularStatus.map((task, i) => {
                                                return (
                                                    <div key={i}>
                                                        <div>&nbsp;</div>
                                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                                            <Typography style={{ fontWeight: "bold", fontSize: "15px" }}>State: </Typography>
                                                            <Typography style={{ fontSize: "15px" }}>&nbsp; {task.module}</Typography>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "row" }}>
                                                            <Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Status: </Typography>
                                                            <Typography style={{ fontSize: "15px" }}>&nbsp; {task.status}</Typography>
                                                        </div>
                                                        {task.endTime && task.status === "COMPLETED" &&
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Time Taken: </Typography>
                                                                <Typography style={{ fontSize: "15px" }}>&nbsp; {this.msToTime(task.endTime - task.startTime)}</Typography>
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>}
                            </div>
                            <div>
                                {this.state.textCopy ?
                                    <Typography variant='caption'>Copied to clipboard.</Typography> :
                                    <IconButton
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `Job ID: ${message.jobID} \n File Name: ${message.filename} \n User: ${JSON.parse(localStorage.getItem("userProfile"))?.userName}`
                                            );
                                            this.setState({ textCopy: true });
                                            setTimeout(() => {
                                                this.setState({ textCopy: false });
                                            }, 5000);
                                        }}
                                    >
                                        <FileCopyIcon color='primary' />
                                    </IconButton>}
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(event) => { this.props.handleClose() }} color="primary">OK</Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}
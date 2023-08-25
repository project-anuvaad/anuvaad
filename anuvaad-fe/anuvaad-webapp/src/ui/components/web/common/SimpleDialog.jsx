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

export default class SimpleDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textCopy: false
        }
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
                        {this.props.type && this.props.type !== "warning" ?
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Job ID: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.jobID}</Typography></div>
                                    <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>File Name: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.filename}</Typography></div>
                                    <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Status: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.status}</Typography></div>
                                    {message.errorMessage && <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Error: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {message.errorMessage}</Typography></div>}
                                    {message.timelines && Array.isArray(message.timelines) && message.timelines.length > 0 &&
                                        <div>
                                            <div>&nbsp;</div>
                                            <Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Completed Tasks:</Typography>
                                            {
                                                message.timelines.map((task, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <div>&nbsp;</div>
                                                            <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>State: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {task.module}</Typography></div>
                                                            <div style={{ display: "flex", flexDirection: "row" }}><Typography style={{ fontWeight: "bold", fontSize: "15px" }}>Status: </Typography><Typography style={{ fontSize: "15px" }}>&nbsp; {task.status}</Typography></div>
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
                                                let copyErrorMessage = message.errorMessage ? `Error: ${message.errorMessage}` : "";
                                                navigator.clipboard.writeText(
                                                    `Job ID: ${message.jobID} \n File Name: ${message.filename} \n User: ${JSON.parse(localStorage.getItem("userProfile"))?.userName} \n ${copyErrorMessage}`
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

                            : <DialogContentText id="alert-dialog-slide-description">
                                {message}
                            </DialogContentText>}
                    </DialogContent>
                    {
                        this.props.type ? <DialogActions>
                            <Button onClick={(event) => { this.props.handleClose() }} color="primary">OK</Button>
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
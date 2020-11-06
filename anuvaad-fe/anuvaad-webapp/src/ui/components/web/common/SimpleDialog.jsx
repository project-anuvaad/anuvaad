import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { translate } from "../../../../assets/localisation";
import Typography from '@material-ui/core/Typography';

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
                                <Typography style={{ fontWeight: "bold" }}>Job ID: {message.jobID}</Typography>
                                <Typography style={{ fontWeight: "bold" }}>Status: {message.status}</Typography>
                                 {message.timelines && Array.isArray(message.timelines) && message.timelines.length > 0 &&
                                    <div>
                                        <div>&nbsp;</div>
                                        <Typography style={{ fontWeight: "bold", fontSize: "18px" }}>Completed Tasks:</Typography>
                                        {
                                            message.timelines.map((task, i) => {
                                                return (
                                                    <div key={i}>
                                                        <div>&nbsp;</div>
                                                        <Typography>State: {task.module}</Typography>
                                                        <Typography>Status: {task.status}</Typography>
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
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default class AlertDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            textValue: '',
        }
    }

    handleTextChange(e) {
        if (e.target) {
            this.setState({
                textValue: e.target.value
            })
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.node !== this.props.node){
            this.setState({
                textValue : this.props.node.data
            })
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    // onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="standard-uncontrolled"
                >
                    <DialogTitle id="alert-dialog-title">{"Modify Text"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="standard-uncontrolled"
                            margin="normal"
                            multiline
                            style={{ width: 500 }}
                            value={this.state.textValue}
                            onChange={this.handleTextChange.bind(this)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" autoFocus onClick={() => {
                            this.props.handleClick(this.props.node, this.state.textValue)
                        }}>
                            Modify
                        </Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}
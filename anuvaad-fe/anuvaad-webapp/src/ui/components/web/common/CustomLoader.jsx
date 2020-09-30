import React from "react";
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Menu';
import Button from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class CustomLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { id, isOpen, topValue, leftValue, options, targetVal } = this.props;
        return (
            <Popover
                id={id}
                open={isOpen}
                anchorReference="anchorPosition"
                anchorPosition={{ top: topValue, left: leftValue }}

                onClose={() => this.props.handlePopOverClose()}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
            >
                <CircularProgress
                    disableShrink
                    size={18}
                    thickness={8}
                    style={{ marginLeft: "15px" }}
                />
            </Popover>
        )
    }
}
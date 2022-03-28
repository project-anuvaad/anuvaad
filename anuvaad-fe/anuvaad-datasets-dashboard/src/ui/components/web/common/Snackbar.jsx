import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: '#FF0000',
    },
    info: {
        backgroundColor: '#2196f3',
    },
    
    icon: {
        fontSize: 20,
    },

    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant,open, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
});


class CustomizedSnackbars extends React.Component {
    state = {
        open: true,
    };

    componentDidUpdate(prevProps) {
        if(this.props.open!== prevProps.open && this.props.open){
            this.setState({open:true})
        }
    }
    

    handleClick = () => {
        this.setState({ open: true });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });

    };

    render() {
        const { variant, message, autoHideDuration } = this.props;
        
        return (
            <div>
                <Snackbar
                    anchorOrigin= {this.props.anchorOrigin ? this.props.anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    variant = {variant}
                    open={this.state.open }
                    autoHideDuration={autoHideDuration ? autoHideDuration : null}
                    onClose={this.handleClose}
                    
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleClose}
                        variant={variant}
                        message={message}
                    />
                </Snackbar>
            </div>
        );
    }
}

CustomizedSnackbars.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(CustomizedSnackbars);
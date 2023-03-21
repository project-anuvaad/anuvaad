// UploadProcessModal

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CircularProgress, Dialog, Divider, StepContent } from '@material-ui/core';

const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    completed: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    line: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#784af4',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
});

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    completed: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    },
});

function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <SettingsIcon />,
        2: <GroupAddIcon />,
        3: <VideoLabelIcon />,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     */
    active: PropTypes.bool,
    /**
     * Mark the step as completed. Is passed to child components.
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return [
        {
            title: 'Machine Translation',
            status: "COMPLETE",
            time: "0.23 sec"
        },
        {
            title: 'Manual Editing',
            status: "COMPLETE",
            time: "10 min 15 sec"
        },
        {
            title: 'Parallel Docs Export',
            status: "PENDING",
        },
    ];
}

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return <div>
//           <Typography>Status</Typography>
//           <Typography>Started</Typography>
//           </div>;
//     case 1:
//       return <div>
//       <Typography>Status</Typography>
//       <Typography>In Progress</Typography>
//       </div>;
//     case 2:
//       return <div>
//       <Typography>Status</Typography>
//       <Typography>Completed</Typography>
//       <Typography>Time Taken - 00.23 sec</Typography>
//       </div>;
//     default:
//       return <div>
//       <Typography>Status</Typography>
//       <Typography>Started</Typography>
//       </div>;
//   }
// }

export default function UploadProcessModal() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(1);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={true}
            // onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <div className={classes.root}>
                <Typography style={{margin: 5}} variant="subtitle1">Job ID: <b>A_FTTTR-tMYSx-1679045562433</b> </Typography>

                <Divider />
                {/* <Typography style={{margin: 5}} variant="subtitle1">Task Status:</Typography> */}
                <Stepper activeStep={activeStep} orientation="vertical">                
                    {steps.map((label, index) => (
                        <Step key={label} active={label.status === "PENDING" ? false : true}>
                            <StepLabel>{label.title}</StepLabel>

                            <StepContent>
                                <Typography variant='body2'>{label.status}</Typography>
                                {label.status === "COMPLETE" && <Typography variant='caption'>{label.time}</Typography>}
                                {label.status === "INPROGRESS" && <CircularProgress />}
                            </StepContent>
                        </Step>
                    ))}
                    <div style={{width: "100%", textAlign: "end"}}>
                        <Button color='primary'>Ok</Button>
                </div>
                </Stepper>
                
            </div>
        </Dialog>

    );
}

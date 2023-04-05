// UploadProcessModal

import React, { useEffect, useState } from 'react';
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
import FileCopyIcon from '@material-ui/icons/FileCopy';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CircularProgress, Dialog, Divider, Grid, IconButton, StepContent } from '@material-ui/core';
import history from "../../../../web.history";

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

export default function UploadProcessModal(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(1);
    const [steps, setSteps] = useState([]);

    const { progressData, onCopyClick, onUploadOtherDoc, goToDashboardLink } = props;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const msToTime = (ms) => {
        let seconds = (ms / 1000).toFixed(1);
        let minutes = (ms / (1000 * 60)).toFixed(1);
        let hours = (ms / (1000 * 60 * 60)).toFixed(1);
        let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        if (seconds < 60) return seconds + " Sec";
        else if (minutes < 60) return minutes + " Min";
        else if (hours < 24) return hours + " Hrs";
        else return days + " Days"
    }

    useEffect(() => {

        // setSteps(progressData?.taskDetails);
        console.log("progressData --- ", progressData);
        if (progressData?.taskDetails) {
            let modifiedData = progressData?.taskDetails?.map((el, i) => {
                if ("taskEndTime" in el) {
                    el["endTimeProcess"] = parseInt(el["taskEndTime"]);
                } else {
                    el["endTimeProcess"] = parseInt(el["taskendTime"]);
                }

                el.startTimeProcess = parseInt(el.taskStarttime);
                return el;
            })
            setSteps(modifiedData);
        }
    }, [progressData])

    useEffect(() => {
        console.log("steps --- ", steps);
    }, [steps])

    return (
        <Dialog
            fullWidth={true}
            maxWidth={"md"}
            open={true}
            // onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <div className={classes.root}>
                <Grid
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    style={{ display: "flex" }}
                >
                    <Typography style={{ margin: 5 }} variant="subtitle1">Job ID : <b>{progressData?.jobID}</b> </Typography>
                    <IconButton
                        onClick={() => {
                            navigator.clipboard.writeText(progressData?.jobID);
                            onCopyClick();
                        }}
                    >
                        <FileCopyIcon color='primary' />
                    </IconButton>
                </Grid>


                <Divider />
                <Stepper activeStep={steps.length - 1} orientation="vertical">
                    {steps.length > 0 && steps?.map((process, index) => (
                        <Step key={process?.stepOrder} active={process?.status === "SUCCESS" ? true : false}>
                            <StepLabel>{process?.state}</StepLabel>

                            <StepContent>
                                <Typography variant='body2'>{process?.status}</Typography>
                                {process?.status === "SUCCESS" && <Typography variant='caption'>Time Taken - {msToTime(process?.endTimeProcess - process?.startTimeProcess)}</Typography>}
                            </StepContent>
                        </Step>
                    ))}
                    {progressData.status === "INPROGRESS" && <CircularProgress />}
                    <div style={{ width: "100%", textAlign: "end", alignItems: "center" }}>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={() => window.open(goToDashboardLink)}
                        >Go to dashboard</Button>
                        <Button
                            color='primary'
                            variant='contained'
                            style={{ marginLeft: 5 }}
                            onClick={() => onUploadOtherDoc()}
                        >Upload another document</Button>
                    </div>
                </Stepper>

            </div>
        </Dialog>

    );
}

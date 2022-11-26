import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default function CircularProgressWithLabel(props) {
    return (
        <div style={{
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            opacity: 0.7
        }} >
            <CircularProgress variant="determinate" {...props} style={{
                position: 'relative',
                top: '40%',
                left: '50%',
                color: '#2C2799'
                // color: "blue"
            }} />
            <div
                style={{
                    position: 'relative',
                    top: '40%',
                    left: '50%',
                                    }}
            >
                <Typography variant="caption" style={{color: '#2C2799'}} component="div" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </div>
        </div>
    );
}

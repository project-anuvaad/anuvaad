import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextValidator } from 'react-material-ui-form-validator';

import purple from '@material-ui/core/colors/purple';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    cssLabel: {
        '&$cssFocused': {
            color: purple[500],
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: purple[500],
        },
    },
    bootstrapRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    bootstrapInput: {
        // marginBottom: '1em',
        font: 'inherit',
        color: 'currentColor',
        width: '100%',
        border: '0',
        margin: '0',
        padding: '6px 0 7px',
        display: 'block',
        minWidth: '0',
        boxSizing: 'content-box',
        background: 'none',
        '-webkit-tap-highlight-color': 'transparent'
    },
    bootstrapFormLabel: {
        fontSize: 18,
    },
});


class TextFieldcom extends React.Component {

    render() {

        const { classes, placeholder, autoFocus, rows, defaultValue, name, label, id, changeHandler, type, value, isMultiline, validators, errorMessages } = this.props;

        return (
            <div style={{
                margin: 0,
                border: 0,
                display: 'inline-flex',
                padding: 0,
                position: 'relative',
                minWidth: 0,
                flexDirection: 'column',
                verticalAlign: 'top',
                width: '50%',
                marginBottom: '2%',
                backgroundColor: 'white',
                fontSize: '20px'
            }}>
                <TextValidator
                    placeholder={placeholder}
                    type={type}
                    label={label}
                    id={id}
                    value={value}
                    name={name}
                    rows={rows ? rows : 1}
                    multiline={isMultiline ? isMultiline : false}
                    fullWidth={true}
                    defaultValue={defaultValue}
                    InputProps={{
                        disableUnderline: true,
                        classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput,
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.bootstrapFormLabel,
                    }}
                    onChange={changeHandler}
                    style={styles.textfield}
                    autoFocus={autoFocus}
                    validators={validators}
                    errorMessages={errorMessages}
                />
            </div >
        );
    }
}

export default withStyles(styles)(TextFieldcom);
import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import JSONPretty from 'react-json-pretty';
import { AppBar, Button, Grid, Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const JSONViewerModal = (props) => {
    const formStyle = {
        position: 'absolute',
        width: "30vw",
        height: "40vh",
        top: "25vh",
        left: '35vw',
        outline: 0,
        backgroundColor: "white"
    }

    const divStyle = {
        overflow: 'auto',
        padding: '2%',
        height: '100%'
    }

    const btnStyle = {
        width: '99%'
    }
    return (
        <div>
            <FormControl style={formStyle} align='center' fullWidth>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            User Event JSON
                                </Typography>
                    </Toolbar>
                </AppBar>
                <div style={divStyle}>
                    <JSONPretty style={{ textAlign: "left" }} id="json-pretty" data={props.user_events}></JSONPretty>
                </div>
                <Grid container style={{ padding: '1%' }}>
                    <Grid item xs={6} sm={6} xl={6}>
                        <Button
                            style={btnStyle}
                            color="primary"
                            variant="contained"
                            onClick={props.copy}
                        >
                            Copy
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={6} xl={6}>
                        <Button
                            style={btnStyle}
                            color="primary"
                            variant="contained"
                            onClick={props.close}>
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </FormControl>
        </div >
    );
}


export default JSONViewerModal;
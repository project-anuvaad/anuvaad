import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import TextField from '../../../components/web/common/TextField';
import { translate } from "../../../../assets/localisation";
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'

class SaveEditedWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            word: props.text
        }
        
    }

    handleInputFieldChange = (e) => {
        this.setState({ word: e.target.value })
    }

    render() {
        return (
            <div>
                <FormControl 
                style={{
                    position: 'absolute',
                    width: "30%",
                    top: "25%",
                    left: '35%',
                    paddingTop: '3%',
                    paddingBottom: '1%',
                    outline: 0,
                    backgroundColor: "white"
                }} 
                align='center' 
                fullWidth
                >
                    <Typography style={{ margin: 'auto', fontSize: '20px', padding: "0px 5px", display: "absolute", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                        You are changing: <br></br> <Typography style={{ fontSize: '20px', fontWeight: "bold" }}>{this.props.text}</Typography>
                    </Typography>
                    <TextField id="email" type="text" value={this.state.word} placeholder="Word"
                        margin="dense" varient="outlined" style={{ width: '80%', marginBottom: '4%', backgroundColor: 'white' }}
                        // disabled="false"
                        onChange={this.handleInputFieldChange}
                    />

                    <div style={{ position: 'relative', }}>
                        <Button
                            variant="contained" aria-label="edit" style={{
                                width: '40%', marginRight: '2%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                backgroundColor: this.props.loading ? 'grey' : '#2C2799', color: 'white',
                            }} disabled={this.props.loading}
                            onClick={() => this.props.saveWord(this.state.word)}
                        >
                            {this.props.loading && <CircularProgress size={24} className={'success'} style={{
                                color: 'green[500]',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: -12,
                                marginLeft: -12,
                            }} />}
                            Save
                        </Button>

                        <Button
                            variant="contained" aria-label="edit" style={{
                                width: '40%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                backgroundColor: this.props.loading ? 'grey' : '#2C2799', color: 'white', color: 'white',
                            }}
                            onClick={this.props.handleClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </FormControl>
            </div>
        );
    }
}


export default SaveEditedWord;
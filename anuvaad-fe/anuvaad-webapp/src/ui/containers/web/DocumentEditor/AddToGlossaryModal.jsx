import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import TextField from '../../../components/web/common/TextField';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { IndicTransliterate } from 'react-transliterate';
import configs from '../../../../configs/configs';
import endpoints from '../../../../configs/apiendpoints';


class AddToGlossaryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            word: "",
        }

    }

    handleInputFieldChange = (e) => {
        this.setState({ word: e.target.value })
    }

    render() {
        console.log("this.props ----- ", this.props);
        return (
            <div>
                <FormControl style={{
                    position: 'absolute',
                    width: "30%",
                    // height: "22%",
                    top: "25%",
                    left: '35%',
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    outline: 0,
                    backgroundColor: "white"
                }} align='center' fullWidth
                >
                    <span style={{ margin: 'auto', fontSize: '20px', padding: "0px 5px", display: "inline-block", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "295px" }}>
                        You are adding into glossary: <br></br> <span style={{ fontSize: '20px', fontWeight: "bold" }}>{this.props.selectedWords}</span>
                    </span>
                    {this.props.enableTransliteration ?
                        <IndicTransliterate
                            customApiURL={`${configs.BASE_URL_AUTO + endpoints.transliteration}`}
                            transliterationModelId={this.props.transliterationModelId}
                            renderComponent={(props) => {
                                const inputRef = props.ref;
                                delete props["ref"];
                                return (
                                    <TextField
                                        {...props}
                                        // label="Add to glossary"
                                        placeholder="Add to glossary"
                                        type="text"
                                        fullWidth
                                        varient="outlined"
                                        inputRef={inputRef}
                                        style={{ width: '80%', marginBottom: '4%', backgroundColor: 'white' }}
                                    />
                                );
                            }}
                            value={this.state.word}
                            onChangeText={(text) => {
                                this.setState({ word: text })
                            }}
                            lang={this.props.lang}
                            maxOptions={5}
                        /> : <TextField id="email" type="text" value={this.state.word} placeholder="Add to glossary"
                            margin="dense" varient="outlined" style={{ width: '80%', marginBottom: '4%', backgroundColor: 'white' }}
                            // disabled="true"
                            onChange={this.handleInputFieldChange}
                        />}


                    <div style={{ position: 'relative', }}>
                        <Button
                            variant="contained" aria-label="edit" style={{
                                width: '40%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                backgroundColor: this.props.loading ? 'grey' : '#2C2799', color: 'white', color: 'white',
                            }}
                            onClick={this.props.handleClose}
                            disabled={this.props.loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained" aria-label="edit" style={{
                                width: '40%', marginRight: '2%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                backgroundColor: this.props.loading ? 'grey' : '#2C2799', color: 'white',
                            }} disabled={this.props.loading}
                            onClick={() => this.props.makeCreateGlossaryAPICall(this.state.word)}
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


                    </div>
                </FormControl>
            </div>
        );
    }
}


export default AddToGlossaryModal;
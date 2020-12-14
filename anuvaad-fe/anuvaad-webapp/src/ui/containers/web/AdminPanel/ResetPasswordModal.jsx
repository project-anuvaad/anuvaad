import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import TextField from '../../../components/web/common/TextField';
import { translate } from "../../../../assets/localisation";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class SimpleModal extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <FormControl style={{
                    position: 'absolute',
                    width: "30%",
                    height: "30%",
                    top: "25%",
                    left: '35%',
                    paddingTop: '5%',
                    border: '2px solid black',
                    backgroundColor: "white"
                }} align='center' fullWidth >
                    <TextField id="email" type="email-username" value={this.props.username} placeholder={translate('common.page.placeholder.emailUsername')}
                        margin="dense" varient="outlined" style={{ width: '80%', marginBottom: '4%', backgroundColor: 'white' }}
                        disabled="true" />
                    <TextField id="passowrd" type="password" placeholder="Enter Password*"
                        margin="dense" varient="outlined" style={{ width: '80%', marginBottom: '2%', backgroundColor: 'white' }}
                    />

                    <div>
                        <Button
                            variant="contained" aria-label="edit" style={{
                                width: '40%', marginRight: '2%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                backgroundColor: '#1ca9c9', color: 'white',
                            }} onClick={this.props.onClose}>
                            Cancel
                    </Button>

                        <Button
                            variant="contained" aria-label="edit" style={{
                                width: '40%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                backgroundColor: '#1ca9c9', color: 'white',
                            }} onClick={this.props.handleSubmit}>
                            Submit
                    </Button>
                    </div>
                </FormControl>
            </div>
        );
    }
}

export default SimpleModal;
import Paper from '@material-ui/core/Paper';
import React from "react";


class PaperClass extends React.Component {

    render() {
        const { value, style } = this.props;

        return (

            <div>
                <Paper style={style}>
                    {value}
                </Paper>
            </div>

        )
    }
}

;


export default PaperClass;
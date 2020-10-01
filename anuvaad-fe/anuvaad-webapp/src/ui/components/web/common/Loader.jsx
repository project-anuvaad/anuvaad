

import CircularProgress from '@material-ui/core/CircularProgress';
import React from "react";

class Loader extends React.Component {

    render() {
        const { color } = this.props;

        return (

            <div>
                <CircularProgress color={color} style={{ marginLeft: '40%', marginTop: '16%', width: '5%' }} />
            </div>

        )
    }
}

;


export default Loader;




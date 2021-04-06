import TextField from '@material-ui/core/TextField';
import React from "react";

class AppTextField extends React.Component {

    render() {
        const { id, varient, value, style, onChange, type, placeholder } = this.props;

        return (

            <div>
                <TextField id={id} value={value} variant={varient} placeholder={placeholder} style={style} onChange={onChange} type={type} />
            </div>

        )
    }
};

export default AppTextField;
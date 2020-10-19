import Button from '@material-ui/core/Button';
import React from "react";

class AppButton extends React.Component {

    render() {
        const { variant, value, color, onClick, style, dis } = this.props;
        return (

            <div>
                <Button variant={variant} onClick={onClick} color={color} style={style} disabled={dis}>
                    {value}
                </Button>
            </div>

        )
    }
}

;


export default AppButton;
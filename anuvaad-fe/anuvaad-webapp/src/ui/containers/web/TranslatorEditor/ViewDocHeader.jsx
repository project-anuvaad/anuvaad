import React from "react";
import history from "../../../../web.history";
import Button from "@material-ui/core/Fab";
import DownIcon from '@material-ui/icons/DoubleArrow';

class ViewDocHeader extends React.Component {
   
    handleOnClick() {
        history.push(`${process.env.PUBLIC_URL}/document-upload`);
    }

    render() {
        return (
            <div>
                <Button
                    onClick={event => {
                        this.handleOnClick();
                    }}
                    style={{ textTransform: "capitalize", width: "100%", minWidth: "150px", borderRadius: "30px", color: "white", backgroundColor: "#1C9AB7", height: "30px", fontSize: "18px"}}
                >
                   Start Translate
                   <DownIcon fontSize="small" />
                </Button>
            </div >
        );
    }
}


export default ViewDocHeader;

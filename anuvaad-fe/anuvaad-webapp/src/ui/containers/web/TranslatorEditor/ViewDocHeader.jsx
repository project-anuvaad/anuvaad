import React from "react";
import history from "../../../../web.history";
import Button from "@material-ui/core/Button";

class ViewDocHeader extends React.Component {

    handleOnClick() {
        history.push(`${process.env.PUBLIC_URL}/document-upload`);
    }

    render() {
        return (
            <div>
                <Button variant="contained"
                    color="primary"
                    style={{
                        borderRadius: "20px",
                        color: "#FFFFFF",
                        backgroundColor: "#1C9AB7",
                        height: "35px",
                        fontSize: "16px",
                    }}
                    size="large"
                    onClick={event => {
                        this.handleOnClick();
                    }}
                >
                    Start Translate
                </Button>
            </div >
        );
    }
}


export default ViewDocHeader;

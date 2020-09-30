import React from "react";
import Popover from '@material-ui/core/Popover';
import Button from "@material-ui/core/Button";
import { translate } from "../../../../assets/localisation";

export default class Popovers extends React.Component {
    constructor(props) {
        super(props);
        this.setState = {
            anchorEl: null
        }
    }

    render() {
        const { id, isOpen, topValue, leftValue } = this.props;
        return (
            <Popover
                id={id}
                open={isOpen}
                anchorReference="anchorPosition"
                anchorPosition={{ top: topValue, left: leftValue }}

                onClose={() => this.props.handlePopOverClose()}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
              <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleOnClick(this.props.sentence, "Delete Table", "Do you want to delete table")}>{translate("intractive_translate.page.preview.deleteTable")}</Button>

            </Popover>
        )
    }
}
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
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleOnClick(this.props.sentence, "add-row")}>{translate("intractive_translate.page.preview.insertNewRow")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleOnClick(this.props.sentence, "add-column")}>{translate("intractive_translate.page.preview.insertNewColumn")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleAddNewTable("next", this.props.sentence)}>{translate("intractive_translate.page.preview.addNewTableAbove")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleAddNewTable("previous", this.props.sentence)}>{translate("intractive_translate.page.preview.addNewTableBelow")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleAddNewSentence("next", this.props.sentence, "table")}>{translate("intractive_translate.page.preview.addNewSentenceAbove")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleAddNewSentence("previous", this.props.sentence, "table")}>{translate("intractive_translate.page.preview.addNewSentenceBelow")}</Button><br />
                <hr style={{ color: 'grey', opacity: '0.4' }} />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleOnClick(this.props.sentence, "delete-row")}>{translate("intractive_translate.page.preview.deleteRow")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleOnClick(this.props.sentence, "delete-column")}>{translate("intractive_translate.page.preview.deleteColumn")}</Button><br />
                <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleOnClick(this.props.sentence, "delete-table")}>{translate("intractive_translate.page.preview.deleteTable")}</Button>

            </Popover>
        )
    }
}
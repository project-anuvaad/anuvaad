import React from "react";
import Popover from '@material-ui/core/Menu';
import Button from '@material-ui/core/MenuItem';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { translate } from "../../../../assets/localisation";

class Popovers extends React.Component {
    constructor(props) {
        super(props);
        this.setState = {
            anchorEl: null,
        }
    }


    fetchOptions(dataArr) {
        if (dataArr && Array.isArray(dataArr) && dataArr.length > 0) {
            return (dataArr.map((option, i) => {
                if (option && option.length > 0 && option !== " ") {
                    return <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} onClick={() => this.props.handleSuggetionClick(option, i)}>{option}</Button>
                }
                return null;
            })
            )
        } else {
            return (<Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} disabled={true}>{translate("intractive_translate.page.message.endOfSuggestion")}</Button>)

        }
    }

    fetchLoader() {
        let message = this.props.targetVal ? translate("intractive_translate.page.message.loading") : translate("intractive_translate.page.message.enterOneWord")
        return (<Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} disabled={true}>{message}</Button>)
    }

    render() {
        const { id, isOpen, topValue, leftValue, targetVal } = this.props;
        let dataArr = []
        if (this.props.options && this.props.options.length > 0 && targetVal) {
            this.props.options.map((option, i) => {
                if (option && option.length > 0) {
                    let data = option.substring(targetVal ? targetVal.trim().length : 0)
                    if (data && data.length > 0 && data !== " ") {
                        let arr = data.split(" ", 4)
                        if (arr && arr.length > 0) {
                            dataArr.push(arr.join(" "))
                        }
                    }
                }
                return null;
            })
        }
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
                    keepMounted
                >
                    {
                        !this.props.apistatus.loading && targetVal ? this.fetchOptions(dataArr) : this.fetchLoader()
                    }
                </Popover>
            )

    }
}



const mapStateToProps = state => ({
    apistatus: state.apistatus,
});


export default withRouter(connect(mapStateToProps, null)(Popovers));
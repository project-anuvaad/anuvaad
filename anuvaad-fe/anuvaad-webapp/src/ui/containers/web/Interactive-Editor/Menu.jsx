import React from "react";
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Menu';
import Button from '@material-ui/core/MenuItem';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

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
            })
            )
        } else {
            return (<Typography>No Suggention available</Typography>)
        }
    }

    fetchLoader() {
        return (<Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} disabled={true}>Loading...</Button>)
    }

    render() {
        const { id, isOpen, topValue, leftValue, targetVal } = this.props;
        let dataArr = []
        if (this.props.options && this.props.options.length > 0) {
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
            })
        }
        if (!this.props.apistatus.loading) {
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
                        this.fetchOptions(dataArr)
                    }
                </Popover>
            )
        } else {
            return (<Popover
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
                    this.fetchLoader()
                }
            </Popover>)

        }

    }
}



const mapStateToProps = state => ({
    apistatus: state.apistatus,
});


export default withRouter(connect(mapStateToProps, null)(Popovers));
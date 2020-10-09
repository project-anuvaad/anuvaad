import React from 'react';
import Popover from 'react-text-selection-popover';
import Menu from '../../../containers/web/Interactive-Editor/Menu'
import Button from '@material-ui/core/MenuItem';
import TextareaAutosize from 'react-textarea-autosize';
import wfcodes from '../../../../configs/workflowcodes'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IntractiveApi from "../../../../flux/actions/apis/intractive_translate";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withRouter } from "react-router-dom";

var getCaretCoordinates = require('textarea-caret');

class AutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            showSuggestions: false,
            modified: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.value !== this.state.value) {
            let divdata = this.refs[this.props.refId].getBoundingClientRect()

            let x = divdata.x
            let y = divdata.y

            var elem = document.getElementById(this.props.aId)
            var coordinates = getCaretCoordinates(elem, elem.selectionEnd);

            let topValue = 0
            let leftValue = 0
            if (coordinates) {
                topValue = y + coordinates.top + 15
                leftValue = x + coordinates.left + 5

                this.setState({ topValue, leftValue })
            }
        }
        if (prevProps.value !== this.props.value && this.props.value !== this.state.value) {
            this.setState({
                value: this.props.value
            })
        }
        if (prevProps.tokenObject !== this.props.tokenObject) {
            this.setState({
                tokenObject: this.props.tokenObject
            })
        }
        if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
            this.setState({
                autoCompleteText: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tgt,
                autoCompleteTextTaggetTgt: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_tgt,
            });
        }
    }

    componentDidMount() {
        console.log(this.props.value)
        this.setState({
            value: this.props.value,
            tokenObject: this.props.tokenObject
        })
    }

    handleEnter = (event) => {
        if (event.key === 'Escape') {
            this.setState({ showSuggestions: false })
            // let saveData = (this.state.value !== this.props.value || this.state.modified) ? true : false

            // if (saveData) {
            //     this.props.handleChangeEvent({ target: { value: this.state.value } })
            // }
            // this.props.handleBlur(this.props.block_identifier_with_page, wfcodes.DP_WFLOW_S_C, saveData, this.props.value, this.state.value)
        } else if (event.key === 'Tab') {
            // } else if (((event.key === ' ' || event.key === 'Spacebar') && (this.state.previousKeyPressed === 'Control' || this.state.previousKeyPressed === "Command"))) {
            let divdata = this.refs[this.props.refId].getBoundingClientRect()
            let x = divdata.x
            let y = divdata.y

            var elem = document.getElementById(this.props.aId)
            let caretVal = this.state.value.substring(0, elem.selectionStart)

            var coordinates = getCaretCoordinates(elem, elem.selectionEnd);

            let topValue = 0
            let leftValue = 0
            if (coordinates) {
                topValue = y + coordinates.top + 15
                leftValue = x + coordinates.left + 5

                this.setState({ anchorEl: document.activeElement, topValue, leftValue, caretVal })
            }
            this.setState({ showSuggestions: true })
            // this.props.fetchSuggestions(this.props.sourceText, this.props.value)
            this.fetchSuggestions(this.props.sourceText, this.handleCalc(caretVal, this.state.tokenObject), this.state.tokenObject)

        }
        this.setState({
            previousKeyPressed: event.key,
            previousPressedKeyCode: event.keyCode
        })

    }

    fetchSuggestions(srcText, targetTxt, tokenObject) {
        let targetVal = targetTxt
        this.setState({ showSuggestions: true, autoCompleteText: null })
        const apiObj = new IntractiveApi(srcText, targetVal, { model_id: this.props.modelId }, true, true);
        this.props.APITransport(apiObj);
    }

    handleCalc(value, tokenText) {
        if (value.trim().length > 0) {
            const temp = value.split(" ");
            const tagged_tgt = tokenText.tagged_tgt.split(" ");
            const tagged_src = tokenText.tagged_src.split(" ");
            const tgt = tokenText.tgt && tokenText.tgt.split(" ");
            const src = tokenText.src && tokenText.src.split(" ");
            const resultArray = [];
            let index;
            temp.map(item => {
                if (item.length > 0) {
                    if (item !== " ") {
                        const ind = tgt.indexOf(item, resultArray.length);
                        const arr = [item, `${item},`, `${item}.`];
                        let src_ind = -1;
                        arr.map((el, i) => {
                            if (src_ind === -1) {
                                src_ind = src.indexOf(el);
                                index = i;
                            }
                            return true;
                        });
                        if (ind !== -1) {
                            resultArray.push(tagged_tgt[ind]);
                        } else if (src_ind !== -1) {
                            if (index > 0) {
                                if (src_ind > tagged_src.length - 1) {
                                    src_ind = tagged_src.length - 1
                                }
                                const tem = tagged_src[src_ind];
                                resultArray.push(tem.slice(0, tem.length - 1));
                            } else {
                                resultArray.push(tagged_src[src_ind]);
                            }
                        } else {
                            resultArray.push(item);
                        }
                    } else {
                        resultArray.push(item);
                    }
                }
                return true;
            });
            return resultArray.join(" ");
        } else {
            return ""
        }
    }

    handleSuggetionCLick(suggestion, index) {
        var tokenObj = this.props.tokenObject
        tokenObj.tagged_tgt = this.state.autoCompleteTextTaggetTgt[index]
        this.setState({ modified: true })
        var elem = document.getElementById(this.props.aId)
        let caretVal = this.state.value.substring(0, elem.selectionStart)
        caretVal = caretVal.trim()
        this.setState({ caretVal: caretVal + suggestion, value: caretVal + suggestion, tokenObject: tokenObj })
        this.handleSuggestion(suggestion, this.state.caretVal, this.props.sourceText, tokenObj)
    }

    handleSuggestion(suggestion, value, src, tokenObject) {
        this.setState({ showSuggestions: false })
        // this.props.handleSuggestion(suggestion, value)
        this.setState({ autoCompleteText: null, tokenObject })

        let targetVal = value.trim() + suggestion
        setTimeout(() => {
            this.setState({ showSuggestions: true })

        }, 50)

        const apiObj = new IntractiveApi(src, targetVal, { model_id: this.props.modelId }, true, true);
        this.props.APITransport(apiObj);
    }

    handleChangeEvent(event) {
        this.setState({
            value: event.target.value
        })

    }

    handleClickAway(id, value, wf_code) {
        let saveData = (this.state.value !== this.props.value || this.state.modified) ? true : false
        this.props.handleClickAway(id, value, wf_code, saveData, this.props.value)
    }

    getLoader() {
        return (<Popover
            // id={id}
            open={true}
            anchorReference="anchorPosition"
            anchorPosition={{ top: this.state.topValue, left: this.state.leftValue }}

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
            <Button style={{ textTransform: 'none', width: '100%', justifyContent: 'left' }} disabled={true}>Loading...</Button>
        </Popover>)
    }

    handleSuggestionClose() {
        this.setState({ showSuggestions : false })
    }

    render() {
        const { aId, refId, style, tokenIndex, sentence } = this.props

        return (
            // <ClickAwayListener id={tokenIndex} onClickAway={() => this.handleClickAway(tokenIndex, this.state.value, wfcodes.DP_WFLOW_S_C)}>
            <div key={aId}>
                <textarea
                    id={aId}
                    ref={refId}
                    // maxRows={4}
                    multiline={true}
                    // autoFocus={true}
                    placeholder="Type your translation here"
                    style={style}
                    value={this.state.value}
                    onChange={this.handleChangeEvent.bind(this)}
                    onKeyDown={this.handleEnter}
                >
                </textarea>
                {
                    this.state.showSuggestions &&
                    <Menu
                        isOpen={true}
                        topValue={this.state.topValue}
                        leftValue={this.state.leftValue}
                        handleSuggetionClick={this.handleSuggetionCLick.bind(this)}
                        handlePopOverClose={this.handleSuggestionClose.bind(this)}
                        targetVal={this.state.caretVal}
                        options={this.state.autoCompleteText}
                    ></Menu>}

            </div >
            // </ClickAwayListener>
        );
    }
}

const mapStateToProps = state => ({
    apistatus: state.apistatus,
    intractiveTrans: state.intractiveTrans
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            APITransport
        },
        dispatch
    );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AutoComplete));


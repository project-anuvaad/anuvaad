import React from "react";
import { Paper, Divider } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { Textfit } from "react-textfit";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import sentenceHighlight from '../../../../utils/SentenceHighlight'

import { highlightSentence, clearHighlighBlock, cancelMergeSentence } from '../../../../flux/actions/users/translator_actions';

import SENTENCE_ACTION from '../DocumentEditor/SentenceActions'

const PAGE_OPS = require("../../../../utils/page.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

const styles = {
    textField: {
        width: "100%",
        // background: "white",
        background: 'rgb(211,211,211)',
        borderRadius: 10,
        border: 0,
        color: 'green',
    }
}


class OcrPageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: ''
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.action = null
    }


    // shouldComponentUpdate(prevProps, nextState) {
    //     if (prevProps.page) {
    //         if (prevProps.sentence_highlight && (prevProps.page.page_no === prevProps.sentence_highlight.page_no)) {
    //             return true
    //         }
    //         if( prevProps.page.page_no === prevProps.block_page){
    //             return true
    //         }
    //         return false
    //     }
    //     return true;
    // }

    componentDidUpdate(prevProps) {
        if (prevProps.block_highlight !== this.props.block_highlight && this.props.block_highlight.block_identifier) {
            this.handleSourceScroll(this.props.block_highlight.block_identifier)
        }
    }

    /**
     * render Sentences
     */
    renderText = (text, region) => {
        return (
            <div style={{
                position: "absolute",
                zIndex: 2,
                width: text.boundingBox.vertices[1].x - text.boundingBox.vertices[0].x + 'px',
                height: text.boundingBox.vertices[2].y - text.boundingBox.vertices[0].y + 'px',
                top: text.boundingBox.vertices[0].y - region.boundingBox.vertices[0].y + 'px',
                left: text.boundingBox.vertices[0].x - region.boundingBox.vertices[0].x + 'px',
            }}
            >
                {
                    this.renderTextSpan(text)
                }
            </div>
        )
    }

    renderTextFit = (text, merged_block_id) => {
        return (
            sentenceHighlight(
                this.props.block_highlight,
                text,
                merged_block_id,
                this.renderTextSpan)
        )
    }
    /**
     * render Sentences span
     */
    renderTextSpan = (text, flag = false) => {
        return (
            <span
                style={{
                    zIndex: 1,
                    fontFamily: text.font !== undefined && text.font.family,
                    backgroundColor: flag ? 'orange' : '',
                    color: 'black',
                    fontSize: text.font !== undefined && text.font.size + 'px'
                }}
                id={text.block_id}
                onDoubleClick={() => { this.handleSelectedSentenceId(text) }}
            >
                {text.text}
            </span>
        )
    }


    /**
     * sentence change
     */
    handleTextChange(event) {
        this.action = 'user_typed'
        this.setState({ text: event.target.value });
    }

    /**
     * render sentence edit
     */
    renderTextField = (text) => {
        return (
            <TextField
                style={styles.textField}
                type="text"
                className="form-control"
                // defaultValue    =   {text.text}
                value={this.state.text}
                variant="outlined"
                id="mui-theme-provider-outlined-input"
                onChange={this.handleTextChange}
                onBlur={() => { this.handleClickAway(text) }}
                autoFocus={true}
                fullWidth
                multiline
            />
        )
    }


    /**
     * render sentence edit
     */
    handleSelectedSentenceId = (text) => {

        this.setState({ text: text.text })
        this.props.clearHighlighBlock()
        this.props.cancelMergeSentence()
        this.props.highlightSentence(text)
        this.action = "click"
    }
    /**
     * click away listner
     */
    handleClickAway = (blockData) => {
        if (this.state.text && (this.action === 'user_typed')) {
            TELEMETRY.sentenceChanged(blockData.text, this.state.text, blockData.block_id, "validation", '')
            let data = PAGE_OPS.get_updated_page_blocks(this.props.document_contents, blockData, this.state.text)
            this.props.onAction(SENTENCE_ACTION.SENTENCE_SOURCE_EDITED, blockData.page_no, [data], "")
        }
        this.setState({ text: null })
        this.action = null;
    }

    handleSourceScroll(id) {
        this.refs[id] && this.refs[id].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    renderChild = (line) => {
        let width = (line.boundingBox.vertices[1].x - line.boundingBox.vertices[0].x) + 'px'
        let height = (line.boundingBox.vertices[2].y - line.boundingBox.vertices[0].y) + 'px'
        let top = (line.boundingBox.vertices[0].y) + 'px'
        let left = (line.boundingBox.vertices[0].x) + 'px'
        return (
            <div style={{
                position: "absolute",
                height: height,
                width: width,
                top: top,
                left: left,
                zIndex: 2,
                // backgroundColor:'grey',
                // fontFamily: line.font.family,
                // fontSize: line.font.size + 'px',
                // fontStyle: line.font.style
            }}
                id={line.identifier}
                key={line.identifier}
            >

                {line['children'] &&
                    line['children'].map(child => this.renderText(child, line))

                }
            </div>
        );
    }

    renderImage = (image) => {
        let style = {
            position: "relative",
            // top: image.text_top + 'px',
            // left: image.text_left + 'px',
            // width: image.text_width + 'px',
            // height: image.text_height + 'px',
            overflow: "hidden",
            zIndex: 1
        }

        return (
            <div style={style}>

                <img src={image} alt=""></img>

            </div>
        )
    }

    renderPage = (page, image) => {
        console.log(image)
        if (page) {
            let width = page['vertices'] && page.vertices[1].x - page.vertices[0].x + 'px'
            let height = page['vertices'] && page.vertices[2].y - page.vertices[0].y + 'px'
            return (
                <div>
                    <Paper elevation={2} style={{ textAlign: 'center', position: 'relative', width: width, height: height }}>
                        {page['regions'].map(data => this.renderChild(data, page))}
                        {this.renderImage(image)}
                    </Paper>
                    <Divider />
                </div>
            )
        }
        return (
            <div></div>
        )
    }

    render() {
        return (
            <span style={{ zoom: `${40}%` }}>{this.renderPage(this.props.page, this.props.image)}</span>
        )
    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_highlight: state.block_highlight.block,
    block_page: state.block_highlight.page_no,
    sentence_highlight: state.sentence_highlight.sentence
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        highlightSentence,
        clearHighlighBlock,
        cancelMergeSentence
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(OcrPageCard);

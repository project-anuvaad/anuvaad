import React from "react";
import { Paper, Divider } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { Textfit } from "react-textfit";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import sentenceHighlight from '../../../../utils/SentenceHighlight'

import { highlightSentence, clearHighlighBlock, cancelMergeSentence } from '../../../../flux/actions/users/translator_actions';

import SENTENCE_ACTION from './SentenceActions'

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


class PageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: '',
            page_width: this.props.page.page_width
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
    renderText = (text, block) => {
        let style = {
            position: "absolute",
            top: ((text.block_id === (this.props.sentence_highlight && this.props.sentence_highlight.block_id) && this.action) ? text.text_top - block.text_top - 20 : text.text_top - block.text_top) + 'px',
            left: text.text_left - block.text_left + 'px',
            width: text.text_width + 'px',
            height: text.text_height + 'px',
            lineHeight: text.avg_line_height + 'px',
            // textAlignLast   : "justify",
            zIndex: (text.block_id === (this.props.sentence_highlight && this.props.sentence_highlight.block_id) && this.action) ? 100000 : 2
        };
        return (

            <div style={style} key={text.block_id} ref={text.block_identifier}>
                {((text.block_id == (this.props.sentence_highlight && this.props.sentence_highlight.block_id)) && this.action) ?
                    this.renderTextField(text)
                    :
                    this.renderTextFit(text, block.merged_block_id)
                }
            </div>
        )
    }

    renderTextFit = (text, merged_block_id) => {
        let data = text
        data.text = data.text.toString()
        return (
            sentenceHighlight(
                this.props.block_highlight,
                data,
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
                    fontFamily: text.font_family,
                    fontWeight: (text.font_family && text.font_family.includes("Bold") || text.attrib && text.attrib.toLowerCase().includes("bold")) && 'bold',
                    backgroundColor: flag ? 'orange' : ''
                }}
                id={text.block_id}
                onDoubleClick={() => {
                    if(this.props.enableSourceDocumentEditing){
                        this.handleSelectedSentenceId(text) 
                    } else {
                        return
                    }
                }}
            >
                {text.text.toString().replace(/\s{2,}/g, " ")}
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


    renderBlock = (block) => {
        return (
            <div style={{
                position: "absolute", top: block.text_top + 'px',
                left: (block.text_left > this.state.page_width || block.text_left < 0) ? 0 : block.text_left + 'px',
                width: block.text_width + 'px',
                height: block.text_height + 'px',
                margin: (block.text_left > this.state.page_width || block.text_left < 0) && 'auto',
                right: (block.text_left > this.state.page_width || block.text_left < 0) && 0,
                zIndex: (block.text_left > this.state.page_width || block.text_left < 0) ? 10000 : 2,
            }}
                id={block.block_identifier}
                key={block.block_identifier}
            >
                {block['texts'].map(text => this.renderText(text, block))}
            </div>
        )
    }

    renderImage = (image) => {
        let style = {
            position: "relative",
            top: image.text_top + 'px',
            left: image.text_left + 'px',
            width: image.text_width + 'px',
            height: image.text_height + 'px',
            overflow: "hidden",
            zIndex: 1
        }

        return (
            <div style={style} key={image.block_identifier}>

                <img width={image.text_width + "px"} height={image.text_height + "px"} src={`data:image/png;base64,${image.base64}`} alt=""></img>

            </div>
        )
    }

    renderPage = (page) => {
        if (page['blocks'] || (page['blocks'] && page['images'])) {
            return (
                <div>
                    <Paper elevation={2} style={{ position: 'relative', width: page.page_width + 'px', height: page.page_height + "px" }}>
                        {page['blocks'].map(block => this.renderBlock(block))}
                        {page['images'].map((images) => this.renderImage(images))}
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
            <span style={{ zoom: `${this.props.zoomPercent}%` }}>{this.renderPage(this.props.page)}</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(PageCard);

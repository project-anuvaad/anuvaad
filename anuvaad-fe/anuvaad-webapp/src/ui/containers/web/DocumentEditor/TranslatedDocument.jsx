import React from "react";
import { Paper, Divider } from "@material-ui/core";
import { Textfit } from "react-textfit";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { cancelMergeSentence } from '../../../../flux/actions/users/translator_actions';

const PAGE_OPS = require("../../../../utils/page.operations");

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


class TranslatedDocument extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: ''
        };
        this.action = null
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
                {this.renderTextFit(text, block.merged_block_id)}
            </div>
        )
    }

    renderTextFit = (text) => {
        // min={1}
        return (
            <Textfit mode="single" style={{ width: parseInt(text.text_width), color: text.font_color }} max={text.font_size ? parseInt(text.font_size) : 16}>
                {this.renderTextSpan(text)}
            </Textfit>
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
            >
                {text.tgt}
            </span>
        )
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
                position: "absolute",
                top: block.text_top + 'px',
                left: block.text_left + 'px',
                width: block.text_width + 'px',
                height: block.text_height + 'px',
                zIndex: 2,
                textAlign: "justify",
                // lineHeight: block.line_height + 'px',
                fontFamily: block.font_family,
                fontSize: block.font_size + "px",
                fontColor: block.font_color,
                fontWeight: (block.font_family && block.font_family.includes("Bold") || block.attrib && block.attrib.toLowerCase().includes("bold")) && 'bold',
            }}
                id={block.block_identifier}
                key={block.block_identifier}
            >
                {block['texts'].map((text, i) =>
                    <span key={i} style={{ lineHeight: block.line_height + 'px' }}>{i !== 0 && " "}<span key={text.s_id}>{text.tgt}</span></span>
                    // this.renderText(text, block)
                )}
            </div>
        )
    }

    renderBlock1 = (sentence, styles, not_tokenized) => {
        var styles = {
            position: "absolute",
            top: sentence.text_top - 7 + "px",
            left: sentence.text_left - 3 + "px",
            fontSize: sentence.font_size + "px",
            color: sentence.font_color,
            width: sentence.text_width + 5 + "px",
            height: sentence.text_height + 4 + "px",
            fontFamily: sentence.font_family,
            fontWeight: sentence.font_family && sentence.font_family.includes("Bold") && "bold",
            fontFamily: sentence.font_family,
            textAlign: "justify",
            zIndex: 1,
            display: "block",
            outline: "0px solid transparent",
            cursor: !this.state.isEditable && "pointer",
            padding: "5px",
            lineHeight: sentence.children ? parseInt(sentence.text_height / sentence.children.length) + "px" : "20px",
        };

        let childrens = sentence.children ? sentence.children.length : 1
        let words_count = 0
        let words_in_line = -1
        let current_line_words = 0
        let editable = false
        sentence.tokenized_sentences.map((text, tokenIndex) => {
            if (this.props.targetSelected === text.s_id + "_" + this.props.page_no) {
                editable = true
            }
        })


        if (sentence.tokenized_sentences) {
            sentence.tokenized_sentences.map((text) => {
                words_count += text && text.tgt ? text.tgt.split(" ").length : 0
            })
        }
        if (words_count > 0 && childrens > 1) {
            // words_in_line = Math.round(words_count / childrens) + 1
        }
        debugger
        return (
            sentence.tokenized_sentences && sentence.tokenized_sentences.length > 0 ?
                <div
                    id={sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType}
                    style={styles}


                    key={sentence.block_id}
                    // onBlur={event => this.props.handleBlur(event)}
                    // onInput={event => this.handleChangeEvent(event, sentence.block_id + "_" + this.props.page_no)}
                    onMouseLeave={() => {
                        !this.props.targetSelected && this.props.value !== true && this.props.handleOnMouseLeave();
                    }}
                    onMouseEnter={() => {
                        !this.props.targetSelected && this.props.value !== true && this.handleMouseHover(sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType, sentence.block_identifier, sentence.has_sibling, this.props.page_no);
                    }}
                    ref={textarea => {
                        this.textInput = textarea;
                    }}
                >
                    <Textfit
                        mode={sentence.children && sentence.children.length == 1 ? "single" : "multi"}
                        style={{ height: parseInt(sentence.text_height), width: parseInt(sentence.text_width) }}
                        min={1}
                        max={parseInt(sentence.font_size)}
                    >
                        <div style={words_in_line !== -1 && !editable ? {
                            textAlign: 'justify',
                            textAlignLast: 'justify',

                        } : { zIndex: 2 }}>
                            {sentence.hasOwnProperty("tokenized_sentences") &&
                                sentence.tokenized_sentences.map((text, tokenIndex) => {
                                    if (this.props.targetSelected === text.s_id + "_" + this.props.page_no) {
                                        return (
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    zIndex: 3
                                                }}
                                            >
                                                <span>
                                                    <span
                                                        ref={text.s_id + "_" + this.props.page_no}
                                                        style={{
                                                            outline: "none"
                                                        }}
                                                    >
                                                        {text.src}
                                                    </span>
                                                    <span> </span>
                                                </span>
                                            </div>
                                        );
                                    } else {
                                        if (text.tgt) {
                                            let words = text.tgt ? text.tgt.split(" ") : []
                                            if (words_in_line != -1) {
                                                let spans = []
                                                let words_length = words.length + current_line_words
                                                if (words_length >= words_in_line) {
                                                    var temparray, chunk = words_in_line;
                                                    var i = 0
                                                    var j = words_length;
                                                    while (i < j) {
                                                        if (current_line_words >= chunk) {
                                                            current_line_words = 0
                                                        }
                                                        if (i == 0)
                                                            temparray = words.slice(i, i - current_line_words + chunk);
                                                        else
                                                            temparray = words.slice(i, i + chunk);
                                                        spans.push(<span>
                                                            <span
                                                                ref={text.s_id + "_" + this.props.page_no}
                                                                contentEditableId={true}
                                                                style={{
                                                                    outline: "none",
                                                                    textAlign: 'justify',
                                                                    background: (!this.props.targetSelected && !not_tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
                                                                }}
                                                                onDoubleClick={event => {
                                                                    this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target", sentence.block_id + "_" + this.props.page_no, this.props.page_no);
                                                                }}
                                                            >
                                                                {temparray.join(" ")}
                                                            </span>
                                                            <span> </span>
                                                            {(temparray.length + current_line_words < chunk) ? '' : <br></br>}
                                                        </span>)

                                                        i == 0 ? i += chunk - current_line_words : i += chunk
                                                        if (current_line_words == chunk) {
                                                            current_line_words = 0
                                                        } else
                                                            current_line_words = temparray.length > 0 ? (temparray.length + current_line_words) : current_line_words
                                                    }
                                                } else {
                                                    spans.push(<span>
                                                        <span
                                                            ref={text.s_id + "_" + this.props.page_no}
                                                            contentEditableId={true}
                                                            style={{
                                                                outline: "none",
                                                                textAlign: 'justify',
                                                                background: (!this.props.targetSelected && !not_tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
                                                            }}
                                                            onDoubleClick={event => {
                                                                this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target", sentence.block_id + "_" + this.props.page_no, this.props.page_no);
                                                            }}
                                                        >
                                                            {words.join(" ")}
                                                        </span>
                                                        <span> </span>
                                                    </span>)
                                                    current_line_words = words.length
                                                }
                                                return spans
                                            } else {
                                                return (
                                                    <span>
                                                        <span>
                                                            <span
                                                                ref={text.s_id + "_" + this.props.page_no}
                                                                contentEditableId={true}
                                                                style={{
                                                                    outline: "none",
                                                                    // background: (!this.props.targetSelected && !not_tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
                                                                }}
                                                                onDoubleClick={event => {
                                                                    this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target", sentence.block_id + "_" + this.props.page_no, this.props.page_no);
                                                                }}
                                                            >
                                                                {words.join(" ")}
                                                            </span>
                                                            <span> </span>
                                                        </span>
                                                    </span>
                                                );
                                            }
                                        }
                                    }
                                })}
                        </div>
                    </Textfit>
                </div>
                :
                <div style={{ backgroundColor: 'red' }}></div>
        );
    };

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
        let pId = "divToPrint" + this.props.index
        if (page['blocks'] || (page['blocks'] && page['images'])) {
            return (
                <div >
                    <Paper id={pId} elevation={2} style={{ position: 'relative', width: page.page_width + 'px', height: page.page_height + "px" }}>
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

    componentDidUpdate(prevProps) {
        if (prevProps.download !== this.props.download && this.props.download) {
            if (this.props.index === (this.props.totalPageCount - 1)) {
                this.props.htmlToPDF()
            }
        }
    }

    render() {
        return (
            <span style={{ zoom: `${this.props.zoomPercent}%` }}>{this.renderPage(this.props.page)}</span>
        )
    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_page: state.block_highlight.page_no,
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        cancelMergeSentence
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(TranslatedDocument);

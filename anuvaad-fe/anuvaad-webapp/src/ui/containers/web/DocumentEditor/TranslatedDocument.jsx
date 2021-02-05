import React from "react";
import { Paper, Divider } from "@material-ui/core";
import { Textfit } from "react-textfit";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
                    <span key={i} style={{ lineHeight: block.line_height + 'px' }}>{i !== 0 && " "}
                    <p
                        style={{
                            textAlign: "justify",
                            lineHeight: block.line_height + 'px',
                            fontFamily: block.font_family,
                            fontSize: block.font_size + "px",
                            fontColor: block.font_color,
                            fontWeight: (block.font_family && block.font_family.includes("Bold") || block.attrib && block.attrib.toLowerCase().includes("bold")) && 'bold',
                        }}
                        key={text.s_id}>{text.tgt}</p></span>
                    // this.renderText(text, block)
                )}
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

    render() {
        let pId = "divToPrint" + this.props.index
        let page = this.props.page
        if (page['blocks'] || (page['blocks'] && page['images'])) {
            return (
                <div >
                    <div id={pId} elevation={2} style={{ position: 'relative', width: page.page_width + 'px', height: page.page_height + "px" }}>
                        {page['blocks'].map(block => this.renderBlock(block))}
                        {page['images'].map((images) => this.renderImage(images))}
                    </div>
                    <Divider />
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }

    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_page: state.block_highlight.page_no,
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(TranslatedDocument);

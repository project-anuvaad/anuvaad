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

    renderBlock = (block) => {
        return (
            <Textfit mode="multi"
                min={8} max={block.font_size ? parseInt(block.font_size) : 16}
                style={{
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
                    <span key={i}>{i !== 0 && " "}
                        <p
                            style={{
                                margin: '0px',
                                textAlign: "justify",
                                lineHeight: Number(block.text_height / block.childrenLength) + 'px',
                                fontFamily: block.font_family,
                                // fontSize: block.font_size + "px",
                                fontColor: block.font_color,
                                fontWeight: (block.font_family && block.font_family.includes("Bold") || block.attrib && block.attrib.toLowerCase().includes("bold")) && 'bold',
                            }}
                            key={text.s_id}>{text.tgt}</p></span>
                )}
            </Textfit>
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

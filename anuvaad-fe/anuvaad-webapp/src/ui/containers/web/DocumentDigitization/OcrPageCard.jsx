import React from "react";
import { Paper, Divider } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import sentenceHighlight from '../../../../utils/SentenceHighlight'
import DownloadJSON from '../../../../flux/actions/apis/download/download_json';
import DownloadFile from '../../../../flux/actions/apis/download/download_zip_file';
import { Textfit } from "react-textfit";
import { highlightSentence, clearHighlighBlock, cancelMergeSentence } from '../../../../flux/actions/users/translator_actions';
import Popper from '@material-ui/core/Popper';
import SENTENCE_ACTION from '../DocumentEditor/SentenceActions'
import { confscore } from '../../../../utils/OcrConfScore'

const PAGE_OPS = require("../../../../utils/page.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

const styles = {
    textField: {
        width: "100%",
        background: 'rgb(211,211,211)',
        borderRadius: 10,
        border: 0,
        color: 'green',
    },
    resize: {
        fontSize: '600'
    }
}


class OcrPageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            text: '',
            url: '',
            showImage: !this.props.showImage,
            event: false
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.action = null
    }

    componentDidUpdate(prevProps) {
        if (prevProps.block_highlight !== this.props.block_highlight && this.props.block_highlight.block_identifier) {
            this.handleSourceScroll(this.props.block_highlight.block_identifier)
        }
    }

    /**
     * render Sentences
     */
    renderText = (line, region) => {
        return (
            <div
                key={line.identifier}
            >
                {
                    line['children'].map(word => {
                        return this.renderTextSpan(word, line, region)
                    })

                }
            </div>
        )
    }
    /**
     * render Sentences span
     */

    clearEvent = () => {
        this.setState({ event: false })
    }
    renderTextSpan = (word, line, region) => {
        return (
            <div
                // contentEditable={this.action === word.identifier}
                style={{
                    position: "absolute",
                    zIndex: this.action === word.identifier ? 100000 : 2,
                    color: word.conf < this.props.percent ? 'red' : 'black',
                    padding: '0%',
                    fontSize: parseInt(Math.ceil(region.avg_size + 1)) + 'px',
                    fontStyle: region.font.family,
                    top: line.boundingBox.vertices[0].y + 'px',
                    left: word.boundingBox.vertices[0].x - line.boundingBox.vertices[0].x + 'px',
                    maxWidth: word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x + 'px',
                    width: 'auto'
                }}
                key={word.identifier}
                onDoubleClick={(e) => this.handleSelectedSentenceId(e, word)}
                onBlur={this.clearEvent}
            >

                <Textfit mode="single" min={1} max={region.avg_size} >
                    {word.text}
                </Textfit>
                {this.state.event &&
                    this.showPopper(word)}

            </div>
        )
    }

    showPopper = (word) => {
        return (
            <Popper style={{ zIndex: 3 }} id={word.identifier} open={true} anchorEl={this.state.event}>
                <div style={{ border: '1px solid black' }}>The content of the Popper.</div>
                {/* <TextField variant="outlined" value={word.text}>
                    {word.text}
                </TextField> */}
            </Popper>
        );
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
                // className="form-control"
                value={this.state.text}
                variant="outlined"
                // id="mui-theme-provider-outlined-input"
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
    handleSelectedSentenceId = (event, text) => {
        this.setState({ text: text.text, event: event.currentTarget })
        this.action = text.identifier;
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


    renderChild = (region) => {
        let width = (region.boundingBox.vertices[1].x - region.boundingBox.vertices[0].x) + 'px'
        let height = (region.boundingBox.vertices[2].y - region.boundingBox.vertices[0].y) + 'px'
        let top = region.boundingBox.vertices[0].y + 'px'
        let left = (region.boundingBox.vertices[0].x) + 'px'
        return (
            <div style={{
                position: "absolute",
                height: height,
                width: width,
                left: left,
                zIndex: 2,
            }}
                id={region.identifier}
                key={region.identifier}
            >

                {region['children'] &&
                    region['children'].map(line => this.renderText(line, region))
                }
            </div>
        );
    }

    getBGImage = (image) => {
        let obj = new DownloadFile(image);
        const apiReq1 = fetch(obj.apiEndPoint(), {
            method: "get",
            headers: obj.getHeaders().headers,
        })
            .then(async (response) => {
                if (!response.ok) {
                    this.setState({
                        dialogMessage: "Failed to download file...",
                        timeOut: 3000,
                        variant: "info",
                    });
                    console.log("api failed");
                } else {
                    const buffer = new Uint8Array(await response.arrayBuffer());
                    let res = Buffer.from(buffer).toString("base64");
                    if (!this.state.url)
                        fetch("data:image/jpeg;base64," + res)
                            .then(res => res.blob())
                            .then(blob => {
                                let url = URL.createObjectURL(blob);
                                this.setState({ url })
                            });
                }
            })
            .catch((error) => {
                this.setState({
                    dialogMessage: "Failed to download file...",
                    timeOut: 3000,
                    variant: "info",
                });
                console.log("api failed because of server or network", error);
            });
    }

    renderImage = (image, region) => {
        if (this.props.showImage) {
            let width = region.boundingBox.vertices[1].x - region.boundingBox.vertices[0].x + 'px'
            let height = region.boundingBox.vertices[2].y - region.boundingBox.vertices[0].y + 'px'
            let img = image.replace('upload/', '')

            let style = {
                position: "relative",
                width: width,
                height: height,
                overflow: "hidden",
                zIndex: 1
            }

            this.getBGImage(img)
            return (
                <div style={style} key={region.identifier}>
                    <img width={width} height={height} src={this.state.url} alt=""></img>
                </div>
            )
        }
        else {
            return <div key={region.identifier}></div>
        }
    }

    renderPage = (page) => {
        if (page) {
            let width = page['vertices'] && page.vertices[1].x - page.vertices[0].x + 'px'
            let height = page['vertices'] && page.vertices[2].y - page.vertices[0].y + 'px'
            return (
                <div>
                    <Paper elevation={2} style={{ position: 'relative', width: width, height: height }}>
                        {page['regions'].map(region => this.renderChild(region))}
                        {page['regions'].map(region => {
                            if (region.class === 'BGIMAGE') {
                                return this.renderImage(region.data, region)
                            }
                        })
                        }
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
            <span style={{ zoom: `${this.props.zoomPercent}%` }}>{this.renderPage(this.props.page, this.props.image)}</span>
        )
    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_highlight: state.block_highlight.block,
    block_page: state.block_highlight.page_no,
    sentence_highlight: state.sentence_highlight.sentence,
    percent: state.fetchpercent.percent
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

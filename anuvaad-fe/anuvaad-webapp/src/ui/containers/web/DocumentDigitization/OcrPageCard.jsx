import React from "react";
import { Paper, Divider } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import DownloadFile from '../../../../flux/actions/apis/download/download_zip_file';
import { highlightSentence, clearHighlighBlock, cancelMergeSentence } from '../../../../flux/actions/users/translator_actions';
import SENTENCE_ACTION from '../DocumentEditor/SentenceActions'
import SaveEditedWord from './SaveEditedWord';
import Modal from '@material-ui/core/Modal';
import set_crop_size from '../../../../flux/actions/apis/view_digitized_document/set_crop_size';
import UpdateWord from '../../../../flux/actions/apis/view_digitized_document/update_word';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Snackbar from "../../../components/web/common/Snackbar";


const PAGE_OPS = require("../../../../utils/page.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

const styles = {
    textField: {
        width: "100%",
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
            text: '',
            url: '',
            event: false,
            isOpen: false,
            error : false,
            errorMessage : ""
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.action = null
    }

    componentDidUpdate(prevProps) {
        if (prevProps.block_highlight !== this.props.block_highlight && this.props.block_highlight.block_identifier) {
            this.handleSourceScroll(this.props.block_highlight.block_identifier)
        }
        if (prevProps.status !== this.props.status) {
            this.setState({ url: '' })
        }
        if (this.props.words[0] && prevProps.words.length !== this.props.words.length) {
            this.setState({ loading: false, isOpen: false })
            TELEMETRY.saveEditedWordEvent(this.props.words[0], 'UPDATED_WORD')
        }
    }

    /**
     * render Sentences
     */

    renderChild = (region) => {
        let width = (region.boundingBox.vertices[1].x - region.boundingBox.vertices[0].x) + 'px'
        let height = (region.boundingBox.vertices[2].y - region.boundingBox.vertices[0].y) + 'px'
        let top = (region.boundingBox.vertices[0].y) + 'px'
        let left = (region.boundingBox.vertices[0].x) + 'px'
        return (
            <div style={{
                position: "absolute",
                height: height,
                width: width,
                top: top,
                left: left,
                zIndex: 2,
            }}
                id={region.identifier}
                key={region.identifier}
            >

                {
                    region['regions'] &&
                    region['regions']?.map(line => this.renderText(line, region))
                }
            </div>
        );
    }

    renderText = (line, region) => {
        console.log(" line ---- ", line);
        return (
            <div
                style={{
                    // border: (line.class === 'CELL') && '1px solid black',
                    top: (line.class === 'CELL') && line.boundingBox.vertices[0].y - region.boundingBox.vertices[0].y + 'px',
                    left: line.class === 'CELL' && line.boundingBox.vertices[0].x - region.boundingBox.vertices[0].x + 'px',
                    height: line.class === 'CELL' && line.boundingBox.vertices[2].y - line.boundingBox.vertices[0].y + 'px',
                    width: line.class === 'CELL' && line.boundingBox.vertices[1].x - line.boundingBox.vertices[0].x + 'px',
                    position: line.class === 'CELL' && 'absolute',
                    zIndex: 5,
                }}
                key={line.identifier}>
                {
                    line.regions?.map(word =>
                        line.class !== 'CELL' ?
                            this.renderTextSpan(word, line, region) :
                            this.renderTable(word, line, region)
                    )
                }
            </div>
        )
    }

    renderTable = (word, line, region) => {
        // console.log("printing the word", word);
        return (
            <div
                style={{
                    position: "absolute",
                    fontSize: word.font ? `min(max(${word.font.size}px),${this.props.fontSize}px)` : `min(max(${this.props.fontSize}px),${this.props.fontSize/1.7}px)`,
                    top: word.boundingBox.vertices[0].y - line.boundingBox.vertices[0].y + 'px',
                    left: word.boundingBox.vertices[0].x - line.boundingBox.vertices[0].x + 'px',
                    maxWidth: word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x + 'px',
                    maxHeight: word.boundingBox.vertices[2].y - word.boundingBox.vertices[0].y + 'px',
                    width: 'fit-content',
                    height: '100%',
                    fontFamily: word.font && word.font.family,
                }}
                key={word.identifier}
                onDoubleClick={() => this.setModalState(this.renderUpdatedWords(word), word.identifier, region.identifier)}>
                {
                    this.renderUpdatedWords(word)
                }
            </div>
        )
    }

    renderUpdatedWords = (word) => {
        let updatedWord = this.props.words.length && this.props.words.filter(data => {
            return word.identifier === data.word_id
        })
        if (updatedWord[0]) {
            return updatedWord[0].updated_word
        }
        return word.text
    }
    renderTextSpan = (word, line, region) => {
        return (
            <div
                style={{
                    position: "absolute",
                    fontSize: `${this.props.fontSize}px`,
                    top: line.boundingBox.vertices[0].y - region.boundingBox.vertices[0].y + 'px',
                    left: word.boundingBox.vertices[0].x - region.boundingBox.vertices[0].x + 'px',
                    maxWidth: word.boundingBox.vertices[1].x - word.boundingBox.vertices[0].x + 'px',
                    maxHeight: word.boundingBox.vertices[2].y - word.boundingBox.vertices[0].y + 'px',
                    width: 'fit-content',
                    height: '100%',
                    fontFamily: word.font && word.font.family,
                }}
                key={word.identifier}
                onDoubleClick={() => this.setModalState(this.renderUpdatedWords(word), word.identifier, region.identifier)}>
                {
                    this.renderUpdatedWords(word)
                }
            </div>
        )
    }

    setModalState = (word, word_identifier, region_identifier) => {
        this.setState({ regionID: region_identifier, wordID: word_identifier, isOpen: true, text: word })
    }

    saveWord = (word) => {
        let { regionID, wordID } = this.state
        let { APITransport } = this.props
        let { jobId, filename } = this.props.match.params
        let originalWord = this.state.text;
        let changedWord = word
        if (!changedWord) {
            this.setState({
                isOpen : false,
                error : true,
                errorMessage : `Type a word to replace ${originalWord}.`
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        error : false,
                        errorMessage : ``
                    })
                },6000)
            })
        } else if (changedWord !== originalWord) {
            this.setState({ loading: true })
            let apiObj = new UpdateWord(`${jobId}|${filename}`, regionID, wordID, changedWord, this.props.page.page_no)
            APITransport(apiObj);
        }
    }

    renderModal = () => {
        return (
            <Modal
                open={this.state.isOpen}
                onClose={this.handleClose}
            >
                <SaveEditedWord handleClose={this.handleClose} text={this.state.text} id={this.state.id} loading={this.state.loading} saveWord={this.saveWord} />
            </Modal>
        )
    }

    handleClose = () => {
        this.setState({ isOpen: false })
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
                    // console.log("api failed");
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
                // console.log("api failed because of server or network", error);
            });
    }

    renderImage = (image) => {
        if (this.props.status) {
            let width = image.boundingBox.vertices[1].x - image.boundingBox.vertices[0].x + 'px'
            let height = image.boundingBox.vertices[2].y - image.boundingBox.vertices[0].y + 'px'
            let img = image.data.replace('upload/', '')

            let style = {
                position: "relative",
                width: width,
                height: height,
                overflow: "hidden",
                zIndex: 1
            }

            this.getBGImage(img)
            return (
                <div style={style} key={image.identifier}>
                    <img width={width} height={height} src={this.state.url} alt=""></img>
                </div>
            )
        }
        else {
            return <div key={image.identifier}></div>
        }
    }

    setLocationCoords = (identifier) => {
        let { x, y, height, width, unit } = this.props.crop_size.copiedCoords
        let div = document.createElement('div');
        div.className = identifier
        div.style.left = x + unit
        div.style.top = y + unit
        div.style.height = height + unit
        div.style.width = width + unit
        div.style.border = `1px solid black`
        div.style.position = "absolute"
        div.setAttribute('contenteditable', true)
        div.style.zIndex = 2
        div.style.fontSize = this.props.fontSize + unit
        div.onblur = () => {
            div.style.border = "none"
        }
        this.paper.appendChild(div);
    }


    renderPage = (page, image) => {
        if (page) {
            let width = page['boundingBox'] && page.boundingBox.vertices[1].x - page.boundingBox.vertices[0].x + 'px'
            let height = page['boundingBox'] && page.boundingBox.vertices[2].y - page.boundingBox.vertices[0].y + 'px'
            return (
                <div>
                    <Paper
                        id={page.identifier}
                        key={page.identifier}
                        ref={e => this.paper = e}
                        elevation={2} style={{ position: 'relative', width: width, height: height }}>
                        {page['regions'].map(region => this.renderChild(region))}
                        {this.props.status && this.renderImage(image)}
                        {(this.props.copy_status) && this.setLocationCoords(page.identifier)}
                    </Paper>
                    <Divider />
                </div>
            )
        }
        return (
            <div></div>
        )
    }

    handleCloseSnackbar = () => {
        this.setState({
            error : false,
            errorMessage : ``
        })
    }

    render() {
        return (
            <>
                <span style={{ zoom: `${this.props.zoomPercent}%` }}>{this.renderPage(this.props.page, this.props.image)}</span>
                {this.renderModal()}
                {this.state.error && (
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        open={this.state.error}
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        variant={"error"}
                        message={this.state.errorMessage}
                    />
                )}
            </>
        )
    }

}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    block_highlight: state.block_highlight.block,
    block_page: state.block_highlight.page_no,
    sentence_highlight: state.sentence_highlight.sentence,
    percent: state.fetchpercent.percent,
    status: state.showimagestatus.status,
    switch_style: state.switch_style.status,
    fontSize: state.fetch_slider_pixel.percent,
    crop_size: state.cropsizeinfo,
    copy_status: state.copylocation.status,
    words: state.updated_words.words,
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        highlightSentence,
        clearHighlighBlock,
        cancelMergeSentence,
        set_crop_size,
        APITransport
    },
    dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OcrPageCard));

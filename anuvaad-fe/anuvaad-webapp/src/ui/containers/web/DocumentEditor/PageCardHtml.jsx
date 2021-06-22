import { Paper } from "@material-ui/core"
import React from 'react';
import DownloadFile from "../../../../flux/actions/apis/download/download_zip_file";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { v4 as uuid4 } from 'uuid'
import { clearHighlighBlock } from '../../../../flux/actions/users/translator_actions';
import { bindActionCreators } from "redux";

const $ = require('jquery');


class PageCardHtml extends React.Component {
    constructor(props) {
        super(props);
        this.prev_sid = React.createRef()
        this.page_no = React.createRef()
        this.state = {
            loaded: false
        }
    }

    getHTML = () => {
        let inputField = this.props.match.params.inputfileid
        let filename = inputField.substr(inputField.indexOf('-') + 1).replace('.json', '.html')
        let obj = new DownloadFile(filename)
        fetch('https://anuvaad1.s3.ap-south-1.amazonaws.com/pdf_test/NDEAR+-+short+version+v2.0-html.html', {
            method: 'get',
            headers: obj.getHeaders().headers
        })
            .then(async res => {
                if (res.status === 200) {
                    let html = await res.text()
                    $('#paper').html(html)
                    let images = document.getElementsByTagName('img')
                    for (let i = 0; i < images.length; i++) {
                        images[i].src = 'https://anuvaad1.s3.ap-south-1.amazonaws.com/pdf_test/' + images[i].src.substr(images[i].src.lastIndexOf('/') + 1)
                    }
                    $('body').css('width', '100%')
                    this.setState({ loaded: true })
                } else {
                    $('#paper').html('Failed to load...')
                }
            })
    }

    highlight = (source, color, id) => {
        if (source) {
            const paper = $('#paper').html()
            const pattern = '( |<br>+|<span>+|<b>+|<i>+|&[a-z]+;|[._,;*+?^${}()|[\\]\\\\])+'
            try {

                let regExpSource = source.split(' ').join(pattern)
                regExpSource = new RegExp(regExpSource, 'gm')
                let m;
                let regArr = [];
                while ((m = regExpSource.exec(paper)) !== null) {
                    regArr.push(m)
                }
                let matchArr = regArr[regArr.length - 1]
                let startIndex = matchArr && matchArr.index
                let totalLen = 0
                if (matchArr) totalLen += matchArr[0].length
                let coloredText = paper.substr(startIndex, totalLen)
                if (startIndex >= 0) {
                    let firstHalf = paper.substr(0, startIndex)
                    let secondHalf = `<font id=${id} style='background-color:${color};padding:3px 0'>${coloredText}</font>`
                    let thirdHalf = paper.substr(startIndex + totalLen)
                    $('#paper').html(`${firstHalf}${secondHalf}${thirdHalf}`)
                }
            } catch (error) {
                console.log('error occurred!', source)
            }
        }
    }


    getSource = (fetchContent, pageNo) => {
        let tokenized_source
        fetchContent && fetchContent['result']['data'].forEach(value => {
            if (value.page_no === pageNo) {
                tokenized_source = value['text_blocks'].filter(text => {
                    return text.text !== ''
                })
            }
        })
        if (Array.isArray(tokenized_source) &&
            tokenized_source[0].hasOwnProperty('tokenized_sentences')
            && tokenized_source[0]['tokenized_sentences'][0]
        )
            return tokenized_source[0]['tokenized_sentences'][0]['s0_src']

    }

    componentDidMount() {
        $('#paper').html('Loading...')
        this.getHTML()
    }

    componentDidUpdate(prevProps) {
        const { highlightBlock } = this.props
        if (this.page_no !== this.props.active_page && this.state.loaded) {
            this.page_no = this.props.active_page
            let source = this.getSource(this.props.fetchContent, this.page_no)
            if (this.prev_sid) {
                var font = document.getElementsByTagName('font');
                var counter = font.length - 1;
                for (let i = counter; i >= 0; i--) {
                    font[i].outerHTML = font[i].innerHTML;
                }
            }
            if (source) {
                this.prev_sid = uuid4()
                this.highlight(source, 'white', this.prev_sid)
                let sentenceToHighlight = document.getElementById(this.prev_sid)
                if (sentenceToHighlight) sentenceToHighlight.scrollIntoView({ behavior: "smooth", inline: "nearest" })
            }
            this.props.clearHighlighBlock();
        } else if (highlightBlock.block) {
            let { src } = highlightBlock.block
            if (highlightBlock.current_sid !== highlightBlock.prev_sid && highlightBlock.prev_sid) {
                var font = document.getElementsByTagName('font');
                var counter = font.length - 1;
                for (let i = counter; i >= 0; i--) {
                    font[i].outerHTML = font[i].innerHTML;
                }
                this.prev_sid = uuid4()
                this.highlight(src, 'orange', this.prev_sid)
                let current = document.getElementById(this.prev_sid)
                current && current.scrollIntoView({ behavior: "smooth", inline: "nearest" });
            } else if (highlightBlock.current_sid && !highlightBlock.prev_sid) {
                this.prev_sid = uuid4()
                this.highlight(src, 'orange', this.prev_sid)
                let current = document.getElementById(this.prev_sid)
                current && current.scrollIntoView({ behavior: "smooth", inline: "nearest" });
            } else if (highlightBlock.current_sid === highlightBlock.prev_sid && highlightBlock.prev_sid) {
                var font = document.getElementsByTagName('font');
                var counter = font.length - 1;
                for (let i = counter; i >= 0; i--) {
                    font[i].outerHTML = font[i].innerHTML;
                }
            }
        }
    }

    render() {
        return (
            <span style={{ zoom: `${this.props.zoomPercent}%` }}>
                <Paper style={{ padding: '3%' }} id='paper'></Paper>
            </span>

        )
    }
}


const mapStateToProps = state => ({
    highlightBlock: state.block_highlight,
    active_page: state.active_page_number.page_number,
    fetchContent: state.fetchContent
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        clearHighlighBlock
    },
    dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageCardHtml));

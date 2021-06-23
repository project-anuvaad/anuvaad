import React from 'react';
import GetHtmlLink from "../../../../flux/actions/editor/getHtmlLink";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { v4 as uuid4 } from 'uuid'
import { clearHighlighBlock } from '../../../../flux/actions/users/translator_actions';
import { bindActionCreators } from "redux";
import APITransport from '../../../../flux/actions/apitransport/apitransport';
import { highlightSource } from '../../../../utils/HtmlHighlightProcess';
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

    componentDidMount() {
        $('#paper').html('Loading...')
        this.getHTML()
    }

    componentDidUpdate(prevProps) {
        const { highlightBlock } = this.props

        if (prevProps.link !== this.props.link) {
            this.fetchHtmlData(this.props.link)
        }

        if (this.page_no !== this.props.active_page && this.state.loaded) {
            this.page_no = this.props.active_page
            let source = this.getSource(this.props.fetchContent, this.page_no)
            if (this.prev_sid) {
                this.removeFontTag();
            }
            if (source) {
                this.processScrollIntoView('white', source)
            }
            this.props.clearHighlighBlock();
        } else if (highlightBlock.block) {
            let { src } = highlightBlock.block
            if (highlightBlock.current_sid !== highlightBlock.prev_sid && highlightBlock.prev_sid) {
                this.removeFontTag();
                this.processScrollIntoView('orange', src)
            } else if (highlightBlock.current_sid && !highlightBlock.prev_sid) {
                this.processScrollIntoView('orange', src)
            }
        }
    }

    getHTML = () => {
        let { jobid } = this.props.match.params
        let { APITransport } = this.props
        jobid = jobid.split('|').shift()
        let obj = new GetHtmlLink([jobid])
        APITransport(obj)
    }

    highlightSentence = (paper, startIndex, totalLen, color, id) => {
        let coloredText = paper.substr(startIndex, totalLen)
        let firstHalf = paper.substr(0, startIndex)
        let secondHalf = `<font id=${id} style='background-color:${color};padding:3px 0'>${coloredText}</font>`
        let thirdHalf = paper.substr(startIndex + totalLen)
        $('#paper').html(`${firstHalf}${secondHalf}${thirdHalf}`)
    }

    highlight = (source, color, id) => {
        if (source) {
            const paper = $('#paper').html()
            try {
                highlightSource(source, color, id, this.highlightSentence, paper)
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

    setTagAttrib = (baseUrl, tag, property) => {
        for (let i = 0; i < tag.length; i++) {
            tag[i][property] = baseUrl + tag[i][property].substr(tag[i][property].lastIndexOf('/') + 1)
        }
    }

    fetchHtmlData = (link) => {
        fetch(link, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`
            }
        })
            .then(async res => {
                if (res.status === 200) {
                    let html = await res.text()
                    $('#paper').html(html)
                    let images = document.getElementsByTagName('img')
                    let urls = document.getElementsByTagName('a')
                    let baseUrl = link.substr(0, link.lastIndexOf('/') + 1)
                    this.setTagAttrib(baseUrl, images, 'src')
                    this.setTagAttrib(baseUrl, urls, 'href')
                    $('body').css('width', '100%')
                    this.setState({ loaded: true })
                } else {
                    $('#paper').html('Failed to load...')
                }
            })
    }

    processScrollIntoView = (color, src) => {
        this.prev_sid = uuid4()
        this.highlight(src, color, this.prev_sid)
        let current = document.getElementById(this.prev_sid)
        current && current.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    removeFontTag = () => {
        var font = document.getElementsByTagName('font');
        var counter = font.length - 1;
        for (let i = counter; i >= 0; i--) {
            font[i].outerHTML = font[i].innerHTML;
        }
    }

    render() {
        return (
            <span id='paper' style={{ zoom: `${this.props.zoomPercent}%` }}></span>

        )
    }
}


const mapStateToProps = state => ({
    highlightBlock: state.block_highlight,
    active_page: state.active_page_number.page_number,
    fetchContent: state.fetchContent,
    link: state.getHtmlLink.link
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        clearHighlighBlock,
        APITransport
    },
    dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageCardHtml));

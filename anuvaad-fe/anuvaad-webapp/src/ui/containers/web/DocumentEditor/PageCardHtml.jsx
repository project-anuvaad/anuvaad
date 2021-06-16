import { Paper } from "@material-ui/core"
import React from 'react';
import DownloadFile from "../../../../flux/actions/apis/download/download_zip_file";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const $ = require('jquery');


class PageCardHtml extends React.Component {
    constructor(props) {
        super(props);
    }
    getHTML = () => {
        let filename = this.props.match.params.inputfileid.split('DOCX-')[1].split('.')[0] + '.html'
        let obj = new DownloadFile(filename)
        fetch(obj.apiEndPoint(), {
            method: 'get',
            headers: obj.getHeaders().headers
        })
            .then(async res => {
                if (res.status === 200) {
                    let html = await res.text()
                    $('#paper').html(html)
                    $('body').css('width', '100%')
                } else {
                    $('#paper').html('Failed to load...')
                }
            })
    }

    componentDidUpdate() {
        const { highlightBlock } = this.props
        if (highlightBlock.block) {
            let { src } = highlightBlock.block
            if (highlightBlock.current_sid !== highlightBlock.prev_sid && highlightBlock.prev_sid) {
                let prev = document.getElementById(highlightBlock.prev_sid)
                if (prev) prev.style.backgroundColor = "white"
                this.highlight(src, 'orange', highlightBlock.current_sid)
                let current = document.getElementById(highlightBlock.current_sid)
                current && current.scrollIntoView({ inline: 'nearest' });
            } else if (highlightBlock.current_sid && !highlightBlock.prev_sid) {
                this.highlight(src, 'orange', highlightBlock.current_sid)
                let current = document.getElementById(highlightBlock.current_sid)
                current && current.scrollIntoView({ inline: 'nearest' });
            } else if (highlightBlock.current_sid === highlightBlock.prev_sid && highlightBlock.prev_sid) {
                let prev = document.getElementById(highlightBlock.prev_sid)
                if (prev) prev.style.backgroundColor = "white"
            }
        }
    }


    highlight = (source, color, id) => {
        if (source) {
            const paper = $('#paper').html();
            let index = paper.indexOf(source)
            if (index) {
                let firstHalf = paper.substr(0, index)
                let secondHalf = `<font id=${id} style='background-color:${color}'>${paper.substr(index, source.length)}</font>`
                let thirdHalf = paper.substr(index + source.length)
                $('#paper').html(`${firstHalf}${secondHalf}${thirdHalf}`)
            }
        }
    }

    componentDidMount() {
        this.getHTML()
        $('.MuiGrid-grid-lg-6').css('max-width','100%')
        $('#paper').html('Loading...')
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
});

export default withRouter(connect(mapStateToProps)(PageCardHtml));

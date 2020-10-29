
import React from "react";
import SentenceCard from './SentenceCard';
import Divider from '@material-ui/core/Divider';

const { v4 }        = require('uuid');

const PAGE_OPS = require("../../../../utils/page.operations");

class SentenceRenderer extends React.Component {

    renderSentence = (sentence) => {
        return (
            <div id={sentence.s_id}>
                <SentenceCard key={v4()} sentence={sentence} />
                <Divider />
            </div>
        )
    }

    renderPage = (page) => {
        if (page['translated_texts']) {
            return ( <div> {page['translated_texts'].map(text => this.renderSentence(text))} </div>)
        }
        return(
            <div></div>
        )
    }

    renderPages = () => {
        let pages = PAGE_OPS.get_pages_children_information(this.props.documentData.pages);
        if (pages.length < 1) {
            return(
                <div></div>
            )
        }

        return (
            <div>{pages.map(page => this.renderPage(page))}</div>
        )
    }

    render() {
        return (
            <div>
                {this.renderPages()}
            </div>
        )
    }

}

export default SentenceRenderer;
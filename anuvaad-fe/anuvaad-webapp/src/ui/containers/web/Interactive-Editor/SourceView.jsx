import React from "react";

class Preview extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    hoverOn(e, pageNo) {
        // if (!this.props.isPreview) {
        this.props.handleOnMouseEnter(e, this.props.paperType, pageNo);
        // }
    }

    hoverOff() {
        // if (!this.props.isPreview) {
        this.props.handleOnMouseEnter("");
        // }
    }



    getSelectionText(event,id) {
        this.props.getSelectionText(event,id)
    }

    handleSelection(selectedSentence, event) {
        this.setState({ sText: window.getSelection().toString() })
        if (
            selectedSentence &&
            selectedSentence.startNode &&
            selectedSentence.endNode &&
            selectedSentence.pageNo &&
            window.getSelection().toString() &&
            selectedSentence.startParagraph &&
            selectedSentence.endParagraph
        ) {
            let initialIndex;
            let startSentence;
            let endIndex;
            let endSentence;
            let operation_type;
            let selectedSplitValue;
            const { pageNo } = selectedSentence;

            const startValue = selectedSentence.startNode.split("_");
            const endValue = selectedSentence.endNode.split("_");

            this.state.sentences.map((sentence, index) => {
                if (sentence._id === startValue[0]) {
                    initialIndex = index;
                    sentence.tokenized_sentences.map((value, index) => {
                        if (value.sentence_index === Number(startValue[1])) {
                            startSentence = value;
                        }
                        return true;
                    });
                }
                if (sentence._id === endValue[0]) {
                    endIndex = index;

                    sentence.tokenized_sentences.map((value, index) => {
                        if (value.sentence_index === Number(endValue[1])) {
                            endSentence = value;
                        }
                        return true;
                    });
                }
                return true;
            });

            const mergeSentence = this.state.sentences.slice(initialIndex, endIndex + 1);
            if (startValue[0] === endValue[0] && startValue[1] === endValue[1]) {
                const selectedSplitEndIndex = window.getSelection() && window.getSelection().getRangeAt(0).endOffset;
                operation_type = "split";
                selectedSplitValue = startSentence.src.substring(0, selectedSplitEndIndex);
            } else {
                operation_type = "merge";
                selectedSplitValue = window.getSelection().toString();
            }

            this.state.addSentence
                ? this.setState({
                    mergeSentence: [...this.state.mergeSentence, ...mergeSentence],
                    selectedMergeSentence: [...this.state.selectedMergeSentence, selectedSentence],
                    endSentence,
                    openEl: true,
                    contextToken: true,
                    addSentence: true,
                    pageNo,
                    topValue: event.clientY - 4,
                    leftValue: event.clientX - 2,
                    startParagraph: selectedSentence.startParagraph,
                    endParagraph: selectedSentence.endParagraph
                })
                : this.setState({
                    mergeSentence,
                    selectedMergeSentence: [selectedSentence],
                    startSentence,
                    endSentence,
                    operation_type,
                    openEl: true,
                    splitSentence: selectedSplitValue,
                    contextToken: true,
                    topValue: event.clientY - 2,
                    leftValue: event.clientX - 2,
                    pageNo,
                    startParagraph: selectedSentence.startParagraph,
                    endParagraph: selectedSentence.endParagraph
                });
        }
    }

    fetchTokenizedSenetence(tokenText, id) {
        return (
            <span
            id={id + "_" + tokenText.sentence_index}
                style={{ backgroundColor: this.props.hoveredSentence === id + "_" + tokenText.sentence_index ? "yellow" : "" }}
                onMouseEnter={() => this.hoverOn(id + "_" + tokenText.sentence_index)}
                onMouseLeave={() => this.hoverOff()}
                
            >
                {tokenText.src}
            </span>
        )
    }

    fetchSentence(block, styles) {

        return (<div onMouseUp={this.getSelectionText.bind(this)}
        onKeyUp={this.getSelectionText.bind(this)} style={styles}>{block && block.tokenized_sentences && Array.isArray(block.tokenized_sentences) && block.tokenized_sentences.length > 0 &&
                block.tokenized_sentences.map((tokenSentence, index) => {
                    return this.fetchTokenizedSenetence(tokenSentence, block._id)
                })
            }</div>)

    }

    render() {
        const { key, sentence, yAxis, widthValue, leftPaddingValue, printPageNo, pageNo,  pageDividerHeight, paperWidth } = this.props;
        var a = {
            position: "absolute ",
            top: yAxis,
            left: sentence.x - leftPaddingValue + 20 + "px",
            width: widthValue + "px",
            fontSize: this.props.sentence.class_style["font-size"],
            fontFamily: this.props.sentence.class_style["font-family"],
            fontWeight: this.props.sentence.class_style["font-family"].includes("Bold") && 'bold',
            textAlign: "justify",
            lineHeight: this.props.sentence.class_style["lineHeight"] && this.props.sentence.class_style["lineHeight"],
            textDecorationLine: this.props.sentence.underline ? "underline" : ""
        };
        return (
            <div key={key}>
                {printPageNo ? <div>
                    {pageNo !== "1" && <div style={{ position: "absolute ", top: pageDividerHeight - 65, width: paperWidth, color: "#A5A5A5" }}><hr /></div>}

                    <div style={{ position: "absolute ", top: pageDividerHeight - 50, fontSize: "13px", fontFamily: "Times", left: "25px", color: "#A5A5A5" }}>Page No. {pageNo}</div>
                </div> : <div></div>
                }
                {/* <div> */}
                {sentence.is_image ? <div
                    style={{
                        position: "absolute ",
                        top: yAxis,
                        left: sentence.x + "px",
                        overflow: "hidden"
                    }}><img width={sentence.width} height={sentence.height} src={sentence.img} alt=""></img></div> : this.fetchSentence(sentence, a)}

                {/* </div> */}
            </div >
        );
    }
}

export default Preview;

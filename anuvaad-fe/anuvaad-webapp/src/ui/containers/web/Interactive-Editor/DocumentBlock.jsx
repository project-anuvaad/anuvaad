import React from "react";
import { Textfit } from "react-textfit";
import TextareaAutosize from 'react-textarea-autosize';

var arr = [];
class DocumentBlock extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      isEditable: false,
      value: false,
      selectedValueArray: [],
      mergeButton: "",
      workflowcode: ""
    };
  }

  handleMouseHover(id, block_identifier, has_sibling, pageNo) {
    if (!this.props.selectedSentence) {
      this.props.handleOnMouseEnter(id, this.props.parent, 0, block_identifier, has_sibling, pageNo);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mergeButton !== this.props.mergeButton) {
      if (this.props.mergeButton === "Merge" && arr.length > 0) {
        this.sentenceClear(arr)
        this.updateContent(arr)
      }
      else if (this.props.mergeButton === "Merge") {
        this.sentenceClear(arr)
      }

    }
  
  }

  // sentenceClear() {
  //   return arr.map(arrValue => {
  //     this.setState({ [arrValue]: false })
  //   return null;})
  // }
  updateContent(val) {


    this.props.updateContent(val);
    this.setState({ selectedValueArray: [] })
    arr = []
  }

  handleSentenceUpdate = (value, sentence) => {
    return (
      <div
        onBlur={event => this.props.handleBlur(this.props.sentence.block_identifier + "_" + this.props.page_no + "_" + this.props.paperType, "", value.text)}
        id={value.block_id + "_" + this.props.page_no + "_" + this.props.paperType}
        ref={value.block_id + "_" + this.props.page_no}
        onDoubleClick={event => {
          this.props.tokenized && this.handleDoubleClick(event, value.block_id + "_" + this.props.page_no, value);
        }}
        onMouseLeave={() => {
          !this.props.targetSelected && this.props.value !== true && this.props.handleOnMouseLeave();
        }}
        onMouseEnter={() => {
          !this.props.targetSelected && this.props.value !== true && this.handleMouseHover(sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType, sentence.block_identifier, sentence.has_sibling, this.props.page_no);
        }}
        style={{

          position: "absolute",
          top: value.text_top - 2 + "px",
          fontSize: value.font_size + "px",
          fontFamily: sentence.font_family,
          fontWeight: (sentence.font_family && sentence.font_family.includes("Bold") && "bold") || (sentence.attrib && sentence.attrib.toLowerCase().includes("bold")),
          outline: "0px solid transparent",
          zIndex: this.props.selectedSentence === value.block_id + "_" + this.props.page_no ? 2 : 1,

          // lineHeight: sentence.children ? parseInt(sentence.text_height / sentence.children.length) + "px" : "20px",
          backgroundColor: this.props.selectedSentence === value.block_id + "_" + this.props.page_no + "_source" && this.props.value ? "#F4FDFF" : "",
          border:
            this.props.selectedSentence === value.block_id + "_" + this.props.page_no + "_source" && this.props.value ? "1px solid #1C9AB7" : "",
          height: value.text_height + "px",
          left: value.text_left + "px",
          textAlignLast: sentence.children.length > 1 && this.props.selectedSentence !== value.block_id + "_" + this.props.page_no && "justify",
          width: value.text_width + "px"
        }}
      >
        <Textfit mode="single" style={{ width: parseInt(value.text_width) }} forceSingleModeWidth={true} min={1} max={parseInt(value.font_size)}>
          {this.props.selectedSentence === value.block_id + "_" + this.props.page_no ? (

            <TextareaAutosize
              multiline={true}
              autoFocus={true}
              // value={this.state.value}
              style={{
                width: value.text_width + "px",
                resize: "none",
                position: "relative",
                fontSize: value.font_size + "px",
                height: value.text_height + 10 + "px",
                fontFamily: value.font_family,

                borderRadius: "4px",
                backgroundColor: "#F4FDFF",
                borderColor: "#1C9AB7",
                color: "#000000",
                fontWeight: (sentence.font_family && sentence.font_family.includes("Bold") && "bold" )|| (sentence.attrib && sentence.attrib.toLowerCase().includes("bold")),


              }}
              onChange={event => {
                this.handleChangeEvent(event);
              }}
              value={this.props.selectedSourceText.text}
              maxRows={4}
            >
            </TextareaAutosize>
          ) : (
              value.text
            )}
        </Textfit>
      </div>
    );
  };

  // handleChange = name => event => {

  //   if (arr.includes(name)) {
  //     arr = arr.filter(item => item !== name);
  //   } else {
  //     arr.push(name);
  //   }

  //   this.setState({ selectedValueArray: arr });
  // };


  handleDoubleClick = (event, val, text, pageDetail) => {
    event.preventDefault();
    this.props.handleDoubleClick(val, text, pageDetail);
  };

  handleChangeEvent = event => {
    this.props.handleSourceChange(event, this.props.sentence);
  };

  render() {
    const { sentence } = this.props;

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
      textAlign: "justify",
      zIndex: this.props.paperType === "target" && this.props.hoveredSentence.split("_")[0] === sentence.block_id ? 2 : 1,
      display: "block",
      outline: "0px solid transparent",
      cursor: !this.state.isEditable && "pointer",
      padding: "5px",
      lineHeight: sentence.children ? parseInt(sentence.text_height / sentence.children.length) + "px" : "20px",
      border:
        arr.includes(sentence.block_id + "_" + this.props.page_no) ? "2px solid rgb(28, 154, 183)" : this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id &&
          !this.props.selectedBlock &&
          !this.props.targetSelected &&
          this.props.value !== true
          ? "2px dotted grey"
          : this.props.scrollId === this.props.page_no+"@"+sentence.block_identifier ? "1px solid #1C9AB7" : ""
    };

    return (
      <div>
        {/* <div
          id={sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType}
          style={styles}
          key={sentence.block_id}
          onBlur={event => this.props.handleBlur(this.props.sentence.block_identifier + "_" + this.props.page_no + "_" + this.props.paperType)}
          onMouseLeave={() => {
            !this.props.targetSelected && this.props.value !== true && this.props.handleOnMouseLeave();
          }}
          onMouseEnter={() => {
            !this.props.targetSelected && this.props.value !== true && this.handleMouseHover(sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType, sentence.block_identifier, sentence.has_sibling, this.props.page_no);
          }}
          ref={sentence.block_id + "_" + this.props.page_no}
        >
        </div> */}
        {/* {!this.props.tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id && this.renderLinesWithTokenizedData(sentence)} */}
        {(this.props.tokenized || this.props.hoveredSentence.split('_')[0] !== this.props.sentence.block_id) && Array.isArray(sentence.children) &&
          sentence.children &&
          sentence.children.map((textValue, tokenIndex) => {
            return (<div>
              {textValue.children
                ? textValue.children.map((value, i) => {
                  return this.handleSentenceUpdate(value, sentence);
                })
                : this.handleSentenceUpdate(textValue, sentence)}
            </div>)
          })}
      </div>
    )
  }
}

export default DocumentBlock;

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { Textfit } from "react-textfit";
import TextareaAutosize from 'react-textarea-autosize';
import AutoComplete from "../../../components/web/common/AutoComplete"


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
      if (this.props.mergeButton == "Merge" && arr.length > 0) {
        this.sentenceClear(arr)
        this.updateContent(arr)
      }
      else if (this.props.mergeButton == "Merge") {
        this.sentenceClear(arr)
      }


    }
    if (this.props.targetSelected !== prevProps.targetSelected) {
      // this.props.handleOnMouseLeave()
    }

    // if(this.props.arrayClear!== prevProps.arrayClear){
    //   this.sentenceClear(arr)
    // }
  }

  sentenceClear() {
    return arr.map(arrValue => {
      this.setState({ [arrValue]: false })
    })
  }
  updateContent(val) {


    this.props.updateContent(val);
    this.setState({ selectedValueArray: [] })
    arr = []
  }

  handleSentenceUpdate = (value, sentence) => {
    return (
      <div
        onBlur={event => this.props.handleBlur(this.props.sentence.block_identifier + "_" + this.props.page_no + "_" + this.props.paperType)}
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
          top: value.text_top-2 + "px",
          fontSize: value.font_size + "px",
          fontFamily: sentence.font_family,
          fontWeight: sentence.font_family && sentence.font_family.includes("Bold") && "bold" || sentence.attrib && sentence.attrib.toLowerCase().includes("bold"),
          outline: "0px solid transparent",
          zIndex: this.props.selectedSentence === value.block_id + "_" + this.props.page_no ? 2: 1,

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
value={this.state.value}
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
  fontWeight: sentence.font_family && sentence.font_family.includes("Bold") && "bold" || sentence.attrib && sentence.attrib.toLowerCase().includes("bold"),
          

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

  handleClickAway = (id, text, wf_code, saveData) => {
    if (!this.props.showSuggestions) {
      if (saveData) {
        this.handleChangeEvent({ target: { value: text } })
      }
      this.props.handleBlur(id, wf_code, saveData);
    }
  };

  handleTargetUpdate = (sentence, styles, not_tokenized) => {
    
    let childrens = sentence.children ? sentence.children.length : 1
    let words_count = 0
    let words_in_line = -1
    let current_line_words = 0
    let editable = false
    sentence.tokenized_sentences.map((text, tokenIndex) => {
      if(this.props.targetSelected === text.s_id + "_" + this.props.page_no){
        editable = true
      }
    })

    
    if (sentence.tokenized_sentences) {
      sentence.tokenized_sentences.map((text) => {
        words_count += text && text.tgt ? text.tgt.split(" ").length : 0
      })
    }
    if (words_count > 0 && childrens > 1) {
      // words_in_line = Math.round(words_count / childrens) + 1
    }
    return (
      sentence.tokenized_sentences && sentence.tokenized_sentences.length > 0 ?
        <div
          id={sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType}
          style={styles}
          
        
          key={sentence.block_id}
          // onBlur={event => this.props.handleBlur(event)}
          // onInput={event => this.handleChangeEvent(event, sentence.block_id + "_" + this.props.page_no)}
          onMouseLeave={() => {
            !this.props.targetSelected && this.props.value !== true && this.props.handleOnMouseLeave();
          }}
          onMouseEnter={() => {
            !this.props.targetSelected && this.props.value !== true && this.handleMouseHover(sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType, sentence.block_identifier, sentence.has_sibling, this.props.page_no);
          }}
          ref={textarea => {
            this.textInput = textarea;
          }}
        >
          <Textfit
            mode={sentence.children && sentence.children.length == 1 ? "single" : "multi"}
            style={{ height: parseInt(sentence.text_height), width: parseInt(sentence.text_width) }}
            min={1}
            max={parseInt(sentence.font_size)}
          >
            <div style={words_in_line !== -1  && !editable ? {
              textAlign: 'justify',
              textAlignLast: 'justify',
              
            } : {zIndex: 2}}>
              {sentence.hasOwnProperty("tokenized_sentences") &&
                sentence.tokenized_sentences.map((text, tokenIndex) => {
                  if (this.props.targetSelected === text.s_id + "_" + this.props.page_no) {
                    return (
                      // <ClickAwayListener id={tokenIndex} onClickAway={() => this.handleClickAway(sentence.block_identifier + "_" + this.props.page_no, wfcodes.DP_WFLOW_S_C)}>

                      <div
                        style={{
                          position: 'relative',
                          zIndex: 3
                        }}
                      >
                        <span
                        // onDoubleClick={event => {
                        //   this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target");
                        // }}
                        >
                          <span
                            ref={text.s_id + "_" + this.props.page_no}
                            style={{
                              outline: "none"
                            }}
                          >
                            <AutoComplete
                              aId={text.s_id + "_" + this.props.page_no}
                              refId={text.s_id + "_" + this.props.page_no}
                              block_identifier_with_page={sentence.block_identifier + "_" + this.props.page_no}
                              style={{
                                width: "600px",
                                // height: sentence.text_height + 5 + "px",
                                // resize: "none",
                                // resize: "both",
                                resize: "none", 
                                fontSize: sentence.font_size + "px",
                                fontFamily: sentence.font_family,
                                zIndex: 1111,
                                borderRadius: "4px",
                                backgroundColor: "#F4FDFF",
                                border: '1px solid #1C9AB7',
                              }}
                              tokenIndex={tokenIndex}
                              value={this.props.targetText.tgt}
                              sentence={sentence}
                              sourceText={text.src}
                              page_no={this.props.page_no}
                              handleChangeEvent={this.handleChangeEvent.bind(this)}
                              fetchSuggestions={this.props.fetchSuggestions}
                              autoCompleteText={this.props.autoCompleteText}
                              autoCompleteTextTaggetTgt={this.props.autoCompleteTextTaggetTgt}
                              handleSuggestion={this.props.handleSuggestion}
                              heightToBeIncreased={sentence.font_size}
                              handleBlur={this.props.handleBlur}
                              showSuggestions={this.props.showSuggestions}
                              handleSuggestionClose={this.props.handleSuggestionClose}
                              handleClickAway={this.handleClickAway.bind(this)}
                              tokenObject={text}
                            />
                          </span>
                          <span> </span>
                        </span>
                      </div>
                      // </ClickAwayListener>
                    );
                  } else {
                    if (text.tgt) {
                      let words = text.tgt ? text.tgt.split(" ") : []
                    if (words_in_line != -1) {
                      let spans = []
                      let words_length = words.length + current_line_words
                      if (words_length >= words_in_line) {
                        var i, j, temparray, chunk = words_in_line;
                        i = 0
                        j = words_length;
                        while (i < j) {
                          if (current_line_words >= chunk) {
                            current_line_words = 0
                          }
                          if (i == 0)
                            temparray = words.slice(i, i - current_line_words + chunk);
                          else
                            temparray = words.slice(i, i + chunk);
                          spans.push(<span>
                            <span
                              ref={text.s_id + "_" + this.props.page_no}
                              contentEditableId={true}
                              style={{
                                outline: "none",
                                textAlign: 'justify',
                                background: (!this.props.targetSelected && !not_tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
                              }}
                              onDoubleClick={event => {
                                this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target", sentence.block_id + "_" + this.props.page_no, this.props.page_no);
                              }}
                            >
                              {temparray.join(" ")}
                            </span>
                            <span> </span>
                            {(temparray.length + current_line_words < chunk) ? '' : <br></br>}
                          </span>)

                          i == 0 ? i += chunk - current_line_words : i += chunk
                          if (current_line_words == chunk) {
                            current_line_words = 0
                          } else
                            current_line_words = temparray.length > 0 ? (temparray.length + current_line_words) : current_line_words
                        }
                      } else {
                        spans.push(<span>
                          <span
                            ref={text.s_id + "_" + this.props.page_no}
                            contentEditableId={true}
                            style={{
                              outline: "none",
                              textAlign: 'justify',
                              background: (!this.props.targetSelected && !not_tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
                            }}
                            onDoubleClick={event => {
                              this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target", sentence.block_id + "_" + this.props.page_no, this.props.page_no);
                            }}
                          >
                            {words.join(" ")}
                          </span>
                          <span> </span>
                        </span>)
                        current_line_words = words.length
                      }
                      return spans
                    } else {
                      return (
                        <span>
                          <span>
                            <span
                              ref={text.s_id + "_" + this.props.page_no}
                              contentEditableId={true}
                              style={{
                                outline: "none",
                                background: (!this.props.targetSelected && !not_tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
                              }}
                              onDoubleClick={event => {
                                this.handleDoubleClickTarget(event, text.s_id + "_" + this.props.page_no, text, "target", sentence.block_id + "_" + this.props.page_no, this.props.page_no);
                              }}
                            >
                              {words.join(" ")}
                            </span>
                            <span> </span>
                          </span>
                        </span>
                      );
                    }
                  }
                }
                })}
            </div>
          </Textfit>
        </div>
        :
        <div></div>
    );
  };

  handleDoubleClickTarget = (evnt, id, text, pageDetails, block_id, pageNo) => {
    this.props.handleDoubleClickTarget(evnt, id, text, pageDetails, block_id, pageNo);
  };
  handleChange = name => event => {

    if (arr.includes(name)) {
      arr = arr.filter(item => item !== name);
    } else {
      arr.push(name);
    }

    this.setState({ selectedValueArray: arr });
  };


  handleDoubleClick = (event, val, text, pageDetail) => {
    event.preventDefault();
    this.props.handleDoubleClick(val, text, pageDetail);
  };

  handleChangeEvent = event => {
    this.props.handleSourceChange(event, this.props.sentence);
  };

  getSelectionText(event) {
    const sentenceStartId = window.getSelection().anchorNode.parentNode.id;
    const sentenceEndId = window.getSelection().focusNode.parentNode.id;
    const obj_start = sentenceStartId.split('##')
    const start_block_id = obj_start[0]
    const start_s_id = obj_start[1]
    let offset_tokenized = obj_start[2]
    const obj_end = sentenceEndId.split('##')
    const end_block_id = obj_end[0]
    const end_s_id = obj_end[1]
    let end_tokenized = obj_end[2]

    if (start_block_id !== end_block_id) {
      //Wrong blocks selected
      alert("Please select same block to merge the sentence.")
    }
    //Merge
    else if (start_s_id !== end_s_id) {
      let opeartion = "Merge Sentence";
      this.props.popUp(start_block_id, start_s_id, end_s_id, "", event, opeartion)
    }
    //Split
    else {
      if (window.getSelection().anchorOffset === window.getSelection().focusOffset) {
        // "Nothing to do"
      } else {
        // if (end_tokenized > 0) {
        //   end_tokenized = end_tokenized - 1
        // }
        let opeartion = "Split sentence";
        var split_index = parseInt(end_tokenized) + window.getSelection().focusOffset
        let sentence = this.props.sentence
        let actual_text = ''
        sentence.tokenized_sentences.map((token) => {
          if (token.s_id == start_s_id) {
            actual_text = token.src
          }
        })
        actual_text = actual_text.replace(/\s{2,}/g, ' ')
        actual_text = actual_text.trim()
        this.props.popUp(start_block_id, start_s_id, split_index, actual_text.substring(0,split_index), event, opeartion)
      }
    }
  }

  makeSpan(text, child, spanId, tokenIndex, token_obj) {
    return (token_obj && <span id={this.props.sentence.block_id + '##' + token_obj.s_id + '##' + (token_obj.actual_src.length - token_obj.src.length)}
      onMouseUp={this.getSelectionText.bind(this)}
      onKeyUp={this.getSelectionText.bind(this)} style={{
        // fontSize: (child.font_size) + "px",
        height: (child.text_height) + "px",
        left: (child.text_left - 2) + "px",
        background: ((!this.props.targetSelected && !(this.props.targetSelected && this.props.targetSelected.length > 0) && spanId && spanId === this.props.sentence.block_id && !this.props.selectedBlock) || (token_obj && token_obj.s_id + '_' + this.props.page_no === this.props.targetSelected)) ? tokenIndex % 2 == 0 ? '#92a8d1' : "coral" : ''
      }}
    >
      {text}
    </span>)
  }

  makeDiv(sentence, spans, div_style, child) {
    return (<div onMouseLeave={() => {
      !this.props.targetSelected && this.props.value !== true && this.props.handleOnMouseLeave();
    }}
      onMouseEnter={() => {
        !this.props.targetSelected && this.props.value !== true && this.handleMouseHover(sentence.block_id + "_" + this.props.page_no + "_" + this.props.paperType, sentence.block_identifier, sentence.has_sibling, this.props.page_no);
      }} style={div_style}><Textfit
        mode={"single"}
        style={{ height: parseInt(child.text_height), width: parseInt(child.text_width) }}
        min={1}
        max={parseInt(child.font_size)}
      >{spans}</Textfit></div>)

  }

  makeSpanObjects(sentence, text, tokenized_data, tokenIndex, spanId, elems, child, is_super) {
    text = text + ""
    text = text.replace(/\s{2,}/g, ' ');
    text = text.trim()
    const div_style = {
      textAlign: "justify",
      position: "absolute",
      top: child.text_top - 2 + "px",
      // fontSize: child.font_size + "px",
      fontFamily: sentence.font_family,
      fontWeight: sentence.font_family && sentence.font_family.includes("Bold") && "bold",
      outline: "0px solid transparent",
      zIndex: 1,
      // padding: "5px",

      // lineHeight: sentence.children ? parseInt(sentence.text_height / sentence.children.length) + "px" : "20px",
      height: (child.text_height) + "px",
      left: (child.text_left) + "px",
      textAlignLast: sentence.children && sentence.children.length > 1 && "justify",
      width: (child.text_width) + "px"
    }
    if (is_super) {
      if (!child.dont_show) {
        elems.push(this.makeDiv(sentence, this.makeSpan(text, child, spanId, tokenIndex, tokenized_data[tokenIndex]), div_style, child))
      }
      return { text: text, tokenized_data: tokenized_data, tokenIndex: tokenIndex, spanId: spanId, child: child, elems: elems }
    }
    if (text.length == tokenized_data[tokenIndex].src.length) {
      if (!child.dont_show) {
        elems.push(this.makeDiv(sentence, this.makeSpan(text, child, spanId, tokenIndex, tokenized_data[tokenIndex]), div_style, child))
      }
      tokenIndex++
    } else if (text.length > tokenized_data[tokenIndex].src.length) {
      let spans = []
      while (text.length > 0) {
        if (tokenIndex >= tokenized_data.length) {
          tokenIndex--
          if (!child.dont_show) {
            spans.push(this.makeSpan(text, child, spanId, tokenIndex, tokenized_data[tokenIndex]))
            spans.push(<span id={this.props.sentence.block_id + '##' + tokenized_data[tokenIndex].s_id + '##' + (tokenized_data[tokenIndex].actual_src.length - tokenized_data[tokenIndex].src.length)} onMouseUp={this.getSelectionText.bind(this)}
              onKeyUp={this.getSelectionText.bind(this)}> </span>)
          }
          break
        }
        if (text.length > tokenized_data[tokenIndex].src.length) {
          if (!child.dont_show) {
            spans.push(this.makeSpan(text.substring(0, tokenized_data[tokenIndex].src.length), child, spanId, tokenIndex, tokenized_data[tokenIndex]))
          }
          text = text.substring(tokenized_data[tokenIndex].src.length, text.length)
          text = text.trim()
          tokenIndex++
          if (!(tokenIndex == tokenized_data.length && text.length > 0)) {
            if (!child.dont_show) {
              spans.push(<span id={this.props.sentence.block_id + '##' + tokenized_data[tokenIndex].s_id + '##' + (tokenized_data[tokenIndex].actual_src.length - tokenized_data[tokenIndex].src.length)} onMouseUp={this.getSelectionText.bind(this)}
                onKeyUp={this.getSelectionText.bind(this)}> </span>)
            }
          }
        } else {
          if (!child.dont_show) {
            spans.push(this.makeSpan(text, child, spanId, tokenIndex, tokenized_data[tokenIndex]))
            spans.push(<span id={this.props.sentence.block_id + '##' + tokenized_data[tokenIndex].s_id + '##' + (tokenized_data[tokenIndex].actual_src.length - tokenized_data[tokenIndex].src.length)} onMouseUp={this.getSelectionText.bind(this)}
              onKeyUp={this.getSelectionText.bind(this)}> </span>)
          }
          if (text.length == tokenized_data[tokenIndex].src.length) {
            tokenIndex++
          } else {
            tokenized_data[tokenIndex].src = tokenized_data[tokenIndex].src.substring(text.length, tokenized_data[tokenIndex].src.length)
            tokenized_data[tokenIndex].src = tokenized_data[tokenIndex].src.trim()
          }
          text = ''
        }
      }
      if (!child.dont_show) {
        elems.push(this.makeDiv(sentence, spans, div_style, child))
      }
    }
    else {
      if (!child.dont_show) {
        let spans = this.makeSpan(text, child, spanId, tokenIndex, tokenized_data[tokenIndex])
        let spans_array = []
        spans_array.push(spans)
        spans_array.push(<span id={this.props.sentence.block_id + '##' + tokenized_data[tokenIndex].s_id + '##' + (tokenized_data[tokenIndex].actual_src.length - tokenized_data[tokenIndex].src.length)} onMouseUp={this.getSelectionText.bind(this)}
          onKeyUp={this.getSelectionText.bind(this)}> </span>)
        elems.push(this.makeDiv(sentence, spans_array, div_style, child))
      }
      tokenized_data[tokenIndex].src = tokenized_data[tokenIndex].src.substring(text.length, tokenized_data[tokenIndex].src.length)
      tokenized_data[tokenIndex].src = tokenized_data[tokenIndex].src.trim()
    }
    return { text: text, tokenized_data: tokenized_data, tokenIndex: tokenIndex, spanId: spanId, child: child, elems: elems }
  }

  makeSpanWithDiv(sen, spans) {
    return <div
    >
      {spans}
    </div>
  }

  renderLinesWithTokenizedData(sentenceOld) {
    let elems = []
    let tokenIndex = 0
    const sen = sentenceOld
    var allPages = this.props.sentences
    var childrens = []
    var tokenized_sentences = []
    var spanId = this.props.hoveredSentence.split('_')[0]
    var sentence = JSON.parse(JSON.stringify(sen))
    if (allPages && this.props.has_sibling) {
      allPages.map((page) => {
        if (page.text_blocks) {
          page.text_blocks.map((block) => {
            if (block.block_id == spanId && sentence.block_id == spanId) {
              if (sentence.block_identifier != block.block_identifier) {
                if (block.children) {
                  block.children.map((c) => {
                    let child = JSON.parse(JSON.stringify(c))
                    child.dont_show = true
                    childrens.push(child)
                  })
                }
              } else {
                if (block.children) {
                  block.children.map((child) => {
                    childrens.push(JSON.parse(JSON.stringify(child)))
                  })
                }
              }
              if (block.tokenized_sentences.length > 0) {
                tokenized_sentences = block.tokenized_sentences
              }
            }
          })
        }
      })
      if (childrens.length > 0) {
        sentence.children = JSON.parse(JSON.stringify(childrens))
        sentence.tokenized_sentences = JSON.parse(JSON.stringify(tokenized_sentences))
      }
    }

    var tokenized_data = sentence.tokenized_sentences
    tokenized_data.map((t) => {
      t.src = t.src.replace(/\s\s+/g, ' ')
      t.src = t.src.trim()
      t.actual_src = t.src
    })

    if (sentence.children) {
      sentence.children.map((child) => {
        if (tokenIndex <= tokenized_data.length - 1) {
          tokenized_data[tokenIndex].src = tokenized_data[tokenIndex].src.replace(/\s\s+/g, ' ');
          tokenized_data[tokenIndex].src = tokenized_data[tokenIndex].src.trim()
          if (child.children) {
            let child_elems = []
            child.children.map((ch) => {
              ch.dont_show = child.dont_show
              var text = ''
              if (ch.attrib !== 'SUPERSCRIPT') {
                text += ch.text
                let obj = this.makeSpanObjects(sentence, text, tokenized_data, tokenIndex, spanId, elems, ch)
                text = obj.text
                tokenized_data = obj.tokenized_data
                tokenIndex = obj.tokenIndex
                spanId = obj.spanId
                child = obj.child
                elems = obj.elems
              } else {
                let obj = this.makeSpanObjects(sentence, ch.text, tokenized_data, tokenIndex, spanId, elems, ch, true)
                // text = obj.text
                // tokenized_data = obj.tokenized_data
                // tokenIndex = obj.tokenIndex
                // spanId = obj.spanId
                // child = obj.child
                elems = obj.elems
              }
            })
          }
          else {
            var text = child.text
            let obj = this.makeSpanObjects(sentence, text, tokenized_data, tokenIndex, spanId, elems, child)
            text = obj.text
            tokenized_data = obj.tokenized_data
            tokenIndex = obj.tokenIndex
            spanId = obj.spanId
            child = obj.child
            elems = obj.elems
          }
        }
      })
    } else {
      let text = sentence.text.trim()
      let obj = this.makeSpanObjects(sentence, text, tokenized_data, tokenIndex, spanId, elems, sentence)
      text = obj.text
      tokenized_data = obj.tokenized_data
      tokenIndex = obj.tokenIndex
      spanId = obj.spanId
      sentence = obj.child
      // elems = obj.elems
      elems = obj.elems
    }

    return elems
  }

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
      fontFamily: sentence.font_family,
      textAlign: "justify",
      zIndex: this.props.paperType === "target" && this.props.hoveredSentence.split("_")[0] === sentence.block_id ? 2: 1,
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
          : ""
    };

    return this.props.paperType === "source" ? (
      <div>
        {this.props.tokenized && this.props.mergeButton === "save" && this.props.sentence.text && (
          <Checkbox
            size="small"
            style={{ top: sentence.text_top - 10 + "px", left: sentence.text_left - 50 + "px", position: "absolute", zIndex: 4 }}
            checked={arr.includes(sentence.block_id + "_" + this.props.page_no) ? true : false}
            onChange={this.handleChange(sentence.block_id + "_" + this.props.page_no)}
            // value={this.state[sentence.block_id + "_" + this.props.page_no]}
            color="primary"
          />
        )}
        <div
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
        </div>
        {!this.props.tokenized && this.props.hoveredSentence.split('_')[0] === this.props.sentence.block_id && this.renderLinesWithTokenizedData(sentence)}
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
    ) : (
        <div>{this.handleTargetUpdate(sentence, styles, this.props.tokenized)}</div>
      );
  }
}

export default DocumentBlock;

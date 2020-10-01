import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Switch from "@material-ui/core/Switch";
import Toolbar from "@material-ui/core/Toolbar";
import { translate } from "../../../../assets/localisation";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import IntractiveApi from "../../../../flux/actions/apis/intractive_translate";
import Dialog from "../../../components/web/common/SimpleDialog";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Check';
import { withStyles } from "@material-ui/core/styles";
import SaveFileIcon from "@material-ui/icons/Save";

const styles = {
  divs: {
    borderTopStyle: 'solid', 
    borderTop: "1px solid #D6D6D6", 
    padding: "2%",
    "&:hover": {
      backgroundColor: "#00000014"
    }
  }
};

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      tgt: "",
      checkedB: true,
      target: "",
      translateText: "",
      message: translate("intractive_translate.page.snackbar.message"),
      indexValue: 0,
      i: 0,
      apiToken: false,
      token: true, value: 0
    };
  }

  handleSuperSave(target, taggedTarget) {
    const splitValue = this.state.submittedId && this.state.submittedId.split("_");

    const temp = this.state.scriptSentence;
    let value = []
    if (this.props.superScriptToken) {
      this.state.scriptSentence.map((sentence, index) => {
        if (splitValue[0] === sentence._id) {
          temp[index].tokenized_sentences.map((sentence, i) => {
            if (sentence.sentence_index === Number(splitValue[1])) {
              (sentence.target = `${this.state.superIndex} ${target}`);
              (sentence.tagged_tgt = taggedTarget);
            }
            return true
          })
          value = temp[index];
        }
        return true;
      });
    }
    this.setState({ scriptSentence: temp, apiToken: true });
    return value;

  }



  handleApiCall() {
    const temp = this.handleSuperSave(this.state.checkedB ? this.state.target : this.state.translateText, this.state.taggedTarget);
    if (this.state.checkedB) {
      this.props.handleSave(
        this.state.target,
        this.state.indexValue,
        this.state.submittedId,
        this.state.sentenceIndex,

        this.state.keyValue,
        this.state.cellValue,
        this.handleCalc(this.state.target)
      );
      this.state.value !== 0 && this.handleSentence(this.state.value)
    } else if (this.props.superScriptToken && this.state.superIndex) {
      this.props.handleScriptSave(this.state.translateText, this.state.superIndex);
      this.props.hadleSentenceSave(false, temp);
      this.setState({ target: this.state.translateText })
    } else {
      this.props.handleSave(
        this.state.translateText,
        this.state.indexValue,
        this.state.submittedId,
        this.state.sentenceIndex,
        this.state.keyValue,
        this.state.cellValue,
        this.handleCalc(this.state.translateText)
      );

      this.setState({ target: this.state.value === 0 ? this.state.translateText : this.state.target, value: 0, apiToken: false })
      this.state.value !== 0 && this.handleSentence(this.state.value)

    }
    this.setState({
      targetDialog: this.state.checkedB ? this.state.target : this.state.translateText, value: 0, apiToken: false
    })
  }

  handleSwitchChange = () => {
    this.setState({ checkedB: !this.state.checkedB, sentences: [] });
  };

  handleSuperScript() {
    const splitValue = this.state.submittedId && this.state.submittedId.split("_");

    if (this.state.scriptSentence && Array.isArray(this.state.scriptSentence) && this.state.scriptSentence.length > 0) {
      this.state.scriptSentence.map((sentence, index) => {
        if (splitValue[0] === sentence._id) {
          const temp = sentence.tokenized_sentences[splitValue[1]];
          this.setState({
            clickedSentence: false,
            target: temp.target ? temp.target.substr(temp.target.indexOf(" ") + 1) : "",
            targetDialog: temp.target ? temp.target.substr(temp.target.indexOf(" ") + 1) : "",
            source: temp.src,
            superIndex: temp.target ? temp.target.substr(0, temp.target.indexOf(" ")) : "",
            taggedSource: temp.tagged_src,
            taggedTarget: temp.tagged_tgt,
            translateText: "",
            checkedB: true
          });
        }
        return true;
      });
    }
  }

  handleClose() {
    this.setState({
      open: false
    })
    this.handleSentence(this.state.value)
  }

  handleDialogSave() {
    this.setState({
      open: false
    })
    this.handleApiCall()
  }


  handleDialog(value) {
    if ((this.state.targetDialog !== this.state.target || (this.state.target !== this.state.translateText && !this.state.checkedB && this.state.translateText)) && value !== 0 && this.state.target) {
      this.setState({ open: true, value })
    }
    else {
      this.handleSentence(value)
    }

  }
  handleSentence(value) {
    const splitValue = this.state.submittedId && this.state.submittedId.split("_");
    this.props.sentences &&
      this.props.sentences.length > 0 &&
      this.props.sentences.map((sentence, index) => {
        if (splitValue[0] === sentence._id) {
          let sentenceIndex;

          if (sentence.tokenized_sentences && Array.isArray(sentence.tokenized_sentences) && sentence.tokenized_sentences.length > 0) {
            sentence.tokenized_sentences.map((sentence, i) => {
              if (sentence.sentence_index === Number(splitValue[1])) {
                sentenceIndex = i;
              }
              return true
            })
          }
          if (
            (sentence.tokenized_sentences.length === 1 && sentenceIndex === 0) ||
            (sentenceIndex === 0 && value === -1) ||
            (sentenceIndex === sentence.tokenized_sentences.length - 1 && value > 0)
          ) {
            if (this.props.sentences[index + value].is_footer && this.props.sentences.length >= index + 1 + 2 * value) {
              value = 2 * value;
            }
            const val = `${this.props.sentences[index + value]._id}_${this.props.sentences[index + value].tokenized_sentences[0].sentence_index}`;

            !this.state.clickedSentence && this.props.handleSenetenceOnClick(val, false, null, null, value === 0 ? null : true);

            if (this.props.sentences[index + value].is_table && value !== 0) {
              const blockId = `${this.props.sentences[index + value]._id}_${this.props.sentences[index + value].table_items[0][0].sentence_index}`;
              this.props.handleCellOnClick(
                this.props.sentences[index + value]._id,
                blockId,
                this.props.sentences[index + value].table_items[0][0],
                "true",
                null,
                null,
                value === 0 ? null : true
              );
            }
            this.setState({
              target: this.props.sentences[index + value].tokenized_sentences[0].target,
              targetDialog: this.props.sentences[index + value].tokenized_sentences[0].target,
              source: this.props.sentences[index + value].tokenized_sentences[0].src,
              taggedSource: this.props.sentences[index + value].tokenized_sentences[0].tagged_src,
              taggedTarget: this.props.sentences[index + value].tokenized_sentences[0].tagged_tgt,
              translateText: "",
              indexValue: index + value,
              clickedSentence: false,
              keyValue: "",
              cellValue: "",
              sentenceIndex,
              checkedB: true
            });
          } else if (sentence.tokenized_sentences.length >= sentenceIndex && sentenceIndex >= 0) {
            const ind = sentenceIndex + value;
            const val = `${this.props.sentences[index]._id}_${this.props.sentences[index].tokenized_sentences[ind].sentence_index}`;
            !this.state.clickedSentence && this.props.handleSenetenceOnClick(val, false, null, null,value === 0 ? null : true);
            if (sentence.is_table) {
              for (const key in sentence.table_items) {
                for (const cell in sentence.table_items[key]) {
                  if (sentence.table_items[key][cell].sentence_index === sentence.tokenized_sentences[ind].sentence_index) {
                    const blockId = `${sentence._id}_${sentence.table_items[key][cell].sentence_index}`;
                    this.props.handleCellOnClick(sentence._id, blockId, sentence.table_items[key][cell], "true", null, null,value === 0 ? null : true);
                    this.setState({ keyValue: key, cellValue: cell, checkedB: true });
                  }
                }
              }
            }
            this.setState({
              target: this.props.sentences[index].tokenized_sentences[ind].target,
              source: this.props.sentences[index].tokenized_sentences[ind].src,
              targetDialog: this.props.sentences[index].tokenized_sentences[ind].target,
              taggedSource: this.props.sentences[index].tokenized_sentences[ind].tagged_src,
              taggedTarget: this.props.sentences[index].tokenized_sentences[ind].tagged_tgt,
              token: false,
              translateText: "",
              indexValue: index,
              clickedSentence: false,
              checkedB: true,
              sentenceIndex
            });
          }
        }

        return true;
      });
    this.props.superScriptToken && this.handleSuperScript();
  }

  handleTextSelectChange(event) {
    this.setState({ translateText: event.target.value });
  }

  handleSubmit() {
    let res = "";
    const { APITransport } = this.props;
    if (this.state.translateText) {
      res = this.handleCalc(this.state.translateText);
    }
    const apiObj = new IntractiveApi(this.state.source, res, this.props.modelDetails, true);
    if (this.state.source && res && !this.state.apiCall) {
      APITransport(apiObj);
      this.setState({ apiCall: true })
    }
  }

  componentDidUpdate(prevProps) {

    if (prevProps.sentences !== this.props.sentences) {
      this.setState({ target: '' })
    }
    if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      
        if(this.state.translateText && this.state.prevTarget && this.state.prevTarget!==this.state.translateText){
          const apiObj = new IntractiveApi(this.state.source, this.handleCalc(this.state.translateText), this.props.modelDetails, true);
          this.props.APITransport(apiObj);
          this.setState({prevTarget:this.state.translateText})
        }
        else{
          this.setState({apiCall:false})
        }
      if (this.state.apiToken) {
        
        if (this.props.superScriptToken && this.state.superIndex) {
          this.props.handleScriptSave(
            this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0],
            this.state.superIndex
          );
          const temp =
            this.props.intractiveTrans &&
            this.props.intractiveTrans.length > 0 &&
            this.handleSuperSave(this.props.intractiveTrans[0].tgt, this.props.intractiveTrans[0].tagged_tgt);

          this.props.hadleSentenceSave(false, temp);
        } else {
          this.props.handleSave(
            this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0],
            this.state.indexValue,
            this.state.submittedId,
            this.state.sentenceIndex,

            this.state.keyValue,
            this.state.cellValue,

          );
          this.state.value !== 0 && this.handleSentence(this.state.value)
        }
        this.setState({
          targetDialog: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tgt, value: 0
        })
      }
      this.setState({
        disable: false,
        token: false,
        apiToken: false,
        
        target: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tgt,
        taggedSource: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_src,
        taggedTarget: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_tgt
      });
      // this.focusDiv("focus");
    }
    if (prevProps.clickedCell !== this.props.clickedCell) {
      this.setState({
        target: this.props.clickedCell.target,
        taggedSource: this.props.clickedCell.tagged_src,
        taggedTarget: this.props.clickedCell.tagged_tgt
      });
    }
    if (prevProps.submittedId !== this.props.submittedId) {
      this.handleSentence(0);
    }
  }

  focusDiv(val) {
    if (val === "focus") {
      this.textInput.focus();
    } else {
      this.textInput.blur();
    }
  }

  handleCalc(value) {
    const temp = value.split(" ");
    const tagged_tgt = this.state.taggedTarget.split(" ");
    const tagged_src = this.state.taggedSource.split(" ");
    const tgt = this.state.target && this.state.target.split(" ");
    const src = this.state.source && this.state.source.split(" ");
    const resultArray = [];
    let index;
    temp.map(item => {
      if (item !== " ") {
        const ind = tgt.indexOf(item, resultArray.length);
        const arr = [item, `${item},`, `${item}.`];
        let src_ind = -1;
        arr.map((el, i) => {
          if (src_ind === -1) {
            src_ind = src.indexOf(el);
            index = i;
          }
          return true;
        });
        if (ind !== -1) {
          resultArray.push(tagged_tgt[ind]);
        } else if (src_ind !== -1) {
          if (index > 0) {
            if (src_ind > tagged_src.length - 1) {
              src_ind = tagged_src.length - 1
            }
            const tem = tagged_src[src_ind];
            resultArray.push(tem.slice(0, tem.length - 1));
          } else {
            resultArray.push(tagged_src[src_ind]);
          }
        } else {
          resultArray.push(item);
        }
      } else {
        resultArray.push(item);
      }
      return true;
    });
    return resultArray.join(" ");
  }

  keyPress(event) {
    if (event.keyCode === 9 && this.state.checkedB) {
      if (this.state.disable && this.state.translateText) {
        const apiObj = new IntractiveApi(this.state.source, this.handleCalc(event.target.value), this.props.modelDetails, true);
        !this.state.apiCall && this.props.APITransport(apiObj);
        this.setState({ disable: false, apiCall: true });
      } else {
        let temp;
        const prefix = this.state.target && this.state.target.split(" ");
        const translate = this.state.translateText && this.state.translateText.split(" ");

        const result = translate && translate.filter(value => value !== "");
        if (prefix && result && prefix.length > result.length) {
          if (result[result.length - 1] !== " ") {
            result.push(prefix[result.length]);
          } else {
            result[result.length - 1] = prefix[result.length];
          }

          temp = result.join(" ");
          event.preventDefault();
        } else if (prefix && !result) {
          temp = prefix[0];
          event.preventDefault();
        }
        this.setState({
          translateText: temp,
          disable: false
        });
      }
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.submittedId !== nextProps.submittedId) {
      return {
        sentenceId: nextProps.sentenceId,
        blockData: nextProps.blockData,
        blockIndex: nextProps.blockIndex,
        submittedId: nextProps.submittedId,
        clickedSentence: nextProps.clickedSentence,
        sentences: nextProps.sentences
      };
    }
    if (prevState.scriptSentence !== nextProps.scriptSentence) {
      return {
        scriptSentence: nextProps.scriptSentence
      };
    }
    return null;
  }

  handleTextChange(key, event) {
    const space = event.target.value.endsWith(" ");
    if (this.state.target && space) {
      if (this.state.target.startsWith(event.target.value) && this.state.target.includes(event.target.value, 0)) {
      } else if (!this.state.apiCall) {
        const res = this.handleCalc(event.target.value);
        const apiObj = new IntractiveApi(this.state.source, res, this.props.modelDetails, true);
        this.props.APITransport(apiObj);

        // this.focusDiv("blur");
        this.setState({
          disable: true,
          apiCall: true,
          prevTarget: event.target.value 
        });
      }
    }

    if (!event.target.value) {
      this.setState({ target: this.state.targetDialog })
    }
    this.setState({
      [key]: event.target.value,
      disable: true
    });
  }

  render() {
    const { classes } = this.props
    return (
      <Paper elevation={2} style={{ height: '98%', padding: "4.7px 0px", borderColor: "#D6D6D6" }}>
        <Toolbar>
          <Typography value="" variant="h6" gutterBottom style={{ flex: 1, paddingTop: "10px" }}>
            {this.state.checkedB ? translate('dashbord.page.title.anuvaadModel') : "Recommended Sentence"}
          </Typography>
          {this.state.checkedB ? (this.state.apiCall || this.state.api) ? <div style={{
    position: 'relative'}}>
          <Button
            variant="contained"
            color="primary"
            
            disabled={this.state.apiCall}
            onClick={this.handleButtonClick}
          >
            Tab disabled
          </Button>
            <CircularProgress size={24} style={{
              color: '#238427',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -12,
              marginLeft: -12,
            }} />
          </div> : this.state.translateText && <Fab size="small" style={{ background: '#238427', color: 'white' }}>
            <SaveIcon />
          </Fab> :

            <Button size="small" color="primary" onClick={event => {
              this.setState({ tag: true, translateText: this.state.target });
              setTimeout(() => {
                this.setState({ tag: false });
              }, 3000);
            }}>
              {this.state.tag ? "copied" : "copy"}&nbsp;
</Button>

          }
        </Toolbar>
        <Typography value="" variant="h6" gutterBottom />
        <div>
          <textarea
            style={{
              width: "87%",
              resize: "none",
              margin: "10px 10px 10px 4%",
              padding: "15px",
              height: "23vh",
              fontFamily: '"Source Sans Pro", "Arial", sans-serif',
              fontSize: "18px",
              borderRadius: "4px",
              backgroundColor: "#F4FDFF",
              borderColor: "#1C9AB7",
              color: "#000000"
            }}
            className="noter-text-area"
            rows="10"
            disabled
            value={this.state.target}
            placeholder={translate('intractive_translate.page.textarea.anuvaadModelPlaceholder')}
            cols="50"
            onChange={event => {
              this.handleTextSelectChange(event);
            }}
          />
        </div>

        <Toolbar>
          <Typography value="" variant="h6" gutterBottom style={{ flex: 1, paddingTop: "10px" }}>
            {this.state.checkedB ? translate('intractive_translate.page.main.title') : "Manual Translate"}
          </Typography>
          <Switch
            checked={this.state.checkedB}
            onChange={() => {
              this.handleSwitchChange();
            }}
            value="checkedB"
            color="primary"
          />
        </Toolbar>

        <div>
          <textarea
            style={{
              width: "87%",
              resize: "none",
              margin: "10px 10px 4% 4%",
              padding: "15px",
              height: "23vh",
              fontFamily: '"Source Sans Pro", "Arial", sans-serif',
              fontSize: "18px",
              borderRadius: "4px"
            }}
            className="noter-text-area"
            rows="10"
            value={this.state.translateText}
            ref={textarea => {
              this.textInput = textarea;
            }}
            placeholder={
              this.state.checkedB
                ? translate('intractive_translate.page.textarea.targetPlaceholder')
                : translate('intractive_translate.page.textarea.updateManuallyPlaceholder')
            }
            cols="50"
            onChange={event => {
              this.state.checkedB ? this.handleTextChange("translateText", event) : this.handleTextSelectChange(event);
            }}
            onKeyDown={this.keyPress.bind(this)}
          />
        </div>

        {/* <div style={{display: 'flex', flexDirection: 'row', borderStyle: 'solid', border: "1px solid #D6D6D6"}}>
          <div style={{color: 'blue', width: '50%', borderColor: 'red'}}>
            <Button color="primary" style={{width:"100%"}}>Test1</Button>
          </div>
          <div style={{color: 'red', width: '50%'}}>
            Test
          </div>
        </div> */}

        <Grid container style={{ border: "1px solid #D6D6D6", borderColor: "#D6D6D6" }}>
          <Grid item xs={4} sm={4} lg={4} xl={4} className={classes.divs}>
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ textAlign: 'center', color: "#233466" }} onClick={event => {
              this.handleDialog(-1);
            }}>
              <ChevronLeftIcon size="large" style={{ color: "#233466" }} />
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Typography
                style={{ width: "100%", color: "#233466", textAlign: "center" }}
                color="primary"
                
              >
                {" "}

              &nbsp;{translate('common.page.label.previousLine')}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} sm={4} lg={4} xl={4} className={classes.divs} style={{ borderLeftStyle: 'solid', borderLeft: "1px solid #D6D6D6" }}>
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ textAlign: 'center', color: "#1C9AB7" }} onClick={event => {
              this.handleApiCall();
            }}>
              <SaveFileIcon size="small" style={{ color: "#1C9AB7" }} />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Typography
                style={{ width: "100%", color: "#1C9AB7", textAlign: "center" }}
                color="primary"
                onClick={event => {
                  this.handleApiCall();
                }}
              >
                {" "}
              &nbsp;{translate('common.page.button.save')}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={4} sm={4} lg={4} xl={4} className={classes.divs} style={{ borderLeftStyle: 'solid', borderLeft: "1px solid #D6D6D6"}}>
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ textAlign: 'center', color: "#1C9AB7" }} onClick={event => {
              this.handleDialog(1);
            }}>
              <ChevronRightIcon size="large" style={{ color: "#233466" }}/>{" "}
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Typography
                color="primary"
                
                onClick={event => {
                  this.handleDialog(1);
                }}
                style={{ width: "100%", color: "#233466", textAlign: "center"  }}
              >
                {translate('common.page.label.nextLine')}&nbsp;
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {this.state.open && <Dialog message="Do you want to save the changes ? " handleSubmit={this.handleDialogSave.bind(this)} handleClose={this.handleClose.bind(this)} open={true} title="Save" status={this.state.value} />}
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  intractiveTrans: state.intractiveTrans
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      NMTApi: APITransport,
      NMTSPApi: APITransport,
      MODELApi: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Editor)));

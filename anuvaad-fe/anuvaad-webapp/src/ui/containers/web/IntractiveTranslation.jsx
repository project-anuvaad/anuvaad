import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import Select from "../../components/web/common/Select";
// import SimpleSelect from "../../components/web/common/SimpleSelect";
import IntractiveApi from "../../../flux/actions/apis/intractive_translate";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import NewOrders from "../../components/web/dashboard/NewOrders";
import { translate } from "../../../assets/localisation";
import Snackbar from "../../components/web/common/Snackbar";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'center',
    alignItems: 'center'
  },
  paper: {
    width: "40%",
    marginTop: "3%",
    marginBottom: "8%",
    padding: '3%'
  },
  button1: {
    width: "95%", borderRadius: "20px 20px 20px 20px", height: '46px'
  },
  label: {
    textAlign: 'left', marginTop: 'auto', marginBottom: 'auto'
  },
  rowData: {
    display: 'flex', flexDirection: 'row', marginTop: '3%'
  },
  typographyHeader: {
    fontfamily: 'sans-serif',
    color: '#003366',
    fontWeight: '549', textAlign: 'center', paddingBottom: "12px", paddingTop: "5%"


  },
  grid: {
    marginTop: "3%"
  }
}

class IntractiveTrans extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      text: "",
      edit: false,
      apiCalled: false,
      autoMlText: "",
      nmtText: [],
      tocken: false,
      source: "",
      target: "",
      update: false,
      modelLanguage: [],
      language: [],
      disable: false,
      key: false,
      model: [],
      open: false,
      submit: false,
      message: translate("intractive_translate.page.snackbar.message")
    };
  }

  componentDidMount() {
    this.setState({
      autoMlText: "",
      nmtText: []
    });

    const { APITransport } = this.props;
    const apiObj = new FetchLanguage();
    APITransport(apiObj);
    this.setState({ showLoader: true });
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      this.setState({
        nmtText: this.props.intractiveTrans,
        disable: false
      });
      if (this.state.edit) {
        this.focusDiv("focus");
      }
      if (this.state.submit) {
        this.setState({
          open: true
        });
        setTimeout(() => {
          this.setState({
            open: false,
            submit: false
          });
        }, 3000);
      }
    }

    if (prevProps.supportLanguage !== this.props.supportLanguage) {
      this.setState({
        language: this.props.supportLanguage
      });
    }

    if (prevProps.langModel !== this.props.langModel) {
      this.setState({
        modelLanguage: this.props.langModel
      });
    }
  }

  focusDiv(val) {
    if (val === "focus") {
      this.textInput.focus();
    } else {
      this.textInput.blur();
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  // Tab press will append next word into textarea
  keyPress(event) {
    if (event.keyCode === 9) {
      if (this.state.disable && this.state.translateText) {
        const apiObj = new IntractiveApi(this.state.text, this.handleCalc(event.target.value), this.state.model[0]);
        this.props.APITransport(apiObj);
        this.setState({ disable: false });
      } else {
        let temp;
        const prefix = this.state.nmtText[0] && this.state.nmtText[0].tgt.split(" ");
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

  handleCalc(value) {
    const temp = value.split(" ");
    const tagged_tgt = this.state.nmtText[0].tagged_tgt.split(" ");
    const tagged_src = this.state.nmtText[0].tagged_src.split(" ");
    const tgt = this.state.nmtText[0].tgt.split(" ");
    const src = this.state.text && this.state.text.split(" ");
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

  handleTextChange(key, event) {
    const space = event.target.value.endsWith(" ");
    if (this.state.nmtText[0] && space) {
      if (this.state.nmtText[0].tgt.startsWith(event.target.value) && this.state.nmtText[0].tgt.includes(event.target.value, 0)) {
      } else {
        const res = this.handleCalc(event.target.value);
        const apiObj = new IntractiveApi(this.state.text, res, this.state.model[0]);
        this.props.APITransport(apiObj);
        this.focusDiv("blur");
        this.setState({
          disable: true
        });
      }
    }

    if (!event.target.value && this.state.edit) {
      const apiObj = new IntractiveApi(this.state.text, event.target.value, this.state.model[0]);
      this.props.APITransport(apiObj);
      this.focusDiv("blur");
    }
    this.setState({
      [key]: event.target.value,
      disable: true
    });
  }

  handleClear() {
    this.setState({
      text: "",
      nmtText: "",
      source: "",
      target: "",
      translateText: "",
      model: [],
      update: false,
      edit: false,
      submit: false
    });
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value, model: [] });
  };

  // Source language
  handleSource(modelLanguage, supportLanguage) {
    const result = [];
    modelLanguage.map(
      item =>
        item.interactive_end_point && supportLanguage.map(value => (item.source_language_code === value.language_code ? result.push(value) : null))
    );
    const value = new Set(result);
    const source_language = [...value];
    return source_language;
  }

  // Target language
  handleTarget(modelLanguage, supportLanguage, sourceLanguage) {
    const result = [];
    modelLanguage.map(item => {
      item.source_language_code === sourceLanguage &&
        item.interactive_end_point &&
        supportLanguage.map(value => (item.target_language_code === value.language_code ? result.push(value) : null));
      return true;
    });
    const value = new Set(result);
    const target_language = [...value];
    return target_language;
  }

  handleSubmit() {
    const model = [];
    let res = "";
    const { APITransport } = this.props;
    this.state.modelLanguage.map(item =>
      item.target_language_code === this.state.target &&
        item.source_language_code === this.state.source &&
        model.length < 1 &&
        item.interactive_end_point === "interactive-translation"
        ? model.push(item)
        : []
    );
    if (this.state.translateText) {
      res = this.handleCalc(this.state.translateText);
    }
    const apiObj = new IntractiveApi(this.state.text, res, model[0]);
    if (this.state.text && this.state.source && this.state.target) {
      if (!this.state.update && !this.state.edit) {
        APITransport(apiObj);
        this.setState({
          autoMlText: "",
          nmtText: "",
          apiCalled: true,
          model,
          update: true
        });
      } else if (this.state.update && !this.state.edit) {
        this.setState({
          edit: true,
          update: false
        });
      } else if (this.state.edit) {
        this.setState({
          submit: true
        });

        APITransport(apiObj);
      }
    } else {
      alert(translate("common.page.label.pageWarning"));
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.typographyHeader}>
          {translate("intractive_translate.page.main.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={24}>
            {!this.state.edit &&
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.rowData} style={{ marginTop: "0%" }}>
                <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.label}>
                  <Typography value="" variant="title">
                    {translate("common.page.label.sourceLang")}{" "}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} lg={4} xl={4}>
                  <Select
                    id="outlined-age-simple"
                    selectValue="language_code"
                    MenuItemValues={this.state.modelLanguage.length > 0 && this.handleSource(this.state.modelLanguage, this.state.language)}
                    // MenuItemValues={["English"]}
                    handleChange={this.handleSelectChange}
                    value={this.state.source}
                    name="source"
                    style={{
                      width: '92%',
                      fullWidth: true,
                      display: "flex",
                      wrap: "nowrap",
                      // height: '40px',
                      magin: 'dense',
                      float: 'right'
                    }}
                  />
                </Grid>
              </Grid>}
            {!this.state.edit &&
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.rowData}>
                <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.label}>
                  <Typography value="" variant="title">
                    {translate("common.page.label.targetLang")}{" "}
                  </Typography>
                </Grid>

                <Grid item xs={6} sm={6} lg={4} xl={4}>
                  <Select
                    id="outlined-age-simple"
                    selectValue="language_code"
                    MenuItemValues={this.state.source && this.state.modelLanguage ? this.handleTarget(this.state.modelLanguage, this.state.language, this.state.source) : []}
                    handleChange={this.handleSelectChange}
                    value={this.state.target}
                    name="target"
                    style={{
                      width: '92%',
                      fullWidth: true,
                      display: "flex",
                      wrap: "nowrap",
                      // height: '40px',
                      magin: 'dense',
                      float: 'right'
                    }}
                  />
                </Grid>
              </Grid>
            }

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid} >
              <textarea
                id="standard-multiline-static"
                style={{ padding: "1%", height: '100px', fontFamily: '"Source Sans Pro", "Arial", sans-serif', fontSize: "21px", width: '98%', borderRadius: '4px' }}
                className="noter-text-area"
                rows="3"
                value={this.state.text}
                disabled={this.state.update || this.state.edit}
                placeholder={translate("intractive_translate.page.textarea.sourcePlaceholder")}
                // cols="50"
                onChange={event => {
                  this.handleTextChange("text", event);
                }}
              />
            </Grid>

            {this.state.edit && (
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <textarea
                  style={{ padding: "1%", height: '100px', fontFamily: '"Source Sans Pro", "Arial", sans-serif', fontSize: "21px", width: '98%', borderRadius: '4px' }}
                  className="noter-text-area"
                      rows="3"
                      ref={textarea => {
                        this.textInput = textarea;
                      }}
                      // disabled={this.state.disable}
                      value={this.state.translateText}
                      placeholder={translate("intractive_translate.page.textarea.targetPlaceholder")}
                      cols="50"
                      onKeyDown={this.keyPress.bind(this)}
                      onChange={event => {
                        this.handleTextChange("translateText", event);
                      }}
                />
              </Grid>
            )}
            {this.state.nmtText[0] && (
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <NewOrders title={translate("dashbord.page.title.anuvaadModel")} isSubWordsNotRequired={true} data={this.state.nmtText} value={true} />
              </Grid>
            )}

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid} style={{ display: 'flex', flexDirection: 'row' }}>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'left' }}>
                <Button
                  variant="contained"
                  onClick={this.handleClear.bind(this)}
                  aria-label="edit"
                  className={classes.button1}
                  color='primary'
                
                >
                  {translate("common.page.button.clear")}
                </Button>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'right' }}>
                <Button
                  className={classes.button1}
                  variant="contained"
                  onClick={this.handleSubmit.bind(this)}
                  aria-label="edit"
                  color='primary'
                >
                  {this.state.update && this.state.nmtText[0] ? translate("common.page.title.edit") : translate("common.page.button.submit")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
            variant="success"
            message={this.state.message}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  automl: state.automl,
  nmt: state.nmt,
  nmtsp: state.nmtsp,
  intractiveTrans: state.intractiveTrans,
  supportLanguage: state.supportLanguage,
  langModel: state.langModel
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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IntractiveTrans)));

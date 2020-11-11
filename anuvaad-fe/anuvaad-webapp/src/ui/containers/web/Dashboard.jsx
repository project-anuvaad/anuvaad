import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TranslateSentence from "../../components/web/dashboard/TranslateSentence";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import NMT from "../../../flux/actions/apis/nmt";
import AutoML from "../../../flux/actions/apis/auto_ml";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import NewOrders from "../../components/web/dashboard/NewOrders";
import { translate } from "../../../assets/localisation";
import { withStyles } from "@material-ui/core/styles";
import DashboardStyles from "../../styles/web/DashboardStyles";
import InteractiveTranslateAPI from "../../../flux/actions/apis/intractive_translate";
import FormControl from '@material-ui/core/FormControl';

const { v4 }        = require('uuid');
const LANG_MODEL  = require('../../../utils/language.model')

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      apiCalled: false,
      autoMlText: "",
      nmtText: [],
      nmtTextSP: [],
      tocken: false,
      source_language_code: '',
      target_language_code: '',
      source_languages: [],
      target_languages: [],
      modelLanguage: [],
      language: [],
      model: [],
      checkedMachine: false,
      checkedSubwords: false,
      showSplitted: false
    };
  }

  componentDidMount() {
    this.setState({
      autoMlText: "",
      nmtText: [],
      nmtTextSP: []
    });

    if (this.props.fetch_languages && this.props.fetch_languages.languages.length < 1) {
      const { APITransport }  = this.props;
      const apiObj            = new FetchLanguage();
      APITransport(apiObj);
      this.setState({ showLoader: true });
    }

    if (this.props.fetch_models && this.props.fetch_models.models.length < 1) {
      const { APITransport }  = this.props;
      const apiModel          = new FetchModel();
      APITransport(apiModel);
      this.setState({ showLoader: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetch_languages.languages != this.props.fetch_languages.languages) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_languages.languages),
        target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_languages.languages)
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSelectModelChange = event => {
    this.setState({ model: event.target.value });
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value, model: [] });
  };

  handleSource(modelLanguage, supportLanguage) {
    const result = [];
    modelLanguage.map(item => supportLanguage.map(value => (item.source_language_code === value.language_code ? result.push(value) : null)));
    const value = new Set(result);
    const source_language = [...value];
    return source_language;
  }

  handleTarget(modelLanguage, supportLanguage, sourceLanguage) {
    const result = [];
    modelLanguage.map(item => {
      item.source_language_code === sourceLanguage &&
        supportLanguage.map(value => (item.target_language_code === value.language_code ? result.push(value) : null));
      return true;
    });
    const value = new Set(result);
    const target_language = [...value];
    return target_language;
  }

  handleModel(modelLanguage, source, target) {
    const result = [];
    modelLanguage.map(item => {
      item.source_language_code === source && item.target_language_code === target && result.push(item);
      return true;
    });
    return result;
  }

  handleDelete = data => () => {
    this.setState(state => {
      const chipData = [...state.model];
      const chipToDelete = chipData.indexOf(data);
      chipData.splice(chipToDelete, 1);
      this.setState({ model: chipData });
    });
  };

  handleSubmit(role) {
    console.log('submit pressed: %s %s %s', this.state.target_language_code, this.state.source_language_code, this.state.text)
    let modelId = LANG_MODEL.get_model_details(this.props.fetch_languages.languages, this.state.source_language_code, this.state.target_language_code)
    this.makeAPICallInteractiveTranslation(this.state.text, modelId)
  }

  handleClear() {

  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value})
    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_languages.languages, this.props.fetch_models.models, event.target.value)
    this.setState({
      target_languages: languages
    })
  }

  processTargetLanguageSelected = (event) => {
    this.setState({ target_language_code: event.target.value})
  }

  /**
   * api calls
   */
  async makeAPICallAutoML() {

  }

  async makeAPICallInteractiveTranslation(text, modelId) {
    let apiObj = new InteractiveTranslateAPI(text, '', modelId, true, '', v4());
    const apiReq    = fetch(apiObj.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers
    }).then(async response => {
        const rsp_data = await response.json();
        if (!response.ok) {
            return Promise.reject('');
        } else {
            this.setState({
                suggestions: rsp_data.output.predictions[0].tgt.map(s => { return {name: s}}),
                nmtText: rsp_data.output.predictions[0].tgt
            })
        }
    }).catch((error) => {
        this.setState({
            suggestions: []
        })
    });
  }

  renderSourceLanguagesItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ marginTop: "0%" }}>
          <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
            <Typography value="" variant="h5">
              {translate("common.page.label.sourceLang")}{" "}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={6} lg={4} xl={4} >
            <FormControl variant="outlined" className={this.props.classes.select}>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={this.processSourceLanguageSelected}
                value={this.state.source_language_code}
                style={{
                  fullWidth: true,
                  float: 'right'
                }}
              >
              {
                this.state.source_languages.map(lang => 
                <MenuItem key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
              }
              </Select>
            </FormControl>
          </Grid>
      </Grid>
    )
  }

  renderTargetLanguagesItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography value="" variant="h5">
            {translate("common.page.label.targetLang")}&nbsp;
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} lg={4} xl={4}>
          <FormControl variant="outlined" className={this.props.classes.select}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={this.state.target}
              onChange={this.processTargetLanguageSelected}
              value={this.state.target_language_code}
              style={{
                fullWidth: true,
                float: 'right'
              }}
            >
              {
                this.state.target_languages.map(lang => 
                  <MenuItem key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
                }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  render() {
    const role = JSON.parse(localStorage.getItem("roles"));
    const { classes } = this.props;
    let gridSizeLarge = role.includes("dev") ? 4 : 12
    let gridSizeSmall = role.includes("dev") ? 6 : 12

    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.typographyHeader}>
          {translate("dashboard.page.heading.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Grid container >
            
            {this.renderSourceLanguagesItems()}

            {this.renderTargetLanguagesItems()}


            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
              <textarea
                id="standard-multiline-static"
                style={{ padding: "1%", height: '100px', fontFamily: '"Source Sans Pro", "Arial", sans-serif', fontSize: "21px", width: '97.8%', borderRadius: '4px' }}
                className="noter-text-area"
                rows="3"
                value={this.state.text}
                disabled={this.state.update || this.state.edit}
                placeholder={translate("dashboard.page.alternatetext.enterTextHere")}
                // cols="50"
                onChange={event => {
                  this.handleTextChange("text", event);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row' }}>
              <Grid item xs={gridSizeSmall} sm={gridSizeSmall} lg={gridSizeLarge} xl={gridSizeLarge} style={{ textAlign: 'left', paddingLeft: '0px' }}>
                <FormControlLabel
                  style={{ marginLeft: "0%", textAlign: 'left' }}
                  control={
                    <Checkbox
                      color="default"
                      checked={this.state.checkedMachine}
                      value="checkedMachine"
                      onChange={this.handleChange("checkedMachine")}
                    />
                  }
                  label={translate("dashboard.page.checkbox.mt")}
                />
              </Grid>

            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleClear.bind(this)}
                aria-label="edit"
                className={classes.button1}
              >
                {translate("common.page.button.clear")}
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleSubmit.bind(this, role)}
                aria-label="edit"
                className={classes.button1}
              >
                {translate("common.page.button.submit")}
              </Button>
            </Grid>
            {/* </div> */}
            {this.state.nmtText[0] && (
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <NewOrders title={translate("dashbord.page.title.anuvaadModel")} data={this.state.nmtText} status={this.state.checkedSubwords} isSubWordsNotRequired={!this.state.checkedSubwords} />
              </Grid>
            )}
            {this.state.checkedMachine && this.state.autoMlText && this.state.nmtText && (
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <TranslateSentence title={translate("dashboard.page.checkbox.mt")} data={this.state.autoMlText} />
              </Grid>
            )}
          </Grid>
        </Paper>
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
  fetch_languages: state.fetch_languages,
  fetch_models: state.fetch_models
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

export default withRouter(
  withStyles(DashboardStyles)(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)));

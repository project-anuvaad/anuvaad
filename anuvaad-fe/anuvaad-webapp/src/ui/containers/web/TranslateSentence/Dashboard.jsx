import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { withStyles } from "@material-ui/core/styles";

import FetchModel from "../../../../flux/actions/apis/common/fetchmodel";
import AutoML from "../../../../flux/actions/apis/dashboard/auto_ml";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../assets/localisation";
import DashboardStyles from "../../../styles/web/DashboardStyles";
import InstantTranslateAPI from "../../../../flux/actions/apis/translate_sentence/instant_translate";

const { v4 } = require('uuid');
const LANG_MODEL = require('../../../../utils/language.model')

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      anuvaadText: '',
      anuvaadAPIInProgress: false,
      autoMLText: '',
      autoMLChecked: false,
      autoMLAPIInProgress: false,
      source_language_code: '',
      target_language_code: '',
      source_languages: [],
      target_languages: [],
      showStatus: false,
      message: null,
      dialogMessage: null,
      modelName: ''
    };
    this.processTranslateButtonPressed = this.processTranslateButtonPressed.bind(this);
    this.processClearButtonPressed = this.processClearButtonPressed.bind(this);
    this.processAutoMLCheckboxClicked = this.processAutoMLCheckboxClicked.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  componentDidMount() {

    const { APITransport } = this.props;
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({ showLoader: true });

  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetch_models.models != this.props.fetch_models.models) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
        target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true)
      })
    }
  }

  processClearButtonPressed() {
    this.setState({
      text: '',
      target_language_code: '',
      source_language_code: '',
      anuvaadText: ""
    })
  }

  processAutoMLCheckboxClicked() {
    this.setState({ autoMLChecked: !this.state.autoMLChecked });
  };

  handleTextChange(key, event) {
    this.setState({
      text: event.target.value
    });
  }

  renderProgressInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={this.state.showStatus}
        message={this.state.message}
      >
        <Alert elevation={6} variant="filled" severity="info">{this.state.message}</Alert>
      </Snackbar>
    )
  }

  renderStatusInformation = () => {
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={true}
          autoHideDuration={3000}
          variant={"error"}
          message={this.state.dialogMessage}
          onClose={() => this.setState({ dialogMessage: null })}
        >
          <Alert elevation={6} variant="filled" severity="error">{this.state.dialogMessage}</Alert>
        </Snackbar>
      </div>
    )
  }

  processTranslateButtonPressed() {
    this.setState({ showStatus: true, message: "Fetching translation..." })
    let userModel = JSON.parse(localStorage.getItem("userProfile"))
    let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, this.state.target_language_code, userModel.models)

    this.makeAPICallInteractiveTranslation(this.state.text, modelId)
    // this.makeAPICallAutoML(this.state.text, this.state.source_language_code, this.state.target_language_code)
  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value })
    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value, true)
    this.setState({
      target_languages: languages
    })
  }

  processTargetLanguageSelected = (event) => {
    this.setState({ target_language_code: event.target.value })
  }


  /**
   * api calls
   */
  async makeAPICallAutoML(text, source_language_code, target_language_code) {
    let apiObj = new AutoML(text, source_language_code, target_language_code)
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        this.setState({ autoMLAPIInProgress: false })
        return Promise.reject('');
      } else {
        this.setState({
          autoMLText: rsp_data,
          autoMLAPIInProgress: false
        })
      }
    }).catch((error) => {
      this.setState({ autoMLAPIInProgress: false })
    });
  }

  async makeAPICallInteractiveTranslation(text, modelId) {
    let apiObj = new InstantTranslateAPI(v4(), '', text, "", false, text, "", modelId, this.state.source_language_code, this.state.target_language_code);

    this.setState({ anuvaadAPIInProgress: true })
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        this.setState({ anuvaadAPIInProgress: false, showStatus: false, message: null, dialogMessage: "Unable to fetch translation..." })
        return Promise.reject('');
      } else {
        let filteredTexts = rsp_data && rsp_data.output && rsp_data.output.translations[0] && rsp_data.output.translations[0].tgt ? rsp_data.output.translations[0].tgt : ""
        if (filteredTexts) {
          this.setState({})
          this.setState({
            anuvaadText: filteredTexts,
            anuvaadAPIInProgress: false,
            showStatus: false,
            message: null,
            modelName: modelId.model_name
          })
        } else {
          this.setState({ showStatus: false, message: null, dialogMessage: "No translation available..." })
        }
      }
    }).catch((error) => {
      this.setState({ anuvaadAPIInProgress: false, showStatus: false, message: null, dialogMessage: "Unable to fetch translation..." })
    });
  }

  renderSourceLanguagesItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ marginTop: "0%" }}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography value="" variant="h5">
            {translate("common.page.label.sourceLang")}&nbsp;<span style={{ color: "red" }}>*</span>
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
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ paddingTop: "20px" }}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography value="" variant="h5">
            {translate("common.page.label.targetLang")}&nbsp;<span style={{ color: "red" }}>*</span>
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h4" className={classes.typographyHeader}>
          {translate("dashboard.page.heading.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Grid container >

            {this.renderSourceLanguagesItems()}
            {this.renderTargetLanguagesItems()}

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid} style={{ paddingTop: "20px" }}>
              <textarea
                id="standard-multiline-static"
                style={{ padding: "1%", height: '100px', fontFamily: '"Source Sans Pro", "Arial", sans-serif', fontSize: "21px", width: '97.8%', borderRadius: '4px' }}
                className="noter-text-area"
                rows="3"
                value={this.state.text}
                disabled={this.state.anuvaadAPIInProgress || this.state.autoMLAPIInProgress}
                placeholder={translate("dashboard.page.alternatetext.enterTextHere")}
                // cols="50"
                onChange={event => {
                  this.handleTextChange("text", event);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid} style={{ display: "flex", flexDirection: "row" }}>
              <Grid item xs={6} sm={6} lg={6} xl={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.processClearButtonPressed}
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
                  onClick={this.processTranslateButtonPressed}
                  aria-label="edit"
                  className={classes.button1}
                  disabled={!this.state.text || !this.state.source_language_code || !this.state.target_language_code}
                >
                  {translate("common.page.button.submit")}
                </Button>
              </Grid>
            </Grid>

            {this.state.anuvaadText && (
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <Typography variant="h4" gutterBottom style={{ color: '#000000', marginLeft: "40px", textAlign: 'left' }} >{this.state.modelName}</Typography>
                <Typography variant="h6" gutterBottom style={{ color: '#000000', marginLeft: "40px", textAlign: 'left' }} >{this.state.anuvaadText}</Typography>
              </Grid>
            )}

            {this.state.autoMLText && this.state.autoMLChecked && (

              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <Typography variant="h4" gutterBottom style={{ color: '#000000', marginLeft: "40px", textAlign: 'left' }} >{translate("dashboard.page.checkbox.mt")}</Typography>
                <Typography variant="h6" gutterBottom style={{ color: '#000000', marginLeft: "40px", textAlign: 'left' }} >{this.state.anuvaadText}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
        {this.state.showStatus && this.renderProgressInformation()}
        {this.state.dialogMessage && this.renderStatusInformation()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  fetch_models: state.fetch_models
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(DashboardStyles)(
    connect(mapStateToProps, mapDispatchToProps)(Dashboard)));

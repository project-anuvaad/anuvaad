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
import FetchModel from "../../../../flux/actions/apis/fetchmodel";
import AutoML from "../../../../flux/actions/apis/auto_ml";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../assets/localisation";
import { withStyles } from "@material-ui/core/styles";
import DashboardStyles from "../../../styles/web/DashboardStyles";
import InteractiveTranslateAPI from "../../../../flux/actions/apis/intractive_translate";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
// import { Toolbar } from "@material-ui/core";
import Toolbar from "../DocumentUpload/FileUploadHeader";

const { v4 } = require('uuid');
const LANG_MODEL = require('../../../../utils/language.model')

class CreateUser extends React.Component {
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
    };
    this.processTranslateButtonPressed = this.processTranslateButtonPressed.bind(this);
    this.processClearButtonPressed = this.processClearButtonPressed.bind(this);
    this.processAutoMLCheckboxClicked = this.processAutoMLCheckboxClicked.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  componentDidMount() {
    if (this.props.fetch_models && this.props.fetch_models.models.length < 1) {
      const { APITransport } = this.props;
      const apiModel = new FetchModel();
      APITransport(apiModel);
      this.setState({ showLoader: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetch_models.models != this.props.fetch_models.models) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models),
        target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models)
      })
    }
  }

  processClearButtonPressed() {
  }

  processAutoMLCheckboxClicked() {
    this.setState({ autoMLChecked: !this.state.autoMLChecked });
  };

  handleTextChange(key, event) {
    this.setState({
      text: event.target.value
    });
  }

  processTranslateButtonPressed() {
    let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, this.state.target_language_code)
    console.log('submit pressed: %s %s %s %s', this.state.target_language_code, this.state.source_language_code, this.state.text, modelId)

    this.makeAPICallInteractiveTranslation(this.state.text, modelId)
    this.makeAPICallAutoML(this.state.text, this.state.source_language_code, this.state.target_language_code)
  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value })
    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value)
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
    let apiObj = new InteractiveTranslateAPI(text, '', modelId, true, '', v4());
    this.setState({ anuvaadAPIInProgress: true })

    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        this.setState({ anuvaadAPIInProgress: false })
        return Promise.reject('');
      } else {
        let filteredTexts = rsp_data.output.predictions[0].tgt.filter(text => text.length > 1);
        if (filteredTexts.length > 1) {
          this.setState({
            anuvaadText: filteredTexts[0],
            anuvaadAPIInProgress: false
          })
        } else {
          this.setState({
            anuvaadText: '',
            anuvaadAPIInProgress: false
          })
        }
      }
    }).catch((error) => {
      this.setState({ anuvaadAPIInProgress: false })
    });
  }

  renderCourtItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ marginTop: "0%" }}>
        <Grid item xs={6} sm={6} lg={7} xl={4} className={this.props.classes.label}>
          <Typography value="" variant="h5" style={{marginLeft:'17%',}}>
            {translate("common.page.court.name")}{" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <FormControl variant="outlined" style={{width:'91%'}}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              // onChange={this.processSourceLanguageSelected}
              // value={this.state.source_language_code}
            >
              {/* {
                this.state.source_languages.map(lang => 
                <MenuItem key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
              } */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  renderItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} style={{display:'flex',flexDirection:'row'}}>
        <Grid item xs={6} sm={6} lg={7} xl={4} style={{textAlign:'left'}}>
          <Typography value="" variant="h5" style={{marginLeft:'17%',marginTop:'5%'}}>
            {translate("common.page.label.name")}&nbsp;
          </Typography>
          <Typography value="" variant="h5" style={{marginLeft:'17%',marginTop:'10%'}}>
            {translate("common.page.label.email")}&nbsp;
          </Typography>
          <Typography value="" variant="h5"style={{marginLeft:'17%',marginTop:'10%'}}>
            {translate("common.page.label.password")}&nbsp;
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} lg={4} xl={4}>
          <FormControl variant="outlined" >
            <TextField variant="outlined" style={{marginBottom:'10%'}}></TextField>
            <TextField variant="outlined" type="email-username" style={{marginBottom:'10%'}}></TextField>
            <TextField variant="outlined" type="password" style={{marginBottom:'10%'}}></TextField>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  renderRoleItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={6} sm={6} lg={7} xl={4} className={this.props.classes.label}>
          <Typography value="" variant="h5" style={{marginLeft:'17%',}}>
            {translate("common.page.roles")}&nbsp;
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} lg={4} xl={4}>
          <FormControl variant="outlined" style={{width:'91%'}}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={this.state.target}
              //   onChange={this.processTargetLanguageSelected}
              //   value={this.state.target_language_code}
            >
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
        <Toolbar />
        <Typography variant="h4" className={classes.typographyHeader}>
          {translate("create.user.page.heading.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Grid container >
            {this.renderItems()}
            {this.renderCourtItems()}
            {this.renderRoleItems()}
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'column' }}>
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{marginTop:'3%'}}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.processClearButtonPressed}
                aria-label="edit"
                className={classes.button1}
              >
                {translate("common.page.button.reset")}
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{marginTop:'3%'}}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.processTranslateButtonPressed}
                aria-label="edit"
                className={classes.button1}
              >
                {translate("common.page.button.save")}
              </Button>
            </Grid>
          </Grid>
        </Paper>
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
    connect(mapStateToProps, mapDispatchToProps)(CreateUser)));

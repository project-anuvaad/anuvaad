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

const { v4 }        = require('uuid');
const LANG_MODEL    = require('../../../../utils/language.model')

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
    };
    this.processTranslateButtonPressed  = this.processTranslateButtonPressed.bind(this);
    this.processClearButtonPressed      = this.processClearButtonPressed.bind(this);
    this.processAutoMLCheckboxClicked   = this.processAutoMLCheckboxClicked.bind(this);
    this.handleTextChange               = this.handleTextChange.bind(this)
  }

  componentDidMount() {
   
      const { APITransport }  = this.props;
      const apiModel          = new FetchModel();
      APITransport(apiModel);
      this.setState({ showLoader: true });
    
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
    this.setState({text:'',source_languages: [],
      target_languages: [],anuvaadText:""})
  }

  processAutoMLCheckboxClicked() {
    this.setState({autoMLChecked: !this.state.autoMLChecked});
  };

  handleTextChange(key, event) {
    this.setState({
      text: event.target.value
    });
  }

  processTranslateButtonPressed() {
    let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, this.state.target_language_code)

    this.makeAPICallInteractiveTranslation(this.state.text, modelId.model_id)
    // this.makeAPICallAutoML(this.state.text, this.state.source_language_code, this.state.target_language_code)
  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value})
    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value)
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
  async makeAPICallAutoML(text, source_language_code, target_language_code) {
    let apiObj      = new AutoML(text, source_language_code, target_language_code)
    const apiReq    = fetch(apiObj.apiEndPoint(), {
                          method: 'post',
                          body: JSON.stringify(apiObj.getBody()),
                          headers: apiObj.getHeaders().headers
                        }).then(async response => {
                          const rsp_data = await response.json();
                          if (!response.ok) {
                            this.setState({autoMLAPIInProgress: false})
                            return Promise.reject('');
                          } else {
                            this.setState({
                              autoMLText: rsp_data,
                              autoMLAPIInProgress: false
                            })
                          }
                      }).catch((error) => {
                        this.setState({autoMLAPIInProgress: false})
                      });
  }

  async makeAPICallInteractiveTranslation(text, modelId) {
    let apiObj = new InteractiveTranslateAPI(text, '', modelId, true, '', v4());
    this.setState({anuvaadAPIInProgress: true})

    const apiReq    = fetch(apiObj.apiEndPoint(), {
                        method: 'post',
                        body: JSON.stringify(apiObj.getBody()),
                        headers: apiObj.getHeaders().headers
                    }).then(async response => {
                        const rsp_data = await response.json();
                        if (!response.ok) {
                          this.setState({anuvaadAPIInProgress: false})
                          return Promise.reject('');
                        } else {
                          let filteredTexts  = rsp_data.output.predictions[0].tgt.filter(text => text.length > 1);
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
                      this.setState({anuvaadAPIInProgress: false})
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
    const { classes } = this.props;
    let gridSizeLarge = 12
    let gridSizeSmall = 12
    
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
                disabled={this.state.anuvaadAPIInProgress || this.state.autoMLAPIInProgress}
                placeholder={translate("dashboard.page.alternatetext.enterTextHere")}
                // cols="50"
                onChange={event => {
                  this.handleTextChange("text", event);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row' }}>
            </Grid>
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
              >
                {translate("common.page.button.submit")}
              </Button>
            </Grid>
            {/* </div> */}

            {this.state.anuvaadText && (
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
                <Typography variant="h4" gutterBottom style={{ color: '#000000', marginLeft: "40px", textAlign: 'left' }} >{translate("dashbord.page.title.anuvaadModel")}</Typography>
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

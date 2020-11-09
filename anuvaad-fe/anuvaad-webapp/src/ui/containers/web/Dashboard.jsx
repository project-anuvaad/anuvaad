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
import SelectModel from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Chip from "@material-ui/core/Chip";
import { Tooltip } from "@material-ui/core";
import TranslateSentence from "../../components/web/dashboard/TranslateSentence";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import Select from "../../components/web/common/Select";
import NMT from "../../../flux/actions/apis/nmt";
import AutoML from "../../../flux/actions/apis/auto_ml";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import NewOrders from "../../components/web/dashboard/NewOrders";
import { translate } from "../../../assets/localisation";
import { withStyles } from "@material-ui/core/styles";
import DashboardStyles from "../../styles/web/DashboardStyles";
import InteractiveTranslateAPI from "../../../flux/actions/apis/intractive_translate";


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
      source: "",
      target: "",
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

    if (this.props.fetch_languages.languages.length < 1) {
      const { APITransport }  = this.props;
      const apiObj            = new FetchLanguage();
      APITransport(apiObj);
      this.setState({ showLoader: true });
    }

    if (this.props.fetch_models.models.length < 1) {
      const { APITransport }  = this.props;
      const apiModel          = new FetchModel();
      APITransport(apiModel);
      this.setState({ showLoader: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.automl !== this.props.automl) {
      if (this.props.automl.text && this.props.automl.text.message === "Daily Limit Exceeded") {
        this.setState({
          autoMlText: this.props.automl.text.message
        });
      } else {
        this.setState({
          autoMlText: this.props.automl.text
        });
      }
    }

    if (prevProps.nmt !== this.props.nmt) {
      this.setState({
        nmtText: this.props.nmt
      });
    }

    if (prevProps.nmtsp !== this.props.nmtsp) {
      this.setState({
        nmtTextSP: this.props.nmtsp.text
      });
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleClear() {
    this.setState({
      text: "",
      nmtText: "",
      autoMlText: "",
      source: "",
      target: "",
      model: [],
      checkedMachine: false,
      checkedSubwords: false,
      showSplitted: false
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
    const model = [];
    const { APITransport, NMTApi } = this.props;
    role.includes("dev")
      ? this.state.modelLanguage.map(item =>
        item.target_language_code === this.state.target &&
          item.source_language_code === this.state.source &&
          this.state.model.includes(item.model_name)
          ? model.push(item)
          : []
      )
      : this.state.modelLanguage.map(item =>
        item.target_language_code === this.state.target && item.source_language_code === this.state.source && model.length < 1 && item.is_primary
          ? model.push(item)
          : []
      );
    const apiObj = new AutoML(this.state.text, this.state.source, this.state.target);
    const nmt = new NMT(this.state.text, model, true, this.state.target, this.state.showSplitted);
    NMTApi(nmt);
    this.state.checkedMachine && APITransport(apiObj);
    this.setState({
      showLoader: true,
      autoMlText: "",
      nmtText: "",
      apiCalled: true
    });
  }

  async makeAPICallAutoML() {

  }

  async makeAPICallInteractiveTranslation() {
    let apiObj = new InteractiveTranslateAPI(this.props.sentence.src, this.state.value, this.props.modelId, true, '', this.props.sentence.s_id);
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
                suggestions: rsp_data.output.predictions[0].tgt.map(s => { return {name: s}})
            })
        }
    }).catch((error) => {
        this.setState({
            suggestions: []
        })
    });
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
            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.rowData} style={{ marginTop: "0%" }}>
              <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.label}>
                <Typography value="" variant="h5">
                  {translate("common.page.label.sourceLang")}{" "}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={6} lg={4} xl={4} >
                <Select
                  className={classes.select}
                  id="outlined-age-simple"
                  selectValue="language_code"
                  MenuItemValues={this.handleSource(this.state.modelLanguage, this.state.language)}
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
            </Grid>

            {/* </Grid> */}
            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.rowData}>
              <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.label}>
                <Typography value="" variant="h5">
                  {translate("common.page.label.targetLang")}&nbsp;
              </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={4} xl={4}>
                <Select
                  id="outlined-age-simple"
                  selectValue="language_code"
                  MenuItemValues={this.state.source ? this.handleTarget(this.state.modelLanguage, this.state.language, this.state.source) : []}
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

            {role.includes("dev") && (
              <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.rowData}>
                  <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.label}>
                    <Typography value="" variant="h5">
                      {translate("common.page.label.pleaseSelectModel")}{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} lg={4} xl={4}>
                    <SelectModel
                      id="select-multiple-chip"
                      multiple
                      style={{
                        width: '92%',
                        fullWidth: true,
                        display: "flex",
                        wrap: "nowrap",
                        // height: '40px',
                        magin: 'dense',
                        float: 'right'
                      }}
                      value={this.state.model}
                      onChange={this.handleSelectModelChange}
                      renderValue={selected => selected.join(", ")}
                      input={<OutlinedInput name={this.state.model} id="select-multiple-checkbox" />}
                    >
                      {this.state.source && this.state.target
                        ? this.handleModel(this.state.modelLanguage, this.state.source, this.state.target).map(item => (
                          <Tooltip
                            placement="right"
                            enterDelay={200}
                            key={item.model_id}
                            value={item.model_name}
                            title={item.description ? item.description : "NA"}
                          >
                            <MenuItem key={item.model_id} value={item.model_name}>
                              {item.model_name}
                            </MenuItem>
                          </Tooltip>
                        ))
                        : []}

                    </SelectModel>
                  </Grid>
                </Grid>

                {role.includes("dev") && (
                  <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataChip}>
                    {this.state.model.map(value => (
                      value ? <div className={classes.divChip}><Chip key={value} label={value} onDelete={this.handleDelete(value)} style={{ marginLeft: "5px", marginTop: "8px" }} /> </div> : <div></div>
                    ))}
                  </Grid>
                )}
              </Grid>
            )}
            {/* <div> */}
            {/* <Grid container spacing={24} > */}
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
              {role.includes("dev") && (
                <Grid item xs={gridSizeSmall} sm={gridSizeSmall} lg={gridSizeLarge} xl={gridSizeLarge} style={{ textAlign: 'left', paddingLeft: '0px' }}>
                  <FormControlLabel
                    style={{ marginLeft: "0%" }}
                    control={
                      <Checkbox color="default" checked={this.state.showSplitted} value="showSplitted" onChange={this.handleChange("showSplitted")} />
                    }
                    label={translate("dashboard.page.checkbox.splitted")}
                  />
                </Grid>
              )}
              {role.includes("dev") && (
                <Grid item xs={gridSizeSmall} sm={gridSizeSmall} lg={gridSizeLarge} xl={gridSizeLarge} style={{ textAlign: 'left', paddingLeft: '0px' }}>
                  <FormControlLabel
                    style={{ margin: '0%' }}
                    control={
                      <Checkbox
                        color="default"
                        checked={this.state.checkedSubwords}
                        value="checkedSubwords"
                        onChange={this.handleChange("checkedSubwords")}
                        style={{ paddingLeft: '0px !important' }}
                      />
                    }
                    label={translate("dashboard.page.checkbox.ioSubwords")}
                  />
                </Grid>
              )}
              {/* </Grid> */}
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
      </div >
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  automl: state.automl,
  nmt: state.nmt,
  nmtsp: state.nmtsp,
  supportLanguage: state.fetch_languages.languages,
  langModel: state.fetch_models.models
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

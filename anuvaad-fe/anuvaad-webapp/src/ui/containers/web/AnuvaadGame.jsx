import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { blueGrey50, darkBlack } from "material-ui/styles/colors";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SelectModel from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Chip from "@material-ui/core/Chip";
import { Tooltip } from "@material-ui/core";
import Winwheel from "winwheel";

import { translate } from "../../../assets/localisation";
import TranslateSentence from "../../components/web/dashboard/TranslateSentence";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import Select from "../../components/web/common/Select";
import NMT from "../../../flux/actions/apis/nmt";
import AutoML from "../../../flux/actions/apis/auto_ml";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import NewOrders from "../../components/web/dashboard/NewOrders";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Fab from '@material-ui/core/Fab';


class AnuvaadGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      apiCalled: false,
      autoMlText: "",
      nmtText: [],
      nmtTextSP: [],
      tocken: false,
      source: "en",
      target: "",
      modelLanguage: [],
      language: [],
      model: [],
      checkedMachine: false,
      checkedSubwords: false,
      showSplitted: false,
      val: true,
      submit: true,
      result: ["This Court, while dealing with the issue for the purpose of deciding the question of obscenity in any book, story or article.",
        'The Cabinet Mission Plan laid foundation for Constitution, functioning and procedure of Constituent Assembly',
        'Every member of the collective has an inherent interest in such a trial.',
        'It will further promote research into the institutional functioning of the courts.',
        'I have no doubt that with adequate finances, in the near future, this ground can become one of the best in the country.',
        'During the first three decades the Council functioned quite effectively and there was phenomenal development of technical education in this period.',
        'A measure to achieve the intended purpose must therefore be suitable and necessary.',
        'The whole approach is erroneous.',
        'Andhra society runs Telugu medium schools outside Andhra Pradesh.',
        'He was threatened that if the money was not paid Narendra would be killed or his daughter would be kidnapped.',
        'To ensure their proper representation, a system of reservation becomes necessary.',
        'Some rules can favour the majority community, others can protect the minorities.',
        'But merely writing down a list of rights is not enough.',
        'On the occasion of Mahavir Jayanti, the god Hanuman was worshipped on Devika beach.',
        'This problem arose when the government sought to pass laws to abolish zamindari system.',
        'The availability of housing for the general public will be increased.',
        'For the appointment of a judge of the High Court also, consultation with the Chief Justice of India was mandatory. ',
        'Over five crore tonnes of food grains was stored in the godowns of the Food Corporation of India.',
        'A team of social scientists studied their poor condition and petitioned the Supreme Court.',
        'In view of the said information, the commission withheld further action awaiting the opinion of the Supreme court in the matter. ',
        'Similarly a game needs an impartial umpire whose decision is accepted by all the players.',
        'Three years later, on 20 and 21 November 2017 articles were published in Caravan which was followed by a flurry of writ petitions. ',
        'In spite of this, the blind faith of some of their devotees continues.',
        'Given the severity of the case support from the cyber crime cell is being sought.',
        'A definition is an explicit statement of the full connotation of a term.',
        'I live in Shopian, which is believed to be a stronghold of terrorists.',
        'Ms. Archana Pathak Dave, learned counsel for the State of Rajasthan.',
        'The demand for a separate district was raised by Mewat Educational and Social Organisation and Mewat Saksharta Samiti in 1996.',
        'Dr. S.S. Dahiya conducted postmortem examination on the dead body of Manju, wife of Pradeep Kumar.',
        'The passion for respect and freedom are the basis of democracy.'
      ]
    };

    this.theWheel = null;
  }

  componentDidMount() {
    this.setState({
      autoMlText: "",

      nmtText: [],
      nmtTextSP: []
    });

    const { APITransport } = this.props;
    const apiObj = new FetchLanguage();
    APITransport(apiObj);
    this.setState({ showLoader: true });
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({ showLoader: true });

    this.theWheel = new Winwheel({
      numSegments: 20, // Number of segments
      outerRadius: 302, // The size of the wheel.
      centerX: 307, // Used to position on the background correctly.
      centerY: 309,
      pointerAngle: 90,
      textFontSize: 28, // Font size.
      // Definition of all the segments.
      segments: [
        { fillStyle: "#00cc00", text: "1" },
        { fillStyle: "#ff99cc", text: "2" },
        { fillStyle: "#000066", text: "3" },
        { fillStyle: "#ffffff", text: "4" },
        { fillStyle: "#cc00ff", text: "5" },
        { fillStyle: "#993366", text: "6" },
        { fillStyle: "#00ffff", text: "7" },
        { fillStyle: "#e7706f", text: "8" },
        { fillStyle: "#cc66ff", text: "9" },
        { fillStyle: "#89f26e", text: "10" },
        { fillStyle: "#ffff66", text: "12" },
        { fillStyle: "#9900ff", text: "13" },
        { fillStyle: "#7de6ef", text: "14" },
        { fillStyle: "#e7706f", text: "15" },
        { fillStyle: "#eae56f", text: "16" },
        { fillStyle: "#89f26e", text: "17" },
        { fillStyle: "#0099cc", text: "18" },
        { fillStyle: "#ccffff", text: "19" },
        { fillStyle: "#89f26e", text: "20" },
        { fillStyle: "#7de6ef", text: "21" },
        { fillStyle: "#e7706f", text: "22" },
        { fillStyle: "#89f26e", text: "23" },
        { fillStyle: "#7de6ef", text: "24" },
        { fillStyle: "#e7706f", text: "25" }
      ],
      // Definition of the animation
      animation: {
        type: "spinToStop",
        duration: 5,
        spins: 8
      }
    });

    console.log({ theWheel: this.theWheel });

    // this.drawTriangle();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.automl !== this.props.automl) {
      this.setState({
        autoMlText: this.props.automl.text
      });
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
    window.location.reload();


    // this.setState({
    //   text: "",
    //   nmtText: "",
    //   autoMlText: "",
    //   source: "",
    //   target: "",
    //   model: [],
    //   checkedMachine: false,
    //   checkedSubwords: false,
    //   showSplitted: false,
    //   submit: true,
    //   val: true,

    // });
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

  getPrice() {
    const winngSegment = this.theWheel.getIndicatedSegment();



    this.setState({ textValue: winngSegment.text, val: false });

    console.log(`On Interval${winngSegment.text}`, this.theWheel);
  }

  handleTranslate() {
    this.setState({ submit: false, val: false, text: this.state.result[this.state.textValue - 1] });
  }

  startTheWheel() {
    this.theWheel.startAnimation();

    console.log("start Interval");

    setTimeout(() => {

      this.getPrice();

    }, 5100);
    this.setState({ val: "false" });


  }

  stopTheWheel() {
    this.theWheel.stopAnimation();
    this.theWheel.rotationAngle = 0;
    this.theWheel.draw();
    this.setState({ val: true, textValue: null });
  }

  render() {
    const role = JSON.parse(localStorage.getItem("roles"));
    return (
      <div>
        {this.state.submit ? (
          <div>
            <Grid container spacing={8}>
              <Grid item xs={2} sm={3} lg={5} xl={5}>
                <div style={{ marginTop: "60px", marginLeft: '16%' }}>
                  <canvas id="canvas" width="880" height="750">
                    Canvas not supported, use another browser.
                  </canvas>
                </div>
              </Grid>
              <Grid item xs={1} sm={1} lg={1} xl={1}><ArrowBackIcon style={{ marginTop: '320px', fontSize: '100px', marginLeft: '35px', color: 'red' }} /></Grid>
              {this.state.textValue && (
                <Grid item xs={6} sm={6} lg={6} xl={6}>
                  <Typography value="" variant="h4" gutterBottom style={{ marginTop: "30%", marginRight: '30px' }}>
                    {this.state.result[this.state.textValue - 1]}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {this.state.val === true ? <Grid container spacing={8}>
              <Grid item xs={5} sm={5} lg={5} xl={5}>


                <Fab
                  variant="contained"
                  aria-label="edit"
                  style={{ marginLeft: "47%", width: "15%", height: '50px', marginTop: "-100px", padding: '70px', backgroundColor: "green" }}
                  onClick={this.startTheWheel.bind(this)}
                >
                  Start
                  </Fab>
              </Grid>
            </Grid>
              : !this.state.val && <Grid container spacing={8}>
                <Grid item xs={5} sm={5} lg={5} xl={5}>
                  <Fab
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "47%", width: "10%", marginTop: "-100px", padding: '70px', backgroundColor: "red" }}
                    onClick={this.stopTheWheel.bind(this)}
                  >
                    Reset
                  </Fab>
                </Grid>
                <Grid item xs={6} sm={6} lg={6} xl={6}>
                  {this.state.textValue &&
                    <Button
                      variant="contained"
                      onClick={this.handleTranslate.bind(this)}
                      color="primary"
                      aria-label="edit"
                      style={{ marginLeft: "30%", width: "44%", marginTop: "-150px", }}
                    >
                      Translate
                  </Button>
                  }
                </Grid>

              </Grid>
            }

          </div>
        ) : (
            <Paper style={{ marginLeft: "25%", width: "50%", marginTop: "4%" }}>
              <Typography
                variant="h5"
                style={{ color: darkBlack, background: blueGrey50, textAlign: "center", paddingBottom: "12px", paddingTop: "8px" }}
              >
                {translate("dashboard.page.heading.title")}
              </Typography>
              <Grid container spacing={8}>
                <Grid item xs={8} sm={8} lg={8} xl={8}>
                  <Typography value="" variant="title" gutterBottom style={{ marginLeft: "12%", paddingTop: "9.5%" }}>
                    {translate("common.page.label.sourceLang")}{" "}
                  </Typography>
                </Grid>

                <Grid item xs={3} sm={3} lg={3} xl={3}>
                  <br />
                  <br />
                  <Select
                    disabled={true}
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
              <Grid container spacing={8}>
                <Grid item xs={8} sm={8} lg={8} xl={8}>
                  <Typography value="" variant="title" gutterBottom style={{ marginLeft: "12%", paddingTop: "9.5%" }}>
                    {translate("common.page.label.targetLang")}&nbsp;
                </Typography>
                </Grid>
                <Grid item xs={3} sm={3} lg={3} xl={3}>
                  <br />
                  <br />
                  <Select
                    id="outlined-age-simple"
                    selectValue="language_code"
                    MenuItemValues={this.state.source ? this.handleTarget(this.state.modelLanguage, this.state.language, this.state.source) : []}
                    handleChange={this.handleSelectChange}
                    value={this.state.target}
                    name="target" style={{
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
                <Grid container spacing={8}>
                  <Grid item xs={8} sm={8} lg={8} xl={8}>
                    <Typography value="" variant="title" gutterBottom style={{ marginLeft: "12%", paddingTop: "9.5%" }}>
                      {translate("common.page.label.pleaseSelectModel")}{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} lg={3} xl={3}>
                    <br />
                    <br />

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
                    <br />
                  </Grid>
                  {role.includes("dev") && (
                    <div style={{ marginLeft: "8%", paddingTop: "10px" }}>
                      {this.state.model.map(value => (
                        <Chip key={value} label={value} onDelete={this.handleDelete(value)} style={{ marginLeft: "5px", marginTop: "8px" }} />
                      ))}
                    </div>
                  )}
                </Grid>
              )}
              <div style={{ marginLeft: "40px" }}>
                <Grid container spacing={24} style={{ padding: 24 }}>
                  <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <TextField
                      value={this.state.text}
                      id="standard-multiline-static"
                      placeholder={translate("dashboard.page.alternatetext.enterTextHere")}
                      style={{ width: "96%" }}
                      multiline
                      onChange={event => {
                        this.handleTextChange("text", event);
                      }}
                    />
                  </Grid>

                  {/* <FormControlLabel
                  style={{ marginLeft: "0%", width: role.includes("dev") ? "26%" : "60%", marginRight: "5%" }}
                  control={
                    <Checkbox
                      color="default"
                      checked={this.state.checkedMachine}
                      value="checkedMachine"
                      onChange={this.handleChange("checkedMachine")}
                    />
                  }
                  label={translate("dashboard.page.checkbox.mt")}
                /> */}
                  {role.includes("dev") && (
                    <FormControlLabel
                      style={{ marginLeft: "0%", width: "23%", marginRight: "5%" }}
                      control={
                        <Checkbox color="default" checked={this.state.showSplitted} value="showSplitted" onChange={this.handleChange("showSplitted")} />
                      }
                      label={translate("dashboard.page.checkbox.splitted")}
                    />
                  )}
                  {role.includes("dev") && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="default"
                          checked={this.state.checkedSubwords}
                          value="checkedSubwords"
                          onChange={this.handleChange("checkedSubwords")}
                        />
                      }
                      label={translate("dashboard.page.checkbox.ioSubwords")}
                    />
                  )}

                  <Button
                    variant="contained"
                    onClick={this.handleClear.bind(this)}
                    color="primary"
                    aria-label="edit"
                    style={{ marginLeft: "1.3%", width: "44%", marginBottom: "4%", marginTop: "4%", marginRight: "5%" }}
                  >
                    {translate("common.page.button.cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={this.handleSubmit.bind(this, role)}
                    color="primary"
                    aria-label="edit"
                    style={{ width: "44%", marginBottom: "4%", marginTop: "4%" }}
                  >
                    {translate("common.page.button.submit")}
                  </Button>
                </Grid>
              </div>
              {this.state.nmtText[0] && (
                <div>
                  <NewOrders title={translate("dashbord.page.title.anuvaadModel")} data={this.state.nmtText} status={this.state.checkedSubwords} />
                </div>
              )}
              {this.state.checkedMachine && this.state.autoMlText && this.state.nmtText && (
                <TranslateSentence title={translate("dashboard.page.checkbox.mt")} data={this.state.autoMlText} />
              )}
            </Paper>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnuvaadGame));

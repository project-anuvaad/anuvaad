import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import $ from "jquery";

import "../../styles/web/TranslatePresident.css";
import Zoom from "@material-ui/core/Zoom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import CloseIcon from "@material-ui/icons/Close";

import C from "../../../flux/actions/constants";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import NMT from "../../../flux/actions/apis/nmt_president";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import AppCard from "../../components/web/Card";
import { translate } from "../../../assets/localisation";

const langs = [
  { label: "Hindi", code: "hi", type: C.HINDI },
  { label: "Bengali", code: "bn", type: C.BENGALI },
  { label: "Gujarati", code: "gu", type: C.GUJARATI },
  { label: "Kannada", code: "kn", type: C.KANNADA },
  { label: "Malayalam", code: "ml", type: C.MALAYALAM },
  { label: "Marathi", code: "mr", type: C.MARATHI },
  { label: "Punjabi", code: "pa", type: C.PUNJABI },
  { label: "Tamil", code: "ta", type: C.TAMIL },
  { label: "Telugu", code: "te", type: C.TELUGU }
];

let timer;

class Translate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLayout: false,
      showLangLayout: false,
      model: [],
      langs: [],
      sentence: ""
    };
  }

  componentDidMount() {
    const apiObj = new FetchLanguage();
    this.props.APITransport(apiObj);
    const apiModel = new FetchModel();
    this.props.APITransport(apiModel);
  }

  componentDidUpdate(prevProps) {
    langs.map(lang => {
      if (this.props[lang.label.toLowerCase()] !== prevProps[lang.label.toLowerCase()]) {
        this.setState({
          [lang.label.toLowerCase()]: this.props[lang.label.toLowerCase()]
        });
      }
      return true;
    });
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value,
      val: true
    });
  }

  handleChange = () => {
    this.setState({ showZoom: true });
  };

  getModelForLang(lang_code) {
    const model = [];
    this.props.langModel.map(
      item => item.target_language_code === lang_code && item.source_language_code === "en" && item.is_primary && model.push(item)
    );
    return model;
  }

  handleOnClick = () => {
    this.setState({ showLayout: true });
    langs.map(lang => {
      const model = this.getModelForLang(lang.code);
      const api = new NMT(this.state.sentence, model, false, null, true, lang.type);
      this.props.TranslateAPI(api);
      return true;
    });

    setTimeout(() => {
      this.setState({ showLangLayout: true });
    }, 1000);
  };

  handleClose = () => {
    clearTimeout(timer);
    this.handleCardHoverOut();
    this.setState({ showLayout: false, showLangLayout: false, sentence: "" });
    langs.map(lang => {
      this.setState({
        [lang.label.toLowerCase()]: null
      });
      return true;
    });
  };

  handleCardHover(header, body) {
    clearTimeout(timer);
    timer = setTimeout(
      () => {
        this.setState({
          showZoomed: true,
          zoom: true,
          header,
          body
        });
        $("#cards").animate(
          {
            scrollTop: 0
          },
          "fast"
        );
      },
      1000
    );
  }

  handleCardHoverOut() {
    this.setState({
      zoom: false
    });
    setTimeout(
      () => {
        this.setState({
          showZoomed: false,
          header: "",
          body: ""
        });
      },
      100
    );
  }

  clearTimer() {
    clearTimeout(timer);
  }

  render() {
    return (
      <div style={{padding: "0% 3%", display: "flex", flexDirection: "column", textAlign: "center"}}>
        {!this.state.showLayout ? (
          <div>
            <textarea
              className="idbox"
              rows="5"
              cols="50"
              placeholder={translate("common.page.placeholder.enterTextHere")}
              onChange={event => {
                this.handleTextChange("sentence", event);
              }}
            />
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "25%",
                  height: 50
                }}
                onClick={this.state.sentence && this.handleOnClick.bind(this)}
              >
                {translate("dashboard.page.heading.title")}
              </Button>
            </div>
          </div>
        ) : (
          !this.state.showLangLayout && (
            <div className="fadeUp">
              <textarea
                className="idbox"
                rows="5"
                cols="50"
                placeholder={translate("common.page.placeholder.enterTextHere")}
                onChange={event => {
                  this.handleTextChange("sentence", event);
                }}
              />
            </div>
          )
        )}
        <div>
          {this.state.showLangLayout ? (
            <Grid container spacing={16}>
              <Grid
                container
                item
                xs={this.state.showZoomed ? 6 : 4}
                sm={this.state.showZoomed ? 6 : 4}
                lg={this.state.showZoomed ? 6 : 4}
                xl={this.state.showZoomed ? 6 : 4}
                spacing={1}
              >
                <AppCard
                  title
                  handleHover={() => {}}
                  handleHoverOut={() => {}}
                  header={translate("common.page.label.english")}
                  body={this.state.sentence}
                  fontSize={this.state.showZoomed ? "40px" : "20px"}
                  showZoomed={this.state.showZoomed}
                  style={{ minWidth: "100%", marginTop: "50%", background: '#ECEFF1', minHeight: window.innerHeight + 7 - window.innerHeight / 5 }}
                 />
              </Grid>
              {/* <Grid container item xs={12} spacing={3} id='cardGrid'>
                <React.Fragment>
                  {langs.map((lang) => {
                    return (<Grid item xs={12} sm={4} className='slideUp'><AppCard header={lang.label} body={this.state[lang.label.toLowerCase()] && this.state[lang.label.toLowerCase()] && Array.isArray(this.state[lang.label.toLowerCase()]) ? this.state[lang.label.toLowerCase()][0].tgt : ''} /></Grid>)
                  })}
                </React.Fragment>
              </Grid> */}

              <Grid
                container
                item
                xs={this.state.showZoomed ? 6 : 8}
                sm={this.state.showZoomed ? 6 : 8}
                lg={this.state.showZoomed ? 6 : 8}
                xl={this.state.showZoomed ? 6 : 8}
                spacing={1}
                style={{ height: window.innerHeight - window.innerHeight / 10, overflowY: "scroll", marginBottom: "10px", paddingBottom: "10px" }}
                id="cards"
              >
                <React.Fragment>
                  {this.state.showZoomed && (
                    <Zoom in={this.state.zoom} timeout={700}>
                      <AppCard bigsize header={this.state.header} body={this.state.body} handleHoverOut={this.handleCardHoverOut.bind(this)} />
                    </Zoom>
                  )}
                  {langs.map((lang, index) => (
                      <Grid item xs={12} sm={12} lg={12} xl={12} className="slideUp" style={{ marginRight: "5%" }}>
                        <AppCard
                          index={index}
                          showSmall
                          handleHoverOut={this.clearTimer.bind(this)}
                          handleHover={this.handleCardHover.bind(this)}
                          header={lang.label}
                          body={
                            this.state[lang.label.toLowerCase()] &&
                            this.state[lang.label.toLowerCase()] &&
                            Array.isArray(this.state[lang.label.toLowerCase()])
                              ? this.state[lang.label.toLowerCase()].map((elem) => elem.tgt)
                              : ""
                          }
                          style={{ raised: true, Height: "100px", background: '#ECEFF1', marginBottom: "5px" }}
                        />
                      </Grid>
                    ))}
                </React.Fragment>
                <Fab
                  aria-label="Close"
                  style={{
                    margin: "auto",
                    display: "block",
                    color: "white"
                  }}
                  onClick={this.handleClose.bind(this)}
                >
                  <CloseIcon style={{ color: "CB1E60" }} />
                </Fab>
              </Grid>
            </Grid>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  nmt: state.nmt,
  supportLanguage: state.supportLanguage,
  langModel: state.langModel,
  hindi: state.hindi,
  bengali: state.bengali,
  punjabi: state.punjabi,
  malayalam: state.malayalam,
  tamil: state.tamil,
  telugu: state.telugu,
  marathi: state.marathi,
  kannada: state.kannada,
  gujarati: state.gujarati
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      TranslateAPI: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(Translate)));

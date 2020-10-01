import { Form, TextArea } from "semantic-ui-react";
import Grader from "../../components/web/common/Grader";
import React from "react";
import { withRouter } from "react-router-dom";
import BenchmarkTranslate from "../../../flux/actions/apis/benchmarktranslate";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import UpdateSentencesGrade from "../../../flux/actions/apis/upgrade-sentence-grade";
import { translate } from '../../../assets/localisation';
class SentenceTranslate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      source: 'English',
      target: 'Hindi'
    };
  }

  componentDidMount() {
    this.setState({
      hindi: []
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.apistatus !== this.props.apistatus) {
      this.setState({ showLoader: true });
      
    }

    if (prevProps.benchmarkTranslate !== this.props.benchmarkTranslate) {
        this.setState({
            
            
            sentences: this.props.benchmarkTranslate.data,
          });
        
      }
    
  }

  handleSelectChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFileChange = e => {
    if (e.target.files[0]) {
      this.setState({
        file: e.target.files[0]
      });
    }
  };

  componentWillUnmount(){
      this.setState({file:[]})
  }

  handleSelechange = event => {
    this.setState({ pageCount: event.target.value, offset: 0 });
  };


  onStarClick(nextValue, prevValue, name, index) {
    let sentences = this.state.sentences
    sentences[index][name] = nextValue
    this.setState({ sentences: sentences });
   
  }

  handleUpdateSubmit = () => {
    let api = new UpdateSentencesGrade(this.state.sentences, this.props.match.params.modelid);
    this.setState({ dialogOpen: false, apiCall: true,showLoader: true, tocken: false ,sentences: []});
    this.props.APITransport(api);

    this.setState({source:'', target:'', text:'' });
  };

  handleSubmit() {

    const { APITransport } = this.props;
        const apiObj = new BenchmarkTranslate( this.state.text, this.state.source, this.state.target);
        APITransport(apiObj);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="h5" color="inherit" style={{ marginTop: "20px",marginLeft:'10%' }}>
          <b>{translate('sentenceTranslate.page.text.translateTxt')}</b>
        </Typography>
        <Grid container spacing={4} style={{marginLeft:'10%'}}>
          <Grid item xs={6} sm={6} lg={6} xl={6}>
            <Form style={{ marginTop: "30px" }}>
              <AppBar position="static">
                <Toolbar>
                  <Select
                    width="100%"
                    value={this.state.source}
                    style={{ background: "white", fill: "white", width: "150px" }}
                    onChange={event => {
                      this.handleSelectChange("source", event);
                    }}
                    displayEmpty
                  >
                    <MenuItem value={"English"}>{translate('common.page.label.english')}</MenuItem>
                    <MenuItem value={"Hindi"}>{translate('common.page.label.hindi')}</MenuItem>
                  </Select>

                  <Typography variant="h6" color="inherit" style={{ marginLeft: "20%", flex: 1 }}>
                  {translate('sentenceTranslate.page.label.translateTo')}
                  </Typography>

                  <Select
                    width="100%"
                    style={{ background: "white", marginRight: "50px", width: "150px" }}
                    value={this.state.target}
                    onChange={event => {
                      this.handleSelectChange("target", event);
                    }}
                    displayEmpty
                  >
                   {this.state.source === "Hindi" && <MenuItem value={"English"}>{translate('common.page.label.english')}</MenuItem>}
                   {this.state.source === "English" && <MenuItem value={"Hindi"}>{translate('common.page.label.hindi')}</MenuItem>}
                  </Select>
                </Toolbar>
              </AppBar>
              <TextArea
                placeholder={translate('sentenceTranslate.page.placeholder.textTranslate')}
                value={this.state.text}
                onChange={event => {
                  this.handleSelectChange("text", event);
                }}
                style={{ minWidth: "99.3%",maxWidth:'99.3%', minHeight: "162px",maxHeight: "162px", fontSize: "20px" }}
              />
            </Form>
          </Grid>
          <Grid item xs={6} sm={6} lg={6} xl={6} style={{ marginBottom: "5%", paddingTop: "180px" }}>
            {/* <Button variant="contained" color="primary" className={classes.button} onClick={() => { history.push(`${process.env.PUBLIC_URL}/translations`) }}>Cancel</Button> */}
            <Button variant="contained" disabled= {this.state.text ? false: true} color="primary" className={classes.buttons} onClick={this.handleSubmit.bind(this)}>
            {translate('dashboard.page.heading.title')}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={4} style={{ padding: "20px", marginTop:"-60px"}}>
        
          {this.state.sentences && this.state.sentences.map((value, i) => {
            var val = i === 0 ? "A" : "B";
            return <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Grader title={"Model " + val} index={i} description={value.target} handleStarClick={this.onStarClick.bind(this)} data={value}  meaning={"rating"} structure={"context_rating"} vocabulary={"spelling_rating"} />
            </Grid>
          })}
        </Grid>

        {this.state.sentences && this.state.sentences.length > 0 &&  <Toolbar style={{ marginRight: "3%", marginTop: "20px" }}>
              <Typography variant="h5" color="inherit" style={{ flex: 1 }}></Typography>
              <Button
                variant="contained"

                
                onClick={event => {
                  this.handleUpdateSubmit(this.state.sentences);
                }}
                color={"primary"}
                aria-label="edit"
                style={{ width: "170px", marginBottom: "4%", marginTop: "1px" }}
              >
                {translate('common.page.button.save')}
              </Button>
            </Toolbar>}
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corpus: state.corpus,
  benchmarkTranslate: state.benchmarkTranslate
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(NewCorpusStyle)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SentenceTranslate)
  )
);

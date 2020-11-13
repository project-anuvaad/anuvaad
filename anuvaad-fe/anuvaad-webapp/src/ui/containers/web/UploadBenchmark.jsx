import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import { DropzoneArea } from "material-ui-dropzone";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import { translate } from "../../../assets/localisation";
import UploadBenchmark from "../../../flux/actions/apis/uploadbenchmark";
import APITransport from "../../../flux/actions/apitransport/apitransport";

class UploadBenchmarkfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      add_name: "",
      apiCalled: false,
      file: [],
      open: false,
      token: false,
      val: 0,
      warning: "",
      key: 1
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.apistatus.progress !== this.props.apistatus.progress) {
      this.setState({
        add_name: "",
        file: [],
        source: "",
        open: true,
        open1: true
      });

      if (prevProps.apistatus !== this.props.apistatus.progress) {
        this.setState({});
      }
    }
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSelectChange(key, event) {
    event.preventDefault();

    this.setState({
      [key]: event.target.value
    });
  }

  handleFileChange = e => {
    if (e.target.files[0]) {
      this.setState({
        file: e.target.files[0]
      });
    }
  };

  handleMultiFileChange = e => {
    if (e.target.files[0]) {
      this.setState({
        [e.target.name]: e.target.files[0]
      });
    }
  };

  handleSource = files => {
    this.setState({
      file: files,
      add_name: this.state.add_name ? this.state.add_name : files.name.split(".")[0]
    });
  };

  componentWillUnmount() {
    this.setState({ file: [] });
  }

  handleBack = () => {
    this.setState({ open1: false });
  };

  handleClose = () => {
    this.setState({ open: false, snack: false });
  };

  handleSubmit() {
    const apiObj = new UploadBenchmark(this.state.file, this.state.add_name, this.state.source);
    this.props.APITransport(apiObj);
    this.setState({ showLoader: true, tocken: false, key: this.state.key + 1 });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div style={{ marginLeft: "100px", marginTop: "60px" }}>
          <div style={{ Top: "15px", PaddingBottom: "5px" }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="Add Name">{translate("uploadBenchmark.page.label.fileNameTitle")}</InputLabel>
              <Input
                value={this.state.add_name}
                style={{ width: "200%" }}
                id="name"
                required
                onChange={event => {
                  this.handleTextChange("add_name", event);
                }}
              />
              <span style={{ color: "red" }}>{this.state.nameError}</span>
            </FormControl>
          </div>

          <br />
          <br />

          <AppBar position="static" style={{ width: "200%" }}>
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
                <MenuItem value="English">{translate("common.page.label.english")}</MenuItem>
                <MenuItem value="Hindi">{translate("common.page.label.hindi")}</MenuItem>
              </Select>
            </Toolbar>
          </AppBar>
          <div style={{ width: "200%" }}>
            <DropzoneArea
              key={this.state.key}
              style={{ width: "200%" }}
              Dropzoneiles=""
              onDrop={this.handleSource}
              id="source"
              showPreviewsInDropzone
              acceptedFiles={[".txt"]}
              dropzoneText={translate("uploadBenchmark.page.label.pleaseDrag&Drop")}
              filesLimit={1}
            />
          </div>

          <Button variant="contained" color="primary" className={classes.buttons} onClick={this.handleSubmit.bind(this)}>
            {translate("common.page.button.submit")}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corpus: state.corpus
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(UploadBenchmarkfile)));

import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Stepper from "../../../components/web/common/Stepper";
import { translate } from "../../../../assets/localisation";

class TockenExtractionSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      steps: ["Token extraction", "Apply token", "Sentence Extraction"],
      activeStep: 1
    };
  }

  render() {
    return (
      <div>
        <Stepper steps={this.state.steps} activeStep={this.props.activeStep} alternativeLabel style={{ marginTop: "3%", marginRight: "2%" }} />
        <Grid container spacing={24} style={{ marginLeft: "12%" }}>
          <Grid item xs={4} sm={4} lg={4} xl={4}>
            <Typography gutterBottom variant="h5" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
              {translate("common.page.label.workSpaceName")}
            </Typography>
            <br />
          </Grid>
          <Grid item xs={7} sm={7} lg={7} xl={7}>
            <Grid container spacing={8}>
              <Grid item xs={1} sm={1} lg={1} xl={1} />
              <Grid item xs={8} sm={8} lg={8} xl={8}>
                <TextField
                  value={this.props.workSpace}
                  disabled
                  id="outlined-name"
                  margin="normal"
                  onChange={event => {
                    this.handleTextChange("workspaceName", event);
                  }}
                  variant="outlined"
                  style={{ width: "87%" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TockenExtractionSteps));

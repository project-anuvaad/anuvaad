import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import WorkspaceDetails from "../Tool1-Pipeline/ExistingWorkspace";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import history from "../../../../web.history";
import { translate } from "../../../../assets/localisation";

class DataSource extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  render() {
    return (
      <div>
        <Toolbar style={{ marginTop: "20px", marginRight: "3%", marginLeft: "3%", padding: "0px" }}>

          <Typography variant="h5" color="inherit" style={{ flex: 1 }} />

          <Button
            variant="extendedFab"
            color="primary"
            onClick={() => {
              history.push(`${process.env.PUBLIC_URL}/stage2/create-datasource`);
            }}
          >
            <AddIcon /> {translate("common.page.label.addDataSource")}
          </Button>
        </Toolbar>

        <WorkspaceDetails />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchWorkspace: state.fetchWorkspace
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataSource));

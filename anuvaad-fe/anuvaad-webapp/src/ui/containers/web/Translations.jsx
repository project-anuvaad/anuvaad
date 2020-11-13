import React from "react";
import { withRouter } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import history from "../../../web.history";
import FetchTranslations from "../../../flux/actions/apis/translations";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";

class Corp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translations: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {}
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchTranslations();
    APITransport(apiObj);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.translations !== this.props.translations) {
      this.setState({ translations: this.props.translations });
    }
  }

  render() {
    return (
      <div style={{ marginLeft: "3%", marginRight: "3%", paddingTop: "2%"}}>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <Typography variant="h4">
            {translate("translation.page.label.translationList")}
          </Typography>
          <div style={{textAlign: "right", paddingTop: "2%"}}>
            <Button
              variant="extendedFab"
              color="primary"
              aria-label="Add"
              onClick={() => {
                history.push(`${process.env.PUBLIC_URL}/translate`);
              }}
            >
              <AddIcon /> {translate("sentenceTranslate.page.text.translateTxt")}
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          {this.props.apistatus.progress ? (
            <CircularProgress />
          ) : (
              <Paper style={{ marginTop: "2%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">{translate("common.page.label.name")}</TableCell>
                      <TableCell align="right">Created On</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.translations &&
                      Array.isArray(this.state.translations) &&
                      this.state.translations.map(row => (
                        <TableRow key={row.created_on}>
                          <TableCell align="right">{row.name}</TableCell>
                          <TableCell align="right">{row.created_on.split(",")[0]}</TableCell>
                          <TableCell align="right">{row.status}</TableCell>
                          <TableCell align="right">
                            {row.status === "COMPLETED" ? (
                              <Button
                                variant="contained"
                                onClick={() => {
                                  history.push(`${process.env.PUBLIC_URL}/view-translations/${row.basename}`);
                                }}
                                color="secondary"
                                aria-label="edit"
                              >
                                View
                              </Button>
                            ) : (
                                ""
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  translations: state.translations
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(Corp)));

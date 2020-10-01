import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import ViewIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MUIDataTable from "mui-datatables";
import Toolbar from "@material-ui/core/Toolbar";
import GradeIcon from "@material-ui/icons/Grade";
import EditIcon from "@material-ui/icons/BorderColor";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import history from "../../../web.history";
import FetchCorpus from "../../../flux/actions/apis/corp";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";

class Corp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
      role: JSON.parse(localStorage.getItem("roles"))
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchCorpus();
    APITransport(apiObj);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.corp !== this.props.corp) {
      this.setState({ name: this.props.corp });
    }
  }

  render() {
    const columns = [
      {
        name: "basename",
        label: translate("common.page.label.basename"),
        options: {
          display: "excluded"
        }
      },
      {
        name: "name",
        label: translate("viewCorpus.page.label.fileName"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "domain",
        label: translate("viewCorpus.page.label.domain"),
        options: {
          filter: true,
          sort: false
        }
      },
      {
        name: "no_of_sentences",
        label: translate("common.page.label.sentence"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "source_lang",
        label: translate("common.page.label.source"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "target_lang",
        label: translate("common.page.label.target"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "status",
        label: translate("common.page.table.status"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "created_on",
        label: translate("common.page.label.timeStamp"),
        options: {
          filter: true,
          sort: true,
          sortDirection: "desc"
        }
      },

      {
        name: "Action",
        label: translate("common.page.label.action"),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div style={{ width: "90px" }}>
                  {(tableMeta.rowData[6] === "COMPLETED" || tableMeta.rowData[6] === "IN-PROGRESS") && this.state.role.includes("editor") && (
                    <Tooltip title={translate("viewCorpus.title.editSentence")}>
                      <EditIcon
                        style={{ width: "24", height: "24", cursor: "pointer", marginLeft: "10%", marginRight: "8%",color:'#233466' }}
                        onClick={() => {
                          history.push(`${process.env.PUBLIC_URL}/parallel-corpus/${tableMeta.rowData[0]}`);
                        }}
                      >
                        {" "}
                      </EditIcon>
                    </Tooltip>
                  )}
                  {(tableMeta.rowData[6] === "COMPLETED" || tableMeta.rowData[6] === "IN-PROGRESS") && this.state.role.includes("grader") && (
                    <Tooltip title={translate("common.page.title.gradeSentence")}>
                      <GradeIcon
                        style={{ width: "24", height: "24", cursor: "pointer", marginLeft: "10%", marginRight: "8%",color:'#233466' }}
                        onClick={() => {
                          history.push(`${process.env.PUBLIC_URL}/view-corpus/${tableMeta.rowData[0]}`);
                        }}
                      >
                        {" "}
                      </GradeIcon>
                    </Tooltip>
                  )}
                  {(tableMeta.rowData[6] === "COMPLETED" || tableMeta.rowData[6] === "IN-PROGRESS") && this.state.role.includes("dev") && (
                    <Tooltip title={translate("viewCorpus.title.viewSentence")}>
                      <ViewIcon
                        style={{ width: "24", height: "24", cursor: "pointer", marginLeft: "10%", marginRight: "8%",color:'#233466' }}
                        onClick={() => {
                          history.push(`${process.env.PUBLIC_URL}/view-corpus/${tableMeta.rowData[0]}`);
                        }}
                      >
                        {" "}
                      </ViewIcon>
                    </Tooltip>
                  )}
                </div>
              );
            }
          }
        }
      }
    ];

    const options = {
      textLabels: {
        body: {
          noMatch: translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        }
      },
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none"
    };

    return (
      <div>
        <Toolbar style={{ marginLeft: "-5.4%", marginRight: "1.5%", marginTop: "20px" }}>
          <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
          {this.state.role.includes("dev") ? (
            <Button
              variant="extendedFab"
              color="primary"
              style={{ marginRight: 0}}
              aria-label="Add"
              onClick={() => {
                history.push(`${process.env.PUBLIC_URL}/newcorpus`);
              }}
            >
              <AddIcon /> {translate("commonCorpus.page.button.corpus")}
            </Button>
          ) : (
            ""
          )}
        </Toolbar>
        <div style={{ margin: "3%" }}>
          <MUIDataTable title={translate("common.page.title.document")} data={this.state.name} columns={columns} options={options} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corp: state.corp
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

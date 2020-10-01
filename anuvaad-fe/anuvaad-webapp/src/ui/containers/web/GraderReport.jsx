import MUIDataTable from "mui-datatables";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import CloseIcon from "@material-ui/icons/Close";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import GraderReportDetails from "../../../flux/actions/apis/graderreport";
import { translate } from "../../../assets/localisation";

class GraderReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchtranslation: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
      open: false,
      value: "",
      filename: "",
      snack: false,
      message: "",
      tocken: false,
      tockenValue: false,
      categoryValue: false
    };
  }

  handleClickCategoryModel = rowData => {
    this.setState({ categoryValue: true, categoryReport: rowData ? rowData[1] : "", title3: rowData[0] });
  };

  handleClick = rowData => {
    this.setState({ tocken: true, graderReport: rowData ? rowData[1] : "", title1: rowData[0] });
  };

  handleClickModel = rowData => {
    rowData[4] && this.setState({ tockenValue: true, graderRecords: rowData ? rowData[1] : "", title2: rowData[0] });
  };

  handleSubmit() {
    const { APITransport } = this.props;

    const apiObj = new GraderReportDetails(this.state.from_date, this.state.to_date);
    APITransport(apiObj);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.graderReport !== this.props.graderReport) {
      this.setState({
        graderDetails: this.props.graderReport.data
      });
    }
  }

  handleClose = value => {
    this.setState({ [value]: false });
  };

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  render() {
    const Table1columns = [
      {
        name: "username",
        label: translate("common.page.label.userName"),
        options: {
          filter: true,
          sort: true,
          sortDirection: "desc"
        }
      },

      {
        name: "models",
        label: translate("common.page.label.models"),
        options: {
          display: "excluded"
        }
      },

      {
        name: "sentence_count",
        label: translate("common.page.table.sentenceCount"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "word_count",
        label: translate("common.page.label.wordCount"),
        options: {
          filter: true,
          sort: true
        }
      }
    ];

    const options1 = {
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",

      onRowClick: !this.state.tocken ? rowData => this.handleClick(rowData) : "",
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
      }
    };

    const Table4columns = [
      {
        name: "category_name",
        label: translate("common.page.label.categoryName"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "source",
        label: translate("common.page.label.source"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "target",
        label: translate("common.page.label.target"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "rating",
        label: translate("common.page.label.sentenceMeaning"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "context_rating",
        label: translate("common.page.label.structureOfsentence"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "spelling_rating",
        label: translate("common.page.label.vocabulary"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "name_accuracy_rating",
        label: translate("common.page.label.nameAccuracy"),
        options: {
          display: this.state.categoryReport && this.state.categoryReport[0].category_name !== "Names Benchmark" ? "excluded" : "true"
        }
      },
      {
        name: "comments",
        label: translate("common.page.label.comment"),
        options: {
          filter: true,
          sort: true
        }
      }
    ];

    const Table2columns = [
      {
        name: "model_name",
        label: translate("common.page.label.modelName"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "categories",
        label: translate("common.page.label.categories"),
        options: {
          display: "excluded"
        }
      },

      {
        name: "source_lang",
        label: translate("common.page.label.sourceLanguage"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "target_lang",
        label: translate("common.page.label.targetLanguage"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "records_count",
        label: translate("common.page.table.sentenceCount"),
        options: {
          filter: true,
          sort: true
        }
      }
    ];

    const Table3columns = [
      {
        name: "category_name",
        label: translate("common.page.label.categoryName"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "records",
        options: {
          display: "excluded"
        }
      },
      {
        name: "context_rating",
        options: {
          display: "excluded"
        }
      },
      {
        name: "name_accuracy_rating",
        options: {
          display: "excluded"
        }
      },
      {
        name: "rating",
        options: {
          display: "excluded"
        }
      },
      {
        name: "spelling_rating",
        options: {
          display: "excluded"
        }
      },
      {
        name: "Total sentences",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div style={{ width: "120px" }}>{tableMeta.rowData && tableMeta.rowData.length > 0 ? tableMeta.rowData[1].length : 0}</div>
          )
        }
      },

      {
        name: "Aggregate score",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div style={{ width: "120px" }}>
              {tableMeta.rowData
                ? tableMeta.rowData[0] === "Names Benchmark"
                  ? (tableMeta.rowData[2] * 2 + tableMeta.rowData[3] * 6 + tableMeta.rowData[4] * 1 + tableMeta.rowData[5] * 1) / 10
                  : tableMeta.rowData[0] === "SC Judgement Orders"
                    ? (tableMeta.rowData[2] * 2 + tableMeta.rowData[4] * 2 + tableMeta.rowData[5] * 6) / 10
                    : (tableMeta.rowData[2] * 6 + tableMeta.rowData[4] * 3 + tableMeta.rowData[5] * 1) / 10
                : 0}
            </div>
          )
        }
      }
    ];

    const options2 = {
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",

      onRowClick: !this.state.tockenValue
        ? rowData => this.handleClickModel(rowData)
        : !this.state.categoryValue
          ? rowData => this.handleClickCategoryModel(rowData)
          : ""
    };

    return (
      <div>
        {!this.state.tocken ? (
          <div>
            <Grid container spacing={24} style={{ padding: 5, marginLeft: "3%", marginRight: "3%" }}>
              <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "38px" }}>
                <Typography variant="h5" color="inherit">
                  {translate("common.page.label.fromDate")}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "20px" }}>
                <TextField
                  id={this.state.from_date}
                  value={this.state.from_date}
                  type="date"
                  onChange={event => {
                    this.handleTextChange("from_date", event);
                  }}
                  margin="normal"
                  varient="outlined"
                  style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}
                />{" "}
              </Grid>

              <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginLeft: "2%", marginTop: "38px" }}>
                <Typography variant="h5" color="inherit">
                  {translate("common.page.label.toDate")}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "20px" }}>
                <TextField
                  id={this.state.to_date}
                  value={this.state.to_date}
                  type="date"
                  onChange={event => {
                    this.handleTextChange("to_date", event);
                  }}
                  margin="normal"
                  varient="outlined"
                  style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}
                />
              </Grid>

              <Grid item xs={3} sm={3} lg={3} xl={3} style={{ marginTop: "34px" }}>
                <Button
                  variant="contained"
                  onClick={event => {
                    this.handleSubmit();
                  }}
                  color="primary"
                  aria-label="edit"
                  style={{ width: "170px", marginLeft: "50%", marginBottom: "4%", marginTop: "1px" }}
                >
                  {translate("common.page.button.submit")}
                </Button>
              </Grid>
            </Grid>
            <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "2%", marginBottom: '5%' }}>
              <MUIDataTable
                title={translate("GraderReport.page.title.graderDetails")}
                data={this.state.graderDetails ? this.state.graderDetails : []}
                columns={Table1columns}
                options={options1}
              />
            </div>
          </div>
        ) : (
            <div style={{ marginLeft: "3%", marginRight: "3%" }}>
              <div style={{textAlign: "right"}}>
                <Fab
                  variant="extended"
                  color="primary"
                  aria-label="Add"
                  style={{ marginTop: "1%"}}
                  onClick={() => {
                    this.handleClose(
                      this.state.categoryValue
                        ? translate("gradeReport.page.label.categoryValue")
                        : this.state.tockenValue
                          ? translate("common.page.label.tockenValue")
                          : "tocken"
                    );
                  }}
                >
                  <CloseIcon />
                  {!this.state.categoryReport && !this.state.tockenValue && this.state.tocken
                    ? translate("common.page.label.close")
                    : translate("common.page.button.back")}
                </Fab>
              </div>
              {!this.state.tockenValue ? (
                <div style={{ marginTop: "2%", marginBottom: '5%' }}>
                  <MUIDataTable
                    title={this.state.title1 ? this.state.title1 : translate("gradeReport.page.label.modelDetails")}
                    data={this.state.graderReport ? this.state.graderReport : []}
                    columns={Table2columns}
                    options={options2}
                  />
                </div>
              ) : !this.state.categoryValue ? (
                <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "2%", marginBottom: '5%' }}>
                  <MUIDataTable
                    title={this.state.title2 ? this.state.title2 : translate("common.page.title.categoryDetails")}
                    data={this.state.graderRecords ? this.state.graderRecords : []}
                    columns={Table3columns}
                    options={options2}
                  />
                </div>
              ) : (
                    <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "2%", marginBottom: '5%' }}>
                      <MUIDataTable
                        title={this.state.title3 ? this.state.title3 : translate("gradeReport.page.label.gradedRecords")}
                        data={this.state.categoryReport ? this.state.categoryReport : []}
                        columns={Table4columns}
                        options={options2}
                      />
                    </div>
                  )}
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchtranslation: state.fetchtranslation,
  graderReport: state.graderReport
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GraderReport));

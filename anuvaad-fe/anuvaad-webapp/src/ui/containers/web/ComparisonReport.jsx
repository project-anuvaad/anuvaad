import MUIDataTable from "mui-datatables";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import ComparisonDetailReport from "../../../flux/actions/apis/comparisonreport";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import CloseIcon from "@material-ui/icons/Close";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { translate } from '../../../assets/localisation';

class ComparisonReport extends React.Component {
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
      detailedReport: false
    };
  }

  handleClick = rowData => {
    this.setState({ tocken: true, categoryReport: rowData ? rowData[1] : '', title: rowData[0] });
  };

  handleClickModel = rowData => {
    this.setState({ tockenValue: true, detailedReport: rowData ? rowData[1] : '' });
  };

  handleSubmit() {
    const { APITransport } = this.props;

    const apiObj = new ComparisonDetailReport(this.state.from_date, this.state.to_date);
    APITransport(apiObj);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.graderReport !== this.props.graderReport) {
      this.setState({
        graderDetails: this.props.graderReport
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
        name: "model_name",
        label: translate('common.page.label.modelName'),
        options: {
          filter: false,
          sort: true,
          sortDirection: "desc"
        }
      },

      {
        name: "categories",
        label: translate('common.page.label.record'),
        options: {
          filter: false,
          display: "excluded"
        }
      },


      {
        name: "source_lang",
        label: translate('common.page.label.source'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "target_lang",
        label: translate('common.page.label.target'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "sentence_count",
        label: translate("common.page.table.sentenceCount"),
        options: {
          filter: false,
          sort: true
        }
      },
      {
        name: "word_count",
        label: translate('common.page.label.wordCount'),
        options: {
          filter: false,
          sort: true
        }
      },


      {
        name: "rating",
        label: translate('common.page.label.sentenceMeaning'),
        options: {
          filter: false,
          sort: true
        }
      },
      {
        name: "context_rating",
        label: translate('common.page.label.structureOfsentence'),

        options: {
          filter: false,
          sort: true
        }
      },

      {
        name: "spelling_rating",
        label: translate('common.page.label.vocabulary'),
        options: {
          filter: false,
          sort: true
        }
      }
      ,

      {
        name: "Maximum Score",
        label: translate('common.page.label.maxScore'),
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div style={{ width: "120px" }}>{tableMeta.rowData && tableMeta.rowData[4] !== 0 ? tableMeta.rowData[4] * 5 : "-"}</div>;
          }
        }
      }
    ];


    const options1 = {
      textLabels: {
          body: {
            noMatch: translate('gradeReport.page.muiNoTitle.sorryRecordNotFound')
          },
        toolbar: {
          search: translate('graderReport.page.muiTable.search'),
          viewColumns: translate('graderReport.page.muiTable.viewColumns'),
          filterTable: translate('graderReport.page.muiTable.filterTable'),
        },
        pagination: {
          rowsPerPage: translate('graderReport.page.muiTable.rowsPerPages'),
        },
        
      },
      filterType: "dropdown",
      download: false,
      print: false,
      fixedHeader: true,
      filter: true,
      selectableRows: "none",

      onRowClick: !this.state.tocken ? rowData => this.handleClick(rowData) : !this.state.tockenValue ? rowData => this.handleClickModel(rowData) : ''
    };

    const Table2columns = [
      {
        name: "category_name",
        label: translate('common.page.label.categoryName'),
        options: {
          filter: true,
          sort: true,
          sortDirection: "desc"
        }
      },

      {
        name: "records",
        options: {
          display: "excluded"
        }
      },



      {
        name: "Total Sentence",
        options: {
          filter: true,
          sort: true,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div style={{ width: "120px" }}>{tableMeta.rowData && tableMeta.rowData[1] !== 0 ? tableMeta.rowData[1].length : ""}</div>;
          }
        }
      },

      {
        name: "rating",
        label: translate('common.page.label.sentenceMeaning'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "context_rating",
        label: translate('common.page.label.structureOfsentence'),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "spelling_rating",
        label: translate('common.page.label.vocabulary'),
        options: {
          filter: true,
          sort: true
        }
      }
      ,
      {
        name: "name_accuracy_rating",
        options: {
          display: "excluded"
        }
      },

      {
        name: "Names Accuracy",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div style={{ width: "120px" }}>{tableMeta.rowData && tableMeta.rowData[6] !== 0 ? tableMeta.rowData[6] : "-"}</div>;
          }
        }
      },

      {
        name: "Maximum Score",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div style={{ width: "120px" }}>{tableMeta.rowData && tableMeta.rowData[1] !== 0 ? tableMeta.rowData[1].length * 5 : "-"}</div>;
          }
        }
      }
    ];


    const Table3columns = [
      {
        name: "category_name",
        label: translate('common.page.label.categoryName'),
        options: {
          filter: true,
          sort: true,
          sortDirection: "desc"
        }
      },

      {
        name: "source",
        label: translate('common.page.label.source'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "target",
        label: translate('common.page.label.target'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "rating",
        label: translate('common.page.label.sentenceMeaning'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "context_rating",
        label: translate('common.page.label.structureOfsentence'),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "spelling_rating",
        label: translate('common.page.label.vocabulary'),
        options: {
          filter: true,
          sort: true
        }
      }
      ,
      {
        name: "name_accuracy_rating",
        options: {
          display: "excluded"
        }
      },



      {
        name: "name_accuracy_rating",
        label: translate('common.page.label.nameAccuracy'),
        options: {
          display: this.state.detailedReport && this.state.detailedReport[0].category_name !== "Names Benchmark" ? "excluded" : "true"
        }
      }
      ,
      {
        name: "comments",
        label: translate('common.page.label.comment'),
        options: {
          filter: true,
          sort: true
        }
      }

    ];

    const options2 = {
      filterType: "checkbox",
      print: false,
      fixedHeader: true,
      filter: false,
      download: true,
      downloadOptions: { filename: "Comparison-Report.csv" },
      onDownload: (buildHead, buildBody, columns, data) => buildHead(headerNames) + buildBody(data),
      onRowClick: ""
    };

    const headerNames = [
      {
        name: "Category Name",
        download: true
      },
      {
        name: "Source",
        download: true
      },
      {
        name: "Target",
        download: true
      },
      {
        name: "Meaning of sentence",
        download: true
      },
      {
        name: "Structure of sentence",
        download: true
      },
      {
        name: "Vocabulary / Lexicon",
        download: true
      },
      {
        name: "Comments",
        download: true
      }
    ];

    return (
      <div>
        {!this.state.tocken ? (
          <div>
            <Grid container spacing={24} style={{ padding: 5, marginLeft: "3%",marginRight: "3%"  }}>
              <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "38px" }}>
                <Typography variant="h5" color="inherit">
                  {translate('common.page.label.fromDate')}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "20px", width: "40px" }}>
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
                  {translate('common.page.label.toDate')}
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
                  color={"primary"}
                  aria-label="edit"
                  style={{ width: "170px", marginLeft: "50%", marginBottom: "4%", marginTop: "1px" }}
                >
                  {translate('common.page.button.submit')}
                </Button>
              </Grid>
            </Grid>
            <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }}>
              <MUIDataTable title={translate('common.page.title.comparisonReport')} data={this.state.graderDetails ? this.state.graderDetails : []} columns={Table1columns} options={options1} />
            </div>
          </div>
        ) : (
            <div>
              <Fab
                variant="extended"
                color="primary"
                aria-label="Add"
                style={{ marginTop: "1%" }}
                onClick={() => {
                  this.handleClose(this.state.tockenValue ? "tockenValue" : "tocken");
                }}
              >
                <CloseIcon /> {translate('common.page.button.back')}
              </Fab>




              {!this.state.tockenValue ? (
                <div style={{  marginLeft: "3%", marginRight: "3%", marginTop: "40px" }}>
                  <MUIDataTable
                    title={this.state.title ? this.state.title : translate('common.page.title.categoryDetails')}
                    data={this.state.categoryReport ? this.state.categoryReport : []}
                    columns={Table2columns}
                    options={options1}
                  />
                </div>
              ) : (
                  <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }}>
                    <MUIDataTable
                      title={this.state.detailedReport && this.state.detailedReport[0].category_name}
                      data={this.state.detailedReport ? this.state.detailedReport : []}
                      columns={Table3columns}
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
  graderReport: state.comparisonreport
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ComparisonReport)
);

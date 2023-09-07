import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { translate } from "../../../../assets/localisation";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import FileContent from "../../../../flux/actions/apis/document_translate/fetchcontent";
import UserReportHeader from "./UserReportHeader"
import DataTable from "../../../components/web/common/DataTable";
import { CustomTableFooter } from "../../../components/web/common/CustomTableFooter";
import { Grid, IconButton } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import history from "../../../../web.history";

class DocumentStats extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.pageInputRef = React.createRef();
    this.state = {
      role: localStorage.getItem("roles"),
      data: [],
      showLoading: false,
      isInputActive: false,
      inputPageNumber: 1,
      currentPageIndex: 0
    };
  }

  componentDidMount() {
    const { APITransport } = this.props
    const apiObj = new FileContent(this.props.match.params.recordId, "0", "0", true);
    APITransport(apiObj)
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          padding: '3px 10px 3px',
        },
      },
    }
  })

  processTableClickedNextOrPrevious = (page) => {
    if (this.state.currentPageIndex < page) {
      this.setState({
        currentPageIndex: page,
        offset: this.state.offset + this.state.limit
      });
    }
  };

  onChangePageMAnually = () => {
    // console.log("offset", 0);
    // console.log("limit (Number(this.state.inputPageNumber)-1)*10 ---> ", this.props.job_details.count);
    // this.makeAPICallJobsBulkSearch(0, (Number(this.state.inputPageNumber)-1)*10, false, false, true)
    this.tableRef.current.changePage(Number(this.state.inputPageNumber) - 1);
    this.setState({ currentPageIndex: this.state.inputPageNumber - 1 }, () => {
      this.makeAPICallDocumentsTranslationProgress();
    });
  }

  handleInputPageChange = (event, totalPageCount) => {
    if (event.target.value <= totalPageCount) {
      this.setState({ inputPageNumber: event.target.value })
    } else if (event.target.value > totalPageCount) {
      this.setState({ inputPageNumber: totalPageCount })
    } else if (event.target.value == 0) {
      this.setState({ inputPageNumber: 1 })
    } else if (event.target.value < 0) {
      this.setState({ inputPageNumber: 1 })
    }
  }

  render() {
    const columns = [
      {
        name: "s0_src",
        label: 'Source',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        name: "s0_tgt",
        label: "Machine Translation",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "tgt",
        label: 'Proof Read',
        options: {
          filter: false,
          sort: true,
        }
      },

      {
        name: "bleu_score",
        label: "Bleu Score",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "time_spent",
        label: "Time Spent",
        options: {
          filter: false,
          sort: false,
        }
      }, {
        name: "rating_score",
        label: "Rating",
        options: {
          filter: false,
          sort: false,
        }
      }
    ];


    const options = {
      textLabels: {
        body: {
          noMatch: "Loading...."
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        },
        options: { sortDirection: 'desc' }
      },
      // onTableChange: (action, tableState) => {
      //   switch (action) {
      //     case 'changePage':
      //       this.processTableClickedNextOrPrevious(tableState.page)
      //       break;
      //     default:
      //   }
      // },
      count: this.props.fetchContent.data?.length,
      rowsPerPageOptions: [10],
      filterType: "checkbox",
      download: true,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: 'registered_time',
        direction: 'desc'
      },
      page: this.state.currentPageIndex,
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage
      ) => {
        const startIndex = page * rowsPerPage;
        const endIndex = (page + 1) * rowsPerPage;
        const totalPageCount = Math.ceil(this.props.fetchContent.data?.length / 10);
        return (
          <CustomTableFooter
            renderCondition={totalPageCount > 0}
            countLabel={"Total Records"}
            totalCount={this.props.fetchContent.data?.length}
            pageInputRef={this.pageInputRef}
            inputValue={this.state.inputPageNumber}
            onInputFocus={()=>this.setState({ isInputActive: true })}
            onInputBlur={()=>this.setState({ isInputActive: false })}
            handleInputChange={this.handleInputPageChange}
            totalPageCount={totalPageCount}
            onGoToPageClick={this.onChangePageMAnually}
            onBackArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex - 1 })
              this.tableRef.current.changePage(Number(this.state.currentPageIndex - 1))
            }
            }
            onRightArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex + 1 })
              this.tableRef.current.changePage(Number(this.state.currentPageIndex + 1))
            }
            }
            backArrowTabIndex={this.state.currentPageIndex - 1}
            backArrowDisable={this.state.currentPageIndex == 0}
            rightArrowTabIndex={this.state.currentPageIndex + 1}
            rightArrowDisable={this.state.currentPageIndex == (totalPageCount-1)}
            pageTextInfo={`Page ${parseInt(this.state.currentPageIndex + 1)} of ${parseInt(totalPageCount)}`}
          />
        );
      }
    };

    return (
      <div style={{
        height: window.innerHeight,
        overflow: 'auto'
      }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <UserReportHeader />
          <Grid>
          <IconButton onClick={()=>history.goBack()}><ArrowBackIcon /></IconButton>
          </Grid>
          {
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <DataTable title={this.props.match.params.fname}
                columns={columns} options={options}
                data={this.props.apistatus.progress ? [] : this.props.fetchContent.data} 
                innerRef={this.tableRef}
              />
            </MuiThemeProvider>
          }
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => ({
  fetchContent: state.fetchContent,
  apistatus: state.apistatus
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    APITransport,
    FileContent,
  },
  dispatch
);
export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(DocumentStats)));

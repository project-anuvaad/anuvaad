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

class DocumentStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roles"),
      data: [],
      showLoading: false
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
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.processTableClickedNextOrPrevious(tableState.page)
            break;
          default:
        }
      },
      count: this.props.count,
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
      page: this.state.currentPageIndex
    };

    return (
      <div style={{
        height: window.innerHeight,
        overflow: 'auto'
      }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <UserReportHeader />
          {
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={this.props.match.params.fname}
                columns={columns} options={options}
                data={this.props.apistatus.progress ? [] : this.props.fetchContent.data} />
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

import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SelectModel from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import GradeIcon from "@material-ui/icons/Grade";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import history from "../../../web.history";
import FetchBenchmark from "../../../flux/actions/apis/benchmark";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import Select from "../../components/web/common/Select";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import { translate } from "../../../assets/localisation";

class Benchmark extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      modelLanguage: [],
      language: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
      role: JSON.parse(localStorage.getItem("roles"))
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchBenchmark();
    const apiLang = new FetchLanguage();
    APITransport(apiObj);

    const apiModel = new FetchModel();
    APITransport(apiModel);

    APITransport(apiLang);
  }

  handleSelectChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      id: event.target.id
    });
  };

  handleTarget(modelLanguage, supportLanguage, sourceLanguage) {
    const result = [];
    let name = "";

    supportLanguage.map(value => (value.language_name === sourceLanguage ? (name = value.language_code) : ""));

    modelLanguage.map(item => {
      item.source_language_code === name &&
        supportLanguage.map(value => (item.target_language_code === value.language_code ? result.push(value) : null));
      return true;
    });
    const value = new Set(result);
    const target_language = [...value];

    return target_language;
  }

  handleModel(modelLanguage, source, target) {
    const result = [];
    let name = "";
    this.state.language.map(value => (value.language_name === source ? (name = value.language_code) : ""));
    modelLanguage.map(item => {
      item.source_language_code === name && item.target_language_code === target && result.push(item);
      return true;
    });
    return result;
  }

  handleSubmit(row, modelid) {
    history.push(`${process.env.PUBLIC_URL}/fetch-benchmark-sentences/${row}/${modelid}`);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchBenchmark !== this.props.fetchBenchmark) {
      this.setState({ name: this.props.fetchBenchmark });
    }

    if (prevProps.supportLanguage !== this.props.supportLanguage) {
      this.setState({
        language: this.props.supportLanguage
      });
    }

    if (prevProps.langModel !== this.props.langModel) {
      this.setState({
        modelLanguage: this.props.langModel
      });
    }

    if (prevProps.fetchBenchmarkModel !== this.props.fetchBenchmarkModel) {
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
        label: translate("common.page.label.category"),
        options: {
          filter: true,
          sort: true
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
        name: "Target",
        label: translate("common.page.label.target"),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              const name = `target-${tableMeta.rowData[0]}`;
              return (
                <Select
                  style={{
                    fullWidth: true,
                    display: "flex",
                    wrap: "nowrap",
                    minWidth: 160,
                    maxWidth: 100
                  }}
                  id="outlined-age-simple"
                  selectValue="language_code"
                  MenuItemValues={tableMeta.rowData[3] ? this.handleTarget(this.state.modelLanguage, this.state.language, tableMeta.rowData[3]) : []}
                  handleChange={this.handleSelectChange}
                  value={this.state[name]}
                  name={name}
                  val={tableMeta.rowData[0]}
                />
              );
            }
          }
        }
      },

      {
        name: "Model",
        label: translate("common.page.label.models"),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              const targetname = `target-${tableMeta.rowData[0]}`;
              const modelname = `model-${tableMeta.rowData[0]}`;
              return (
                <SelectModel
                  style={{ minWidth: 160, align: "right", maxWidth: 100 }}
                  name={modelname}
                  key={tableMeta.rowData[0]}
                  value={this.state[modelname]}
                  onChange={this.handleSelectChange}
                  input={<OutlinedInput name={this.state.model} id="outlined-age-simple" />}
                >
                  {tableMeta.rowData[3] && this.state[targetname]
                    ? this.handleModel(this.state.modelLanguage, tableMeta.rowData[3], this.state[targetname]).map(item => (
                      <MenuItem key={item.model_id} value={item.model_id}>
                        {item.model_name}
                      </MenuItem>
                    ))
                    : []}
                  
                </SelectModel>
              );
            }
          }
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
              const targetname = `target-${tableMeta.rowData[0]}`;
              const modelname = `model-${tableMeta.rowData[0]}`;
              return (
                <div style={{ width: "90px" }}>
                  {this.state[targetname] && this.state[modelname] && (
                    <Tooltip title={translate("common.page.title.gradeSentence")}>
                      <GradeIcon
                        style={{ width: "24", color: '#233466', height: "24", cursor: "pointer", marginLeft: "10%", marginRight: "8%" }}
                        onClick={() => {
                          this.handleSubmit(tableMeta.rowData[0], this.state[modelname]);
                        }}
                      >
                        {" "}
                      </GradeIcon>
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
        {/* <Toolbar style={{ marginLeft: "-5.4%", marginRight: "1.5%" }}>
          <Typography variant="title" color="inherit" style={{ flex: 1 }} />
        </Toolbar> */}
        <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "3%", marginBottom: '0%' }}>
          <MUIDataTable title={translate("common.page.title.document")} data={this.state.name} columns={columns} options={options} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchBenchmark: state.fetchBenchmark,
  langModel: state.langModel,
  supportLanguage: state.supportLanguage,
  fetchBenchmarkModel: state.fetchBenchmarkModel
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(Benchmark)));

import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { translate } from "../../../../assets/localisation";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import Header from './ViewUserGlossaryHeader';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewGlossary from '../../../../flux/actions/apis/user_glossary/fetch_user_glossary';
import Spinner from "../../../components/web/common/Spinner";
import DeleteGlossary from '../../../../flux/actions/apis/user_glossary/delete_glossary';
import Snackbar from "../../../components/web/common/Snackbar";
import { Button, Grid } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteTmx from "../../../../flux/actions/apis/tmx/tmxDelete";
import DataTable from "../../../components/web/common/DataTable";
import history from "../../../../web.history";
import ConfirmBox from "../../../components/web/common/ConfirmBox";

var delete_glossary = require("../../../../utils/deleteGlossary.operation");

const getMuiTheme = () =>
    createMuiTheme({
        overrides: {
            MUIDataTableBodyCell: {
                root: {
                    padding: "3px 10px 3px",
                    overflow: "auto"
                },
            },
        },
    });

class MyGlossary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: false,
            message: "",
            variant: 'success',
            loadMsg: "",
            rowsToDelete: [],
            openConfirmDialog: false,
            openSingleGlossaryDeleteConfirmBox: false,
            singleDeletionArr: [],
            openDeleteSelectedGlossaryConfirmDialogue: false
        }
    }
    getUserGlossary = async () => {
        let self = this;
        const { APITransport } = this.props
        let userID = JSON.parse(localStorage.getItem("userProfile")).userID;
        let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
        let apiObj = new ViewGlossary(userID, orgID);
        APITransport(apiObj);
        // this.setState({ loading: false })
    }
    componentDidMount() {
        if (this.props.glossaryData.count === 0) {
            this.setState({ loading: true })
            this.getUserGlossary();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.glossaryData.hasOwnProperty("deleted") && !this.props.glossaryData.delete && this.state.loading) {
            this.setState({ loading: false })
        }
        if (prevProps.glossaryData.count > this.props.glossaryData.count && this.props.glossaryData.deleted) {
            this.setState({ open: true, message: 'Glossary deleted successfully', variant: 'success' }, () => {
                setTimeout(() => this.setState({ open: false, message: "", variant: "info" }), 3000)
            })
        }
    }

    makeDeleteGlossaryAPICall = (userId, orgID, src, tgt, locale, reverseLocale, context, bulkDelete = false, deletionArray = []) => {
        // console.log(`userId, src, tgt, locale, reverseLocale, context, bulkDelete = false, deletionArray = []`);
        // console.log(userId, src, tgt, locale, reverseLocale, context, bulkDelete, deletionArray);
        this.setState({ open: true, message: 'Glossary deletion in progress...', variant: 'info' })
        // let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
        let apiObj = new DeleteGlossary(userId, orgID, src, tgt, locale, reverseLocale, context, bulkDelete, deletionArray);
        let payloadObj = apiObj.getBody();
        payloadObj.orgID && delete payloadObj.orgID;
        fetch(apiObj.apiEndPoint(), {
            method: 'post',
            headers: apiObj.getHeaders().headers,
            body: JSON.stringify(payloadObj)
        })
            .then(async res => {
                if (res.ok) {
                    this.setState({ open: false })
                    let apiObj = new ViewGlossary(userId, orgID)
                    let { APITransport } = this.props
                    APITransport(apiObj)
                    return true;
                } else {
                    this.setState({ open: true, message: 'Glossary deletion failed', variant: 'error' })
                    return false;
                }
            })
    }

    makeDeleteAllGlossaryAPICall = (userObj, context) => {
        this.setState({ open: true, message: 'Glossary deletion in progress...', variant: 'info', openConfirmDialog: false })
        let apiObj = new DeleteTmx(userObj, context)
        // console.log("apiObj.getBody()", apiObj.getBody());
        let userID = JSON.parse(localStorage.getItem("userProfile")).userID;
        let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
        fetch(apiObj.apiEndPoint(), {
            method: 'post',
            headers: apiObj.getHeaders().headers,
            body: JSON.stringify(apiObj.getBody())
        })
            .then(async res => {
                if (res.ok) {
                    this.setState({ open: false })
                    let apiObj = new ViewGlossary(userID, orgID)
                    let { APITransport } = this.props
                    APITransport(apiObj)
                    return true;
                } else {
                    this.setState({ open: true, message: 'Glossary deletion failed', variant: 'error' })
                    return false;
                }
            })
    }

    handleDeleteAllGlossary = () => {
        // console.log("handleDeleteAllGlossary")
        this.setState({ openConfirmDialog: true })
    }

    handleCloseConfirmBox = () => {
        this.setState({ openConfirmDialog: false })
    }

    renderDeleteAllGlossaryButton = () => {
        return (
            <div style={{ textAlign: "end", marginBottom: "1rem" }}>
                <Button
                    onClick={() => this.handleDeleteAllGlossary()}
                    variant="contained"
                    color="primary"
                    style={{
                        borderRadius: "10px",
                        color: "#FFFFFF",
                        backgroundColor: "#D32F2F",
                        height: "35px",
                        fontSize: "16px",
                        textTransform: "none",
                    }}
                    size="small"
                >
                    Delete All Glossary
                </Button>
                <ConfirmBox
                    open={this.state.openConfirmDialog}
                    onClose={() => this.handleCloseConfirmBox()}
                    title="Delete all glossary"
                    contentText="Are you sure you want to delete all glossary?"
                    onConfirm={() => this.makeDeleteAllGlossaryAPICall({ userID: JSON.parse(localStorage.getItem("userProfile")).userID }, "JUDICIARY")}
                />
                {/* <Dialog
                    open={this.state.openConfirmDialog}
                    onClose={() => this.handleCloseConfirmBox()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete all glossary"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete all glossary?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.makeDeleteAllGlossaryAPICall({ userID: JSON.parse(localStorage.getItem("userProfile")).userID }, "JUDICIARY")} style={{textTransform: "none"}} color="primary">
                            Confirm
                        </Button>
                        <Button onClick={() => this.handleCloseConfirmBox()} style={{textTransform: "none"}} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog> */}
            </div>
        )
    }

    handleDeleteSelectedGlossaryBox = () => {
        this.setState({ openDeleteSelectedGlossaryConfirmDialogue: false })
    }

    renderDeleteSelectedGlossaryConfirmBox = () => {
        return (
            <div style={{ textAlign: "end", marginBottom: "1rem" }}>
                <ConfirmBox
                    open={this.state.openDeleteSelectedGlossaryConfirmDialogue}
                    onClose={() => this.handleDeleteSelectedGlossaryBox()}
                    title="Delete Selected glossary"
                    contentText="Are you sure you want to delete selected glossary?"
                    onConfirm={() => this.deleteMultipleRows()}
                />
                {/* <Dialog
                    open={this.state.openDeleteSelectedGlossaryConfirmDialogue}
                    onClose={() => this.handleDeleteSelectedGlossaryBox()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete Selected glossary"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete selected glossary?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.deleteMultipleRows()} color="primary">
                            Confirm
                        </Button>
                        <Button onClick={() => this.handleDeleteSelectedGlossaryBox()} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog> */}
            </div>
        )
    }

    handleDeleteGlossary = (dataArray) => {
        let reverseLocale = dataArray[3].split("|").reverse().join("|");
        let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
        this.makeDeleteGlossaryAPICall(dataArray[2], orgID, dataArray[0], dataArray[1], dataArray[3], reverseLocale, dataArray[4]);
        this.setState({ openSingleGlossaryDeleteConfirmBox: false });
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    deleteMultipleRows = () => {
        let isOrg = delete_glossary.isOrg(this.props.glossaryData, this.state.rowsToDelete)
        this.handleDeleteSelectedGlossaryBox()
        if (!isOrg) {
            let userId = JSON.parse(localStorage.getItem("userProfile")).userID
            let rowsToBeDeleted = delete_glossary.getBulkDeletionArray(this.props.glossaryData, this.state.rowsToDelete);
            let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
            this.makeDeleteGlossaryAPICall(userId, orgID, "", "", "", "", "JUDICIARY", true, rowsToBeDeleted)
        } else {
            this.setState({ open: true, message: "Cannot delete glossary of type Organization..", variant: "error" })
        }
        setTimeout(() => {
            this.setState({ open: false, message: "", variant: "" })
        }, 2000)
    }

    render() {
        const columns = [
            {
                name: "src",
                label: translate("common.page.label.source"),
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "tgt",
                label: translate("common.page.label.target"),
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "userID",
                label: "User ID",
                options: {
                    filter: false,
                    sort: false,
                    display: 'excluded',
                    download: false
                },
            },
            {
                name: "locale",
                label: "Locale",
                options: {
                    filter: false,
                    sort: false,
                    display: 'excluded'
                },
            },
            {
                name: "context",
                label: "Context",
                options: {
                    filter: false,
                    sort: false,
                    display: 'excluded'
                },
            },
            {
                name: "typeOfGlossary",
                label: "Glossary Type",
                option: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: "Action",
                label: translate("common.page.label.action"),
                filter: true,
                options: {
                    sort: false,
                    empty: true,
                    download: false,
                    viewColumns: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            return (
                                <div>
                                    <Tooltip title="Delete Glossary" placement="left">
                                        <IconButton
                                            style={{ color: tableMeta.rowData[5] === "Organization" ? "grey" : "#233466", padding: "5px" }}
                                            component="a"
                                            onClick={() => { this.setState({ openSingleGlossaryDeleteConfirmBox: true, singleDeletionArr: tableMeta.rowData }) }}
                                            disabled={tableMeta.rowData[5] === "Organization"}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <ConfirmBox
                                        open={this.state.openSingleGlossaryDeleteConfirmBox && this.state.singleDeletionArr.length > 0}
                                        onClose={() => this.setState({ openSingleGlossaryDeleteConfirmBox: false })}
                                        title="Delete glossary"
                                        contentText={"Are you sure you want to delete " + this.state.singleDeletionArr[0] + " - " + this.state.singleDeletionArr[1] + " glossary?"}
                                        onConfirm={() => this.handleDeleteGlossary(this.state.singleDeletionArr)}
                                        BackdropProps={{
                                            style: {
                                                backgroundColor: 'rgba(0,0,0,0.15)',
                                                boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 2%)',
                                            }
                                        }}
                                    />
                                    {/* <Dialog
                                        open={this.state.openSingleGlossaryDeleteConfirmBox && this.state.singleDeletionArr.length > 0}
                                        onClose={() => this.setState({ openSingleGlossaryDeleteConfirmBox: false })}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                        BackdropProps={{
                                            style:{
                                                backgroundColor: 'rgba(0,0,0,0.2)',
                                                boxShadow: 'none',
                                            }
                                        }}                  
                                    >
                                        <DialogTitle id="alert-dialog-title">{"Delete glossary"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Are you sure you want to delete {this.state.singleDeletionArr[0]} - {this.state.singleDeletionArr[1]} glossary?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => {
                                                // console.log("confirm tableMeta.rowData", this.state.singleDeletionArr);
                                                this.handleDeleteGlossary(this.state.singleDeletionArr)
                                            }}
                                                style={{fontWeight: "400", color: "#3f51b5", textTransform: "none"}}>
                                                Confirm
                                            </Button>
                                            <Button onClick={() => this.setState({ openSingleGlossaryDeleteConfirmBox: false })} style={{fontWeight: "400", color: "#3f51b5", textTransform: "none"}}>
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </Dialog> */}
                                </div>
                            );
                        }
                    },
                },
            },
        ];

        const options = {
            textLabels: {
                body: {
                    noMatch: translate("gradeReport.page.muiNoTitle.sorryRecordNotFound"),
                },
                toolbar: {
                    search: translate("graderReport.page.muiTable.search"),
                    viewColumns: translate("graderReport.page.muiTable.viewColumns"),
                },
                pagination: {
                    rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages"),
                },
                options: { sortDirection: "desc" },
            },
            rowsPerPageOptions: [10],
            count: this.props.glossaryData.count,
            filterType: "checkbox",
            download: this.props.glossaryData.result.length > 0 ? true : false,
            print: false,
            fixedHeader: true,
            filter: false,
            sortOrder: {
                name: "timestamp",
                direction: "desc",
            },
            onRowSelectionChange: (currentSelectedRows, allRowsSelected, rowsSelected) => {
                this.setState({ rowsToDelete: allRowsSelected })
            },
            onRowsDelete: () => {
                this.setState({ openDeleteSelectedGlossaryConfirmDialogue: true })
            }
        };
        return (
            <div style={{}}>
                <div style={{ margin: "0% 3% 3% 3%", paddingTop: "2%" }}>
                    {/* <Header /> */}
                    {this.state.loading ?
                        <Spinner />
                        :
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <Grid container direction="row" justify="flex-end">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        borderRadius: "10px",
                                        color: "#FFFFFF",
                                        backgroundColor: "#2C2799",
                                        height: "35px",
                                        fontSize: "16px",
                                        textTransform: "none",
                                        marginRight: 5
                                    }}
                                    size="small"
                                    onClick={() => history.push(`${process.env.PUBLIC_URL}/user-glossary-upload`)}
                                >
                                    Create Glossary
                                </Button>
                                {this.renderDeleteAllGlossaryButton()}
                            </Grid>

                            {this.renderDeleteSelectedGlossaryConfirmBox()}
                            <DataTable
                                title={translate("common.page.title.glossary")}
                                columns={columns}
                                options={options}
                                data={this.props.glossaryData.result}
                            />
                        </MuiThemeProvider>
                    }
                </div>
                {this.state.open &&
                    <Snackbar
                        open={this.state.open}
                        message={this.state.message}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        autoHideDuration={3000}
                        onClose={this.handleClose}
                        variant={this.state.variant}
                    />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    glossaryData: state.fetchglossary,
    apistatus: state.apistatus,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            APITransport
        },
        dispatch
    );

export default withRouter(
    withStyles(NewCorpusStyle)(
        connect(mapStateToProps, mapDispatchToProps)(MyGlossary)
    )
);
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import GlobalStyles from "../../styles/GlobalStyles";
// import getAnuvaadSupportedLanguages from "../../../../flux/actions/apis/analytics/getSupportedLangList";
import getAnuvaadTranslatedAndVerifiedSetenceCount from "../../../../flux/actions/apis/analytics/getTranslatedAndVerifiedSetenceCount";
import getAnuvaadCountByLang from "../../../../flux/actions/apis/analytics/getCountByLang";
import getAnuvaadDocumentCountPerOrg from "../../../../flux/actions/apis/analytics/getDocumentCountPerOrg";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import DocumentCountByLang from "../../../components/web/Analytics/DocumentCountByLang";
import TranslatedAndVarifiedSentenceByLang from "../../../components/web/Analytics/TranslatedAndVarifiedSentenceByLang";
import DocumentCountByOrg from "../../../components/web/Analytics/DocumentCountByOrg";
import getAnuvaadSupportedLanguages from "../../../../flux/actions/apis/analytics/getSupportedLangList";
import { Button, Grid, Typography } from "@material-ui/core";
// import ImageTwoTone from "@material-ui/icons/ImageTwoTone";
// import PictureAsPdfOutlined from "@material-ui/icons/PictureAsPdfOutlined";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import downloadReportClick from "../../../../utils/downloadChart";
import GetAppIcon from '@material-ui/icons/GetApp';
import { Popover } from "@material-ui/core"


const Analytics = () => {
    //   const classes = GlobalStyles();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const showExportPopover = Boolean(anchorEl);

    const documentCountByLang = useSelector(state => state.getCountByLang?.data?.data)

    const getSupportedLangList = () => {
        const apiObj = new getAnuvaadSupportedLanguages();
        dispatch(APITransport(apiObj));
    }

    const getTranslatedAndVerifiedSetenceCount = () => {
        const apiObj = new getAnuvaadTranslatedAndVerifiedSetenceCount();
        dispatch(APITransport(apiObj));
    }

    const getCountByLang = (srcLang = "en") => {
        const apiObj = new getAnuvaadCountByLang(srcLang);
        dispatch(APITransport(apiObj));
    }

    const getDocumentCountPerOrg = () => {
        const apiObj = new getAnuvaadDocumentCountPerOrg();
        dispatch(APITransport(apiObj));
    }

    useEffect(() => {
        getSupportedLangList();
        getTranslatedAndVerifiedSetenceCount();
        getCountByLang();
        getDocumentCountPerOrg()
    }, [])

    return (
        <>
            {/* <Grid
                container
                direction="row"
                justifyContent="end"
                alignItems="center"
                style={{
                    placeContent: "end",
                    marginTop: 30,
                    // paddingLeft: 110,
                    paddingRight: 60
                }}
            ></Grid> */}
            <div style={{ textAlign: "end", marginTop: 30, paddingRight: 60 }}>
                <Button
                    endIcon={<ExpandMoreIcon />}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >Export Full Report</Button>
                <Popover
                    id={"simple-popover"}
                    open={showExportPopover}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        style={{ overflow: "hidden", padding: 10 }}
                    >
                        <Button
                            onClick={() => {
                                setAnchorEl(null);
                                downloadReportClick(true, "img", ["analytics-charts"], "Anuvaad-Analytics")
                            }}
                        >
                            <Grid style={{ width: 100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="button">Image</Typography>
                                <GetAppIcon />
                            </Grid>
                        </Button>
                        <Button
                            onClick={() => {
                                setAnchorEl(null);
                                downloadReportClick(true, "pdf", ["documentCountByLang", "translatedAndVarifiedSentenceByLang", "documentCountByOrg"], "Anuvaad-Analytics")
                            }}
                        >
                            <Grid style={{ width: 100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                <Typography variant="button">PDF</Typography>
                                <GetAppIcon />
                            </Grid>
                        </Button>
                    </Grid>
                </Popover>
            </div>

            <div id="analytics-charts">
                <div id={"documentCountByLang"}>
                    <DocumentCountByLang
                        incomingData={documentCountByLang}
                        onLanguageChange={getCountByLang}
                        onDownloadReportClick={downloadReportClick}
                    />
                </div>
                <div id={"translatedAndVarifiedSentenceByLang"}>
                    <TranslatedAndVarifiedSentenceByLang
                        onDownloadReportClick={downloadReportClick}
                    />
                </div>
                <div id={"documentCountByOrg"}>
                    <DocumentCountByOrg
                        onDownloadReportClick={downloadReportClick}
                    />
                </div>
            </div>
        </>

    );
};

export default Analytics;

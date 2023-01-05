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
import ImageTwoTone from "@material-ui/icons/ImageTwoTone";
import PictureAsPdfOutlined from "@material-ui/icons/PictureAsPdfOutlined";
import downloadReportClick from "../../../../utils/downloadChart";


const Analytics = () => {
    //   const classes = GlobalStyles();
    const dispatch = useDispatch();

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
            <Grid
                container
                direction="row"
                justifyContent="end"
                alignItems="center"
                style={{
                    placeContent:"end",
                    marginTop: 30,
                    paddingLeft: 110,
                    paddingRight: 110
                }}
            >
                {/* <Grid item>
                    <Typography>Download As - </Typography>
                </Grid> */}
                <Grid item>
                    <Button
                        // title="Export as Image"
                        onClick={() => { downloadReportClick(true, "img", ["analytics-charts"], "Anuvaad-Analytics") }}
                        // variant="outlined"
                        color="primary"
                    >
                        {/* Export As */}
                        Donwload Full Report As Image 
                        <ImageTwoTone fontSize="large" />
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        // title="Export as PDF"
                        onClick={() => { downloadReportClick(true, "pdf", ["documentCountByLang", "translatedAndVarifiedSentenceByLang", "documentCountByOrg"], "Anuvaad-Analytics") }}
                        // variant="outlined"
                        color="primary"
                        style={{marginLeft: 5}}
                    >
                        {/* Export As */}
                        Donwload Full Report As PDF
                        <PictureAsPdfOutlined fontSize="large" />
                    </Button>
                </Grid>
            </Grid>
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

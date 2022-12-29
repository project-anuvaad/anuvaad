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
        <div>
            <DocumentCountByLang incomingData={documentCountByLang} onLanguageChange={getCountByLang} />
            <TranslatedAndVarifiedSentenceByLang />
            <DocumentCountByOrg />
        </div>
    );
};

export default Analytics;

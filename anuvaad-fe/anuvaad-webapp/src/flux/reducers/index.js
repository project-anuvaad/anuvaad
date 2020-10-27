import login from './umc/login';
import automl from './automl';
import nmt from './nmt';
import nmtsp from './nmtsp';
import corpus from './corpus';
import apistatus from './apistatus/apistatus';
import corp from './corp';
import translations from './translations';
import translation_sentences from './translation_sentences';
import sentences from './sentences';
import userProfile from './userprofile';
import interactiveUpdate from './interactivesavesentence';
import uploadbenchmark from './uploadbenchmark';
import source_translate from './source-translate';
import supportLanguage from './fetchlanguages';
import langModel from './fetchmodel';
import fetchBenchmark from './benchmark';
import fetchBenchmarkModel from './fetchbenchmarkmodel';
import fetchBenchmarkCompareModel from './fetchbenchmarkcompares';
import updateGrade from './update-sentences-grade';
import graderReport from './graderreport';
import comparisonreport from './comparisonreport';
import benchmarkTranslate from './benchmarktranslate';
import translation from './translation';
import configUplaod from './configupload';
import workspaceDetails from './runexperiment';
import audio from './audio';
import mergeSentenceApi from './interactivemerge';
import fetchDefaultConfig from './fetchdefaultconfig';
import hindi from './hindi';
import marathi from './marathi';
import telugu from './telugu';
import tamil from './tamil';
import punjabi from './punjabi';
import malayalam from './malayalam';
import kannada from './kannada';
import gujarati from './gujarati';
import bengali from './bengali';
import courtList from './fetchcourtlist';
import fetchtranslation from './viewtranslate';
import feedbackQuestions from './feedbackquestions';
import deletefile from './delete';
import userList from './userdirectory';
import userRoles from './userroles';
import addUser from './adduser';
import fetchWorkspace from './fetchworkspace';
import fetchWorkspaceDetails from './fetchworkspacedetails';
import updatePasswordstatus from './updatepassword';
import createWorkspaceDetails from './createworkspace';
import uploadTokenValue from './uploadtoken';
import uploadTranslated from './uploadTranslatedFile';
import fetchSearch from './fetchsearchreplace';
import sentenceReplace from './sentencereplace';
import uploadpdf from './pdfupload';
import pdfConfigUpload from './pdfuploadfile';
import docpath from './pdf_to_doc';
import fetchPdfSentence from './fetchpdfsentence';
import intractiveTrans from './intractive_translate';
import downloaddoc from './downloaddoc';
import signup from './signup';
import forgotpassword from './forgotpassword';
import setpassword from './setpassword';
import activate from './activate';
import updatePdfTable from './updatePdfTable';
import updateSource from './interactivesourceupdate';
import deleteSentence from './deleteSentence';
import deleteTable from './deleteTable';
import insertSentence from './insertSentence';
import workflowStatus from "./fileupload";
import documentUplaod from "./documentUpload";
import fetchDocument from "./fetch_document";
import job_details from './v1_fetch_job_details';

import documentDetails from "./fetch_fileDetails";
import fetchContent from "./fetchcontent";
import documentconverter from "./documentconverter";
import wordDictionary from "./word_dictionary";
import saveContent from "./savecontent";
import markInactive from "./markinactive";
import jobStatus from "./job-status";

export default {
    login,
    automl,
    nmt,
    nmtsp,
    corpus,
    apistatus,
    corp,
    sentences,
    translations,
    translation_sentences,
    source_translate,
    userProfile,
    updatePasswordstatus,
    supportLanguage,
    langModel,
    fetchBenchmark,
    fetchBenchmarkModel,
    updateGrade,
    graderReport,
    fetchBenchmarkCompareModel,
    benchmarkTranslate,
    comparisonreport,
    uploadbenchmark,
    translation,
    fetchtranslation,
    deletefile,
    audio,
    userList,
    userRoles,
    addUser,
    hindi,
    bengali,
    punjabi,
    malayalam,
    tamil,
    telugu,
    marathi,
    kannada,
    gujarati,
    configUplaod,
    workspaceDetails,
    fetchWorkspace,
    fetchWorkspaceDetails,
    uploadTokenValue,
    fetchDefaultConfig,
    uploadTranslated,
    createWorkspaceDetails,
    courtList,
    fetchSearch,
    sentenceReplace,
    feedbackQuestions,
    uploadpdf,
    pdfConfigUpload,
    fetchPdfSentence,
    intractiveTrans,
    docpath,
    interactiveUpdate,
    downloaddoc,
    mergeSentenceApi,
    signup,
    forgotpassword,
    setpassword,
    activate,
    updatePdfTable,
    updateSource,
    deleteSentence,
    deleteTable,
    insertSentence,
    workflowStatus,
    documentUplaod,
    fetchDocument,
    documentDetails,
    fetchContent,
    documentconverter,
    wordDictionary,
    saveContent,
    markInactive,
    jobStatus,
    job_details
};

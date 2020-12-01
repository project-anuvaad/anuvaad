import login from './umc/login';
import automl from './automl';
import nmt from './nmt';
import nmtsp from './nmtsp';
import apistatus from './apistatus/apistatus';
import translations from './translations';
import translation_sentences from './translation_sentences';
import sentences from './sentences/sentences';
import userProfile from './userprofile';
import translation from './translation';
import userRoles from './userroles';
import updatePasswordstatus from './updatepassword';
import uploadTokenValue from './uploadtoken';
import intractiveTrans from './intractive_translate';
import signup from './signup';
import forgotpassword from './forgotpassword';
import setpassword from './setpassword';
import activate from './activate';
import workflowStatus from "./fileupload";
import documentUplaod from "./documentUpload";
import fetchDocument from "./fetch_document";
import job_details from './jobs/v1_fetch_job_details';
import document_contents from './v1_fetch_content';
import fetch_languages from './v1_fetchlanguages';
import fetch_models from './v1_fetch_model';
import active_page_number from './v1_pageUpdates';

import documentDetails from "./fetch_fileDetails";
import fetchContent from "./fetchcontent";
import documentconverter from "./documentconverter";
import wordDictionary from "./word_dictionary";
import saveContent from "./savecontent";

import block_highlight from './blockReducer'
import sentence_highlight from './sentences/sentenceReducer'
import sentence_action_operation from './sentences/sentenceActionReducer'
import async_job_status from './jobs/async_job_management'
import document_editor_mode from './editor/document_editor_mode';

import show_pdf from './showPdfReducer'
import open_sidebar from './showsidebar'
import job_status from './v1.job_progress';

import userinfo from '../reducers/userdetails';

export default {
    login,
    automl,
    nmt,
    nmtsp,
    apistatus,
    sentences,
    translations,
    translation_sentences,
    userProfile,
    updatePasswordstatus,
    translation,
    userRoles,
    uploadTokenValue,
    intractiveTrans,
    signup,
    forgotpassword,
    setpassword,
    activate,
    workflowStatus,
    documentUplaod,
    fetchDocument,
    documentDetails,
    fetchContent,
    documentconverter,
    wordDictionary,
    saveContent,
    job_details,
    document_contents,
    fetch_languages,
    fetch_models,

    block_highlight,
    sentence_highlight,
    sentence_action_operation,

    async_job_status,
    document_editor_mode,

    show_pdf,
    open_sidebar,
    
    active_page_number,
    job_status,
    userinfo
};

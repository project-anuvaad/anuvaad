import login from './umc/login';
import automl from './automl';
import nmt from './nmt';
import nmtsp from './nmtsp';
import apistatus from './apistatus/apistatus';
import translations from './translations';
import translation_sentences from './translation_sentences';
import sentences from './sentences';
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
import job_details from './v1_fetch_job_details';
import document_contents from './v1_fetch_content';
import fetch_languages from './v1_fetchlanguages';
import fetch_models from './v1_fetch_model';

import documentDetails from "./fetch_fileDetails";
import fetchContent from "./fetchcontent";
import documentconverter from "./documentconverter";
import wordDictionary from "./word_dictionary";
import saveContent from "./savecontent";

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
    fetch_models
};

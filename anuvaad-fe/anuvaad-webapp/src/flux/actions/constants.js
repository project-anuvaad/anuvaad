/*
 * @Author: ghost
 * @Date: 2018-07-03 17:45:01
 * @Last Modified by:   aroop.ghosh@tarento.com
 * @Last Modified time: 2018-07-03 17:45:01
 */
const constants = {

    APISTATUS: 'APISTATUS',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    QNA: 'QNA',
    AUTO_ML: 'AUTO_ML',
    NMT: 'NMT',
    ACTIVATE: 'ACTIVATE',
    NMTSP: 'NMTSP',
    CREATE_CORPUS: 'CREATE_CORPUS',
    CREATE_TRANSLATIONS: 'CREATE_TRANSLATIONS',
    BENCHMARK: 'BENCHMARK',
    FETCH_CORP: 'FETCH_CORP',
    FETCH_SENTENCES: 'FETCH_SENTENCES',
    // FETCH_TRANSLATION_SENTENCES: 'FETCH_TRANSLATION_SENTENCES',
    // FETCH_TRANSLATIONS: 'FETCH_TRANSLATIONS',
    UPDATE_SENTENCE: 'UPDATE_SENTENCE',
    UPDATE_SENTENCE_STATUS: 'UPDATE_SENTENCE_STATUS',
    UPDATE_SENTENCE_GRADE: 'UPDATE_SENTENCE_GRADE',
    SOURCE_TRANSLATE: 'SOURCE_TRANSLATE',
    USER_AUTH: 'USER_AUTH',
    CREATE_PARALLEL_CORPUS: 'CREATE_PARALLEL_CORPUS',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD',
    FETCH_LANGUAGE: 'FETCH_LANGUAGE',
    FETCH_MODEL: 'FETCH_MODEL',
    FETCH_BENCH: 'FETCH_BENCH',
    FETCH_BENCHMARK_MODEL: 'FETCH_BENCHMARK_MODEL',
    FETCH_GRADER_REPORT: 'FETCH_GRADER_REPORT',
    UPLOAD_BENCHMARK: 'UPLOAD_BENCHMARK',
    FETCH_BENCHMARK_COMPARE_MODEL: "FETCH_BENCHMARK_COMPARE_MODEL",
    BENCHMARK_TRANSLATE: 'BENCHMARK_TRANSLATE',
    FETCH_COMPARISON_REPORT: 'FETCH_COMPARISON_REPORT',
    // TRANSLATION: 'TRANSLATION',
    SIGNUP: 'SIGNUP',
    FORGOTPASSWORD: 'FORGOTPASSWORD',
    SET_PASSWORD: 'SET_PASSWORD',
    DELETE: 'DELETE',
    USER_DIRECTORY: 'USER_DIRECTORY',
    USER_ROLES: 'USER_ROLES',
    ADD_USER: 'ADD_USER',
    DELETE_USER: 'DELETE_USER',
    UPLOAD_AUDIO: 'UPLOAD_AUDIO',
    HINDI: 'HINDI',
    MARATHI: 'MARATHI',
    TELUGU: 'TELUGU',
    TAMIL: 'TAMIL',
    KANNADA: 'KANNADA',
    MALAYALAM: 'MALAYALAM',
    PUNJABI: 'PUNJABI',
    BENGALI: 'BENGALI',
    GUJARATI: 'GUJARATI',
    CONFIGUPLOAD: 'CONFIGUPLOAD',
    // RUNEXPERIMENT: 'RUNEXPERIMENT',
    // FETCH_WORKSPACE: 'FETCH_WORKSPACE',
    // FETCH_WORKSPACE_DETAILS: 'FETCH_WORKSPACE_DETAILS',
    UPLOAD_TOKEN: "UPLOAD_TOKEN",
    // FETCH_DEFAULT_CONFIG: "FETCH_DEFAULT_CONFIG",
    UPLOAD_TRANSLATED: "UPLOAD_TRANSLATED",
    CREATEWORKSPACE: 'CREATEWORKSPACE',
    COURT_LIST: 'COURT_LIST',
    // FETCH_SEARCH_REPLACE: 'FETCH_SEARCH_REPLACE',
    // SENTENCEREPLACE: 'SENTENCEREPLACE',
    // FEEDBACK_QUESTIONS: 'FEEDBACK_QUESTIONS',
    UPLOADPDF: 'UPLOADPDF',
    PDFCONFIGUPLOAD: 'PDFCONFIGUPLOAD',
    // FETCH_PDFSENTENCE: 'FETCH_PDFSENTENCE',
    INTRACTIVE_TRANSLATE: 'INTRACTIVE_TRANSLATE',
    PDF_TO_DOC: 'PDF_TO_DOC',
    UPDATEINTERACTIVESENTENCE: 'UPDATEINTERACTIVESENTENCE',
    // DOWNLOAD_DOC: 'DOWNLOAD_DOC',
    MERGEINTERACTIVESENTENCE: 'MERGEINTERACTIVESENTENCE',
    UPDATE_PDF_TABLE: 'UPDATE_PDF_TABLES',
    UPDATESOURCESENTENCE: 'UPDATESOURCESENTENCE',
    DELETE_SENTENCE: 'DELETE_SENTENCE',
    DELETE_TABLE: 'DELETE_TABLE',
    INSERT_SENTENCE: 'INSERT_SENTENCE',
    WORKFLOW: 'WORKFLOW',
    DOCUMENTUPLOAD: 'DOCUMENTUPLOAD',
    FETCHDOCUMENT: 'FETCHDOCUMENT',
    FETCHDOCUMENT_NEWJOB: 'FETCHDOCUMENT_NEWJOB',
    FETCHDOCUMENT_NEXTPAGE: 'FETCHDOCUMENT_NEXTPAGE',
    FETCHDOCUMENT_EXISTING: 'FETCHDOCUMENT_EXISTING',
    FETCHDOCUMENT_ADMIN: 'FETCHDOCUMENT_ADMIN',
    FETCHFILEDETAILS: 'FETCHFILEDETAILS',
    FETCH_CONTENT: 'FETCH_CONTENT',
    FETCH_USER_CONTENT: 'FETCH_USER_CONTENT',
    FETCH_NEXT_PAGENO: 'FETCH_NEXT_PAGENO',
    CLEAR_CONTENT: 'CLEAR_CONTENT',
    DOCUMENT_CONVERTER: 'DOCUMENT_CONVERTER',
    DOWNLOAD_FILE: 'DOWNLOAD_FILE',

    WORD_DICTIONARY: "WORD_DICTIONARY",
    SAVE_CONTENT: "SAVE_CONTENT",
    CREATE_GLOSARY: "CREATE_GLOSARY",
    MARK_INACTIVE: "MARK_INACTIVE",
    JOBSTATUS: "JOBSTATUS",
    FETCH_USERINFO: "FETCH_USERINFO",
    SAVE_USER: 'SAVE_USER',
    ACTIVATE_EXISTING_USER: "ACTIVATE_EXISTING_USER",
    DEACTIVATE_EXISTING_USER: "DEACTIVATE_EXISTING_USER",
    FETCH_NEXT_USERDETAIL: "FETCH_NEXT_USERDETAIL",
    FETCH_CURRENT_USER_DETAIL: "FETCH_CURRENT_USER_DETAIL",
    /**
     * Asynchronous Job action
     */
    CREATE_JOB_ENTRY: 'CREATE_JOB_ENTRY',
    CLEAR_JOB_ENTRY: 'CLEAR_JOB_ENTRY',

    /**
     * actions for merge and split operation
     */
    HIGHLIGHT_BLOCK: 'HIGHLIGHT_BLOCK',
    HIGHLIGHT_SENTENCE: 'HIGHLIGHT_SENTENCE',
    MERGE_SENTENCE_STARTED: 'MERGE_SENTENCE_STARTED',
    MERGE_SENTENCE_INPROGRESS: 'MERGE_SENTENCE_INPROGRESS',
    MERGE_SENTENCE_FINISHED: 'MERGE_SENTENCE_FINISHED',
    MERGE_SENTENCE_CANCEL: 'MERGE_SENTENCE_CANCEL',
    CLEAR_HIGHLIGHT_BLOCK: 'CLEAR_HIGHLIGHT_BLOCK',
    SENTENCE_ACTION_API_STARTED: 'SENTENCE_ACTION_API_STARTED',
    SENTENCE_ACTION_API_STOPPED: 'SENTENCE_ACTION_API_STOPPED',
    FETCH_CONTENT_UPDATE: 'FETCH_CONTENT_UPDATE',
    CONTENT_UPDATE_STARTED: 'CONTENT_UPDATE_STARTED',
    UPDATE_SENTENCE_CONTENT: 'UPDATE_SENTENCE_CONTENT',
    UPDATE_BLOCK_CONTENT: 'UPDATE_BLOCK_CONTENT',
    CLEAR_FETCH_CONTENT: "CLEAR_FETCH_CONTENT",
    EDITOR_MODE_CLEAR: "EDITOR_MODE_CLEAR",
    EDITOR_MODE_NORMAL: "EDITOR_MODE_NORMAL",
    EDITOR_MODE_MERGE: "EDITOR_MODE_MERGE",


    /**
    * actions for header
    */
    SHOW_PDF: 'SHOW_PDF',
    SHOW_SIDEBAR: "SHOW_SIDEBAR",
    CLEAR_SHOW_PDF: "CLEAR_SHOW_PDF",

    /**
     * actions for pagination
     */
    JOBPROGRESSSTATUS: 'JOBPROGRESSSTATUS',
    UPDATE_PAGENUMBER: "UPDATE_PAGENUMBER",

    /**
     * action for organization LIst
     */

    FETCHORGANIZATION: 'FETCHORGANIZATION',
    /**
    * action for document digitization
    */

    FETCH_DIGITIZED_DOCUMENT: 'FETCH_DIGITIZED_DOCUMENT',
    FETCH_EXISITING_DIGITIZED_DOC: 'FETCH_EXISITING_DIGITIZED_DOC',
    FETCH_DIGITIZED_DOC_NEW_JOB: 'FETCH_DIGITIZED_DOC_NEW_JOB',
    FETCH_DIGITIZED_DOC_NEXT_PAGE: 'FETCH_DIGITIZED_DOC_NEXT_PAGE',
    DOWNLOAD_JSON: 'DOWNLOAD_JSON',
    CLEAR_JSON: 'CLEAR_JSON',
    FETCH_SLIDER_PERCENT: 'FETCH_SLIDER_PERCENT',
    FETCH_SLIDER_PIXEL: 'FETCH_SLIDER_PIXEL',
    SHOW_BG_IMAGE: 'SHOW_BG_IMAGE',
    FETCH_PAGE_NUMBER: 'FETCH_PAGE_NUMBER',
    SWITCH_STYLES: 'SWITCH_STYLES',
    START_EDITING: 'START_EDITING',
    SET_CROP_SIZE: 'SET_CROP_SIZE',
    RESET_CROP_SIZE: 'RESET_CROP_SIZE',
    COPY_LOCATION: 'COPY_LOCATION',
    UPDATE_WORD: 'UPDATE_WORD',
    RESET_WORD: 'RESET_WORD',

    /**
     * action for annotation job
     */
    FETCH_SCHEDULED_JOBS: "FETCH_SCHEDULED_JOBS",
    FETCH_SCHEDULED_NEWJOB: "FETCH_SCHEDULED_NEWJOB",
    FETCH_SCHEDULED_NEXTPAGE: "FETCH_SCHEDULED_NEXTPAGE",
    FETCH_EXISTING_SCH_JOB: "FETCH_EXISTING_SCH_JOB",
    FETCH_JOB_DETAIL: "FETCH_JOB_DETAIL",
    FETCH_ANNOTATOR_JOB: "FETCH_ANNOTATOR_JOB",
    FETCH_USER_JOB: "FETCH_USER_JOB",
    CLEAR_ANNOTATOR_JOB: 'CLEAR_ANNOTATOR_JOB',
    GRADE_SENTENCE: "GRADE_SENTENCE",
}
export default constants;

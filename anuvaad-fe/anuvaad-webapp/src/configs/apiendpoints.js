const endpoints = {
  interactive_translate: "/interactive-translation",
  interactive_translate_v1: "/v1/interactive-translation",
  fetchlanguage: "/fetch-languages",
  fetchmodel: "/nmt-inference/v1/fetch-models",
  forgotpassword: "/v1/user/forgot-user-password",
  fetchducuments: '/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk',
  insertSentence: "/v1/interactive-editor/add-sentence-node",
  activate_user: "/v1/user/activate-account",
  adduser: "/create-user",
  auto_ml: "/translate",
  fetch_filedeatils:"/api/v0/serve-file?",
  workflowAsync:"/anuvaad-etl/wf-manager/v1/workflow/async/initiate",
  workflowSync:"/anuvaad-etl/wf-manager/v1/workflow/sync/initiate",
  signup: "/anuvaad/user-mgmt/v1/users/create",
  login: "/anuvaad/user-mgmt/v1/users/login",
  setpassword: "/set-user-password",
  documentupload:"/anuvaad-api/file-uploader/v0/upload-file",
  fecthcontent: "/api/v0/fetch-content",
  documentConverter: "/api/v0/document-converter",
  word_dictionary: "/api/v0/dictionary/search",
  save_content: "/api/v0/save-content-sentence",
  translate: "/anuvaad-etl/translator/v1/text/translate",
  mark_inactive: "/anuvaad-etl/wf-manager/v1/workflow/jobs/mark-inactive",
  jobids: "/api/v0/records/search",
  profile_details:'/anuvaad/user-mgmt/v1/users/auth-token-search'
  
};

export default endpoints;

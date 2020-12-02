const endpoints = {
  interactive_translate: "/interactive-translation",
  interactive_translate_v1: "/v1/interactive-translation",
  fetchlanguage: "/fetch-languages",
  fetchmodel: "/nmt-inference/v1/fetch-models",
  forgotpassword: "/anuvaad/user-mgmt/v1/users/forgot-password",
  fetchducuments: '/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk',
  // insertSentence: "/v1/interactive-editor/add-sentence-node",
  activate_user: "/anuvaad/user-mgmt/v1/users/activate-user",
  adduser: "/create-user",
  auto_ml: "/translate",
  fetch_filedeatils:"/api/v0/serve-file?",
  workflowAsync:"/anuvaad-etl/wf-manager/v1/workflow/async/initiate",
  workflowSync:"/anuvaad-etl/wf-manager/v1/workflow/sync/initiate",
  signup: "/anuvaad/user-mgmt/v1/users/create",
  login: "/anuvaad/user-mgmt/v1/users/login",
  setpassword: "/anuvaad/user-mgmt/v1/users/reset-password",
  userdetails:"/anuvaad/user-mgmt/v1/users/fetch-users-records",
  createuser:"/anuvaad/user-mgmt/v1/users/onboard-users",

  fecthcontent: "/anuvaad/content-handler/v0/fetch-content",
  documentupload:"/anuvaad-api/file-uploader/v0/upload-file",
  documentConverter: "/anuvaad-etl/document-converter/v0/document-converter",
  word_dictionary: "/anuvaad/content-handler/v0/dictionary/search",
  save_content: "/anuvaad/content-handler/v0/save-content-sentence",
  translate: "/anuvaad-etl/translator/v1/text/translate",
  mark_inactive: "/anuvaad-etl/wf-manager/v1/workflow/jobs/mark-inactive",
  jobids: "/anuvaad/content-handler/v0/records/search",
  profile_details:'/anuvaad/user-mgmt/v1/users/auth-token-search',
  
  // download_file : '/anuvaad-api/file-uploader/v0/download-file?filename=cda6d224-5f9b-4805-a1c3-34222b238dab.pdf&userid=9812e561524e4dc3bca79ff62d9f40041606296824855'
  download_file : '/anuvaad-api/file-uploader/v0/download-file'
};

export default endpoints;

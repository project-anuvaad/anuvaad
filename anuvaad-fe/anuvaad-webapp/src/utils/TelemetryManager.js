import $t from "@project-sunbird/telemetry-sdk/index.js";

/**
 * initializes the telemetry API
 */
export const init = (env='TEST') => {
  let config = {}
  if (env === 'TEST') {
    config  = {
      pdata: {
        id: 'kd.anuvaad.org',
        ver: "1.0",
        pid: "anuvaad-portal",
      },
      host: "https://auth.anuvaad.org",
      env: "anuvaad-dev",
      did: "20d63257084c2dca33f31a8f14d8e94c0d939de4",
      channel: 'kd.anuvaad.org',
      batchsize: 1,
      endpoint: "/v1/telemetry",
      apislug: "/",
    }
  } else {
    config  = {
      pdata: {
        id: 'users.anuvaad.org',
        ver: "1.0",
        pid: "anuvaad-portal",
      },
      host: "https://auth.anuvaad.org",
      env: "anuvaad-user",
      did: "20d63257084c2dca33f31a8f14d8e94c0d939de4",
      channel: 'users.anuvaad.org',
      batchsize: 1,
      endpoint: "/v1/telemetry",
      apislug: "/",
    }
  }

  $t.initialize(config);

  console.log("is telemetry initialized:", $t.isInitialized());
};

/**
 * @description when page is about to start loading. e.g. componentWillMount
 * @param {*} page_id , which page_id
 */
export const pageLoadStarted = (page_id) => {
  if ($t.isInitialized() === false) {
    init()
  }
  let user_id       = null;
  let session_id    = null
  let user_profile  = JSON.parse(localStorage.getItem('userProfile'))
  let token         = localStorage.getItem('token')

  if (user_profile != null && token != null) {
    user_id     = user_profile.id
    session_id  = token
  } else {
    user_id     = 'anonymous'
    session_id  = 'anonymous'
  }

  let data = {
    type: 'view',
    subtype: 'PAGE_LOAD_STARTED',
    pageid: page_id,
  }

  let options = {
    ets: Date.now(),
    actor: {
      uid: user_id,
    },
    context: {
      sid: session_id
    }
  }

  $t.impression(data, options)
}

/**
 * @description when page loading is completed. e.g. componentDidMount
 * @param {*} page_id , which page_id
 */
export const pageLoadCompleted = (page_id) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let user_id       = null;
  let session_id    = null
  let user_profile  = JSON.parse(localStorage.getItem('userProfile'))
  let token         = localStorage.getItem('token')

  if (user_profile != null && token != null) {
    user_id     = user_profile.id
    session_id  = token
  } else {
    user_id     = 'anonymous'
    session_id  = 'anonymous'
  }

  let data = {
    type: 'view',
    subtype: 'PAGE_LOAD_COMPLETED',
    pageid: page_id,
  }

  let options = {
    ets: Date.now(),
    actor: {
      uid: user_id,
    },
    context: {
      sid: session_id
    },

  }

  $t.impression(data, options)
}

/**
 * @description, generic click on button present on the view.
 * @param {*} button_id , button identifier
 * @param {*} page_id , page where button is present
 */
export const buttonClicked = (button_id, page_id) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    id: button_id,
    pageid: page_id
  }
  let options = {}
  $t.interact(data, options)
}

/**
 * @description  start the flow with following initial parameters
 * @param {*} source_language , document language
 * @param {*} target_langauge , translated language
 * @param {*} filename , filename including extension
 * @param {*} job_id , on successful start of job, API returns job_id
 */
export const startWorkflow = (source_language, target_langauge, filename, job_id) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'START_JOB',
    duration: 0,
    mode: 'session'
  }

  let options = {
    ets: Date.now(),
    context: {
      cdata:[{
        id: job_id,
        type: 'FILE_TRANSLATE'
      }]
    },
    object: {
      id: filename,
      source_language: source_language,
      target_langauge: target_langauge,
      job_id: job_id
    }
  }
  $t.impression(data, options)
}

/**
 * @description call this api to mark completion of job_id
 * @param {*} job_id , job_id received
 */
export const endWorkflow = (job_id) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'END_JOB',
  }

  let options = {
    context: {
      cdata:[{
        id: job_id,
        type: 'FILE_TRANSLATE'
      }]
    },
    object: {
      job_id: job_id
    }
  }
  $t.impression(data, options)
}

/**
 * This function should be called whenever UI is moving to DocumentEdit mode, it is start of translator's session
 * @param {*} source_language 
 * @param {*} target_langauge 
 * @param {*} filename 
 * @param {*} job_id 
 */
export const startTranslatorFlow = (source_language, target_langauge, filename, job_id) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'TRANSLATOR_START',
    duration: 0,
    mode: 'session'
  }

  let config = null
  let options = {
    context: {
      cdata:[{
        id: job_id,
        type: 'select'
      }]
    },
    object: {
      id: filename,
      source_language: source_language,
      target_langauge: target_langauge,
      job_id: job_id
    }
  }
  $t.start(config, job_id, '3.0', data, options)
}

/**
 * should be called when coming out of document edit
 * @param {*} job_id 
 */
export const endTranslatorFlow = (job_id) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'TRANSLATOR_END',
  }

  let options = {
    context: {
      cdata:[{
        id: job_id,
        type: 'FILE_TRANSLATE'
      }]
    },
    object: {
      job_id: job_id
    }
  }
  $t.end(data, options)
}

/**
 * when translator is switching into edit mode for word correction or even in translated sentence side
 * @param {*} sentence 
 * @param {*} sentence_id 
 * @param {*} mode 
 */
export const startSentenceEdit = (sentence, sentence_id, mode) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    id: sentence_id,
    sentence: sentence,
    mode: mode
  }
  let options = {}
  $t.interact(data, options)
}

/**
 * when translator is switching into edit mode for word correction or even in translated sentence side
 * @param {*} sentence 
 * @param {*} sentence_id 
 * @param {*} mode 
 */
export const endSentenceEdit = (sentence, sentence_id, mode) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    id: sentence_id,
    sentence: sentence,
    mode: mode
  }
  let options = {}
  $t.interact(data, options)
}
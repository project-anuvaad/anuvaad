import $t from "@project-sunbird/telemetry-sdk/index.js";
import CONFIGS from '../configs/configs.js'

/**
 * initializes the telemetry API
 */
export const init = () => {
  let config = {}

  if (CONFIGS.BASE_URL_AUTO === 'https://auth.anuvaad.org') {
    config = {
      pdata: {
        id: 'developers.anuvaad.org',
        ver: "1.0",
        pid: "anuvaad-portal",
      },
      host: "https://auth.anuvaad.org",
      env: "DEV",
      did: "20d63257084c2dca33f31a8f14d8e94c0d939de4",
      channel: 'developers.anuvaad.org',
      batchsize: 1,
      endpoint: "/v1/telemetry",
      apislug: "/anuvaad-telemetry",
    }
  } else {
    config = {
      pdata: {
        id: CONFIGS.BASE_URL_AUTO.replace(/(^\w+:|^)\/\//, ''),
        ver: "1.0",
        pid: "anuvaad-portal",
      },
      host: CONFIGS.BASE_URL_AUTO,
      env: "PROD",
      did: "20d63257084c2dca33f31a8f14d8e94c0d939de4",
      channel: CONFIGS.BASE_URL_AUTO.replace(/(^\w+:|^)\/\//, ''),
      batchsize: 1,
      endpoint: "/v1/telemetry",
      apislug: "/anuvaad-telemetry",
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
  let user_id = null;
  let session_id = null
  let user_profile = JSON.parse(localStorage.getItem('userProfile'))
  let token = localStorage.getItem('token')

  if (user_profile != null && token != null) {
    user_id = user_profile.id
    session_id = token
  } else {
    user_id = 'anonymous'
    session_id = 'anonymous'
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

  let user_id = null;
  let session_id = null
  let user_profile = JSON.parse(localStorage.getItem('userProfile'))
  let token = localStorage.getItem('token')

  if (user_profile != null && token != null) {
    user_id = user_profile.id
    session_id = token
  } else {
    user_id = 'anonymous'
    session_id = 'anonymous'
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
 * @param {*} target_language , translated language
 * @param {*} filename , filename including extension
 * @param {*} job_id , on successful start of job, API returns job_id
 */
export const startWorkflow = (source_language, target_language, filename, job_id) => {
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
      cdata: [{
        id: job_id,
        type: 'FILE_TRANSLATE'
      }]
    },
    object: {
      id: filename,
      source_language: source_language,
      target_language: target_language,
      job_id: job_id
    }
  }
  $t.impression(data, options)
}

/**
 * @description call this api to mark completion of job_id
 * @param {*} job_id , job_id received
 */
export const endWorkflow = (source_language, target_language, filename, job_id, file_status) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'END_JOB',
  }

  let options = {
    context: {
      cdata: [{
        id: job_id,
        type: 'FILE_TRANSLATE'
      }]
    },
    object: {
      id: filename,
      source_language: source_language,
      target_language: target_language,
      job_id: job_id,
      file_status: file_status
    }
  }
  $t.impression(data, options)
}

/**
 * This function should be called whenever UI is moving to DocumentEdit mode, it is start of translator's session
 * @param {*} source_language 
 * @param {*} target_language 
 * @param {*} filename 
 * @param {*} job_id 
 */
export const startTranslatorFlow = (source_language, target_language, filename, job_id) => {
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
      cdata: [{
        id: job_id,
        type: 'select'
      }]
    },
    object: {
      id: filename,
      source_language: source_language,
      target_language: target_language,
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
      cdata: [{
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

/**
 * single event to report changes in sentence
 * @param {*} sentence_initial , initial sentence when user moved into the edit 
 * @param {*} sentence_final , final sentence when user moved out of edit
 * @param {*} sentence_id , sentence_identifier or identifier that uniquely identifies.
 * @param {*} mode , validation or translation
 * @param {*} src , extracted source sentence
 * 
 */
export const sentenceChanged = (sentence_initial, sentence_final, sentence_id, mode, src, source_language, target_language, bleu_score) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    action: 'SAVE',
    id: sentence_id,
    mode: mode
  }

  let options = {
    context: {
      cdata: []
    },
  }

  let values = {}
  values.src = src
  values.initial = sentence_initial
  values.final = sentence_final
  values.source_language = source_language
  values.target_language = target_language
  values.bleu_score = bleu_score

  options.context.cdata = values
  $t.interact(data, options)
}

/**
 * @description call this method when user triggers merge action
 * @param {*} sentences_initial, sentences that getting merged 
 * @param {*} sentence_final , final sentence after completion of merge operation
 */
export const mergeSentencesEvent = (sentences_initial, sentence_final) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    action: 'MERGE'
  }

  let options = {
    context: {
      cdata: []
    },
  }
  sentences_initial.forEach(element => {
    options.context.cdata.push({
      type: 'SENTENCE_FRAGMENT',
      text: element
    })
  });
  options.context.cdata.push({
    type: 'SENTENCE_FINAL',
    text: sentence_final
  })

  $t.interact(data, options)
}

/**
 * @description call this method to sent split sentence event
 * @param {*} name , name of the user
 * @param {*} email , email id of the user
 */
export const createUserEvent = (name, email) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    action: 'CREATE_USER'
  }

  let values = {}
  values.name = name
  values.email = email

  let options = {
    ets: Date.now(),
    context: {
      cdata: values
    },
  }

  $t.interact(data, options)
}

/**
 * @description call this method to sent split sentence event
 * @param {*} sentence_initial , initial sentence that is getting splitted
 * @param {*} sentences_final , output after spliting of sentence
 */
export const splitSentencesEvent = (sentence_initial, sentences_final) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let data = {
    type: 'click',
    action: 'SPLIT'
  }

  let options = {
    context: {
      cdata: []
    },
  }
  sentences_final.forEach(element => {
    options.context.cdata.push({
      type: 'SENTENCE_FRAGMENT',
      text: element
    })
  });
  options.context.cdata.push({
    type: 'SENTENCE_INITIAL',
    text: sentence_initial
  })

  $t.interact(data, options)
}

/**
 * @description call this method to log failure of actions
 * @param {*} action_type , type of action user is performing
 * @param {*} message , error message
 */
export const log = (action_type, message) => {
  if ($t.isInitialized() === false) {
    init()
  }

  let user_id = null;
  let user_profile = JSON.parse(localStorage.getItem('userProfile'))

  if (user_profile != null) {
    user_id = user_profile.userID
  } else {
    user_id = 'anonymous'
  }

  let data = {
    type: 'api_call',
    level: 'ERROR',
    message: message,
    action: action_type
  }

  let options = {
    ets: Date.now(),
    actor: {
      uid: user_id,
    }
  }

  $t.log(data, options)
}
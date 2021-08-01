require("regenerator-runtime");
const { secretbox, randomBytes } = require("tweetnacl");
const { encodeBase64, decodeUTF8 } = require("tweetnacl-util");
const { v4: uuidv4 } = require("uuid");

const encrypt = (message, secret_key) => {
  let secret_msg = decodeUTF8(message);
  let key = decodeUTF8(secret_key);
  let nonce = randomBytes(secretbox.nonceLength);
  let encrypted = secretbox(secret_msg, nonce, key);
  encrypted = encodeBase64(encrypted);
  return `${encrypted}:${encodeBase64(nonce)}`;
};
var elementIndex = 0;
var texts = [];
var textMappings = {};

const saveObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

function setCryptoToken() {
  var payload = `${uuidv4()}::extn::${Date.now()}`;
  const secret_key = "85U62e26b2aJ68dae8eQc188e0c8z8J9";
  const encryptedToken = encrypt(payload, secret_key);
  saveObjectInLocalStorage({ "id-token": encryptedToken });
}

function markAndExtractTextElements(element) {
  let childNodes = Array.from(element.childNodes);
  for (let i = 0; i < childNodes.length; i++) {
    if (
      !["SCRIPT", "STYLE", "IFRAME", "NOSCRIPT"].includes(childNodes[i].tagName)
    ) {
      markAndExtractTextElements(childNodes[i]);
    }
  }

  if (
    element.nodeType == document.TEXT_NODE &&
    element.textContent &&
    element.textContent.trim()
  ) {
    let anuvaadElement = document.createElement("FONT");
    let anuvaadId = "anvd-" + elementIndex;
    let text = element.textContent;
    anuvaadElement.setAttribute("id", anuvaadId);
    anuvaadElement.setAttribute("class", "anuvaad-block");
    anuvaadElement.appendChild(document.createTextNode(text));
    element.parentNode.replaceChild(anuvaadElement, element);
    let sid = uuidv4();
    texts.push({
      src: text,
      s_id: sid,
    });
    textMappings[sid] = {
      element_id: anuvaadId,
      text: text,
    };
    elementIndex++;
  }
}

async function getObjectFromLocalStorage(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

async function getObjectFromSyncStorage(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

async function makeSyncInitiateCall() {
  setCryptoToken();
  var requestBody = {
    paragraphs: texts,
    workflowCode: "WF_S_STKTR",
  };
  var authToken = await getObjectFromSyncStorage("id-token");
  console.log("authToken", authToken);
  var authToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InJvc2hhbi5zaGFoQHRhcmVudG8uY29tIiwicGFzc3dvcmQiOiJiJyQyYiQxMiQyMXhwNXhzd0VzeDB5SVBCRk9KUzZPZlpXV0d1bnpJMmlrQmh3LzNFQ1VCRUE5VVAyUC5NUyciLCJleHAiOjE2MjcwNDM0MjJ9.fWIJXnpDOEwcIWb3o_kHkTzG9X_Z4SyzgCpIgxmPvKU";
  requestBody.source_language_code = await getObjectFromLocalStorage("s0_src");
  requestBody.target_language_code = await getObjectFromLocalStorage("s0_tgt");
  requestBody.locale = await getObjectFromLocalStorage("s0_src");
  requestBody.model_id = await fetchModelAPICall(
    requestBody.source_language_code,
    requestBody.target_language_code,
    authToken
  );
  fetch(
    "https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/sync/initiate",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,hi;q=0.8",
        "auth-token": `${authToken}`,
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
      referrer: "https://developers.anuvaad.org/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `${JSON.stringify(requestBody)}`,
      method: "POST",
      mode: "cors",
    }
  ).then(async (response) => {
    let data = await response.json();
    let responseArray = [];
    data &&
      data.hasOwnProperty("output") &&
      Array.isArray(data["output"]["translations"]) &&
      data.output.translations.forEach((te) => {
        if (te.s_id[te.s_id.length - 1] === "0") {
          responseArray.push({
            ...te,
            s_id: te.s_id.replace("_SENTENCE-0", ""),
          });
        } else {
          responseArray[responseArray.length - 1].tgt =
            responseArray[responseArray.length - 1].tgt + " " + te.tgt;
          responseArray[responseArray.length - 1].src =
            responseArray[responseArray.length - 1].src + " " + te.src;
          responseArray[responseArray.length - 1].tagged_tgt =
            responseArray[responseArray.length - 1].tagged_tgt +
            " " +
            te.tagged_tgt;
          responseArray[responseArray.length - 1].tagged_src =
            responseArray[responseArray.length - 1].tagged_src +
            " " +
            te.tagged_src;
          responseArray[responseArray.length - 1].s_id = responseArray[
            responseArray.length - 1
          ].s_id.replace(/[A-Z]+/g, "");
        }
        responseArray.forEach((te) => {
          let sid = te.s_id;
          let elementId = textMappings[sid].element_id;
          let element = document.getElementById(elementId);
          let transText = te.tgt;
          let textNode = document.createTextNode(transText);
          let originalTextNode = element.childNodes[0];
          element.replaceChild(textNode, originalTextNode);
        });
      });
  });
}

async function fetchModelAPICall(source, target, authToken) {
  let token = await getObjectFromSyncStorage("token");
  let fetchCall = fetch(
    "https://auth.anuvaad.org/nmt-inference/v2/fetch-models",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "auth-token": `${authToken}`,
      },
    }
  );
  let response = await fetchCall.then();
  let rsp_data = await response.json();
  if (response.ok) {
    let modelInfo = rsp_data.data.filter((model) => {
      return (
        model.target_language_code === target &&
        model.source_language_code === source &&
        model.is_primary
      );
    });
    if (modelInfo.length) {
      return modelInfo[0].model_id;
    }
  } else if (!response.ok && response.status === 401) {
    console.log(token);
  }
}

function Translate() {
  markAndExtractTextElements(document.body);
  makeSyncInitiateCall();
  localStorage.setItem(
    "anuvaad-dev-text-mappings",
    JSON.stringify(textMappings)
  );
}

Translate();

require("regenerator-runtime");
const { secretbox, randomBytes } = require("tweetnacl");
const { encodeBase64, decodeUTF8 } = require("tweetnacl-util");
const { v4: uuidv4 } = require("uuid");
const { default: apiEndPoints } = require("../configs/apiendpoints");
const { HOST_NAME } = require("../configs/apigw");
const jp = require('jsonpath')

const {
  saveObjectInSyncStorage,
  getObjectFromSyncStorage,
} = require("../utils/chromeStorage");

// const HOST_NAME = "https://auth.anuvaad.org";

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

const getAuthToken = async (encryptedToken) => {
  try {
    const endPoint = `${HOST_NAME}${apiEndPoints.get_token}`;
    const response = await fetch(endPoint, {
      method: "POST",
      body: JSON.stringify({ id_token: encryptedToken }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const { data } = await response.json();
      saveObjectInSyncStorage({ token: data.token });
    } else {
      // Uncomment the line below if you want to set the crypto token on failure
      // await setCryptoToken();
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }
};


const setCryptoToken = async () => {
  var payload = `${uuidv4()}::extn::${Date.now()}`;
  const secret_key = "85U62e26b2aJ68dae8eQc188e0c8z8J9";
  const encryptedIdToken = encrypt(payload, secret_key);
  await getAuthToken(encryptedIdToken);
};

const markAndExtractTextElements = (element) => {
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
};

const translateWebPage = (data) => {
  let responseArray = [];
  data &&
    data.hasOwnProperty("output") &&
    Array.isArray(data["output"]["translations"]) &&
    data.output.translations.forEach((te) => {
      responseArray.push({
        s_id: te.s_id,
        src: te.src,
        tgt: te.tgt ? te.tgt : te.src
      });
    });

    responseArray.forEach((te) => {
        let sid = te.s_id;
        let elementId = textMappings[sid]?.element_id;
        let element = document.getElementById(elementId);
        let transText = te.tgt;
        let textNode = document.createTextNode(transText);
        let originalTextNode = element.childNodes[0];
        element.replaceChild(textNode, originalTextNode);
      });
};

const makeSyncInitiateCall = async () => {
  try {
    const authToken = await getObjectFromSyncStorage("token");
    const [sourceLang, targetLang] = await Promise.all([
      getObjectFromSyncStorage("s0_src"),
      getObjectFromSyncStorage("s0_tgt"),
    ]);

    const modelId = await fetchModelAPICall(sourceLang, targetLang, authToken);
    const batchSize = 25;

    for (let i = 0; i < texts.length; i += batchSize) {
      const currentBatch = texts.slice(i, i + batchSize);

      const requestBody = {
        sentences: currentBatch,
        workflowCode: "WF_S_STR",
        source_language_code: sourceLang,
        target_language_code: targetLang,
        model_id: modelId,
      };

      const response = await fetch(`${HOST_NAME}${apiEndPoints.sync_initiate}`, {
        method: "POST",
        headers: {
          "auth-token": authToken,
          "content-type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        translateWebPage(data);
      } else if (response.status === 401) {
        await setCryptoToken();
        await makeSyncInitiateCall();
      } else {
        console.error(`Fetch failed with status ${response.status}`);
      }
    }
    
    await saveObjectInSyncStorage({ translate: "Translate" });
  } catch (error) {
    console.error("Error during sync initiation:", error);
  }
};


const get_model_details = (languages, source_language_code, target_language_code, models) => {
  let result = []
  if (models) {
      let condition = `$..[?(@.src_lang == '${source_language_code}'  && @.tgt_lang == '${target_language_code}')]`
      let res = jp.query(models, condition)
      result = res;
  }
  let res_data = ""
  if (result.length > 0) {
      let model_condition = result.length > 0 && `$..[?(@.uuid == '${result[0].uuid}'&& @.status == 'ACTIVE')]`
      res_data = jp.query(languages, model_condition)
      res_data = res_data[0]
  }
  if (!res_data) {
      let condition = `$..[?(@.source_language_code == '${source_language_code}' && @.is_primary == true && @.target_language_code == '${target_language_code}')]`
      let result = jp.query(languages, condition)
      if (result.length === 1) {
          res_data = result[0]
      }
  }
  return res_data


}


const fetchModelAPICall = async (source, target, authToken) => {
  try {
    const endPoint = `${HOST_NAME}${apiEndPoints.fetch_models}`;
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authToken,
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const modelData = await response.json();
      return get_model_details(modelData?.data, source, target).model_id      
    } else if (response.status === 401) {
      await setCryptoToken();
      await makeSyncInitiateCall();
    } else console.error(`Fetch failed with status ${response.status}`);
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};


const Translate = () => {
  markAndExtractTextElements(document.body);
  makeSyncInitiateCall();
  localStorage.setItem(
    "anuvaad-dev-text-mappings",
    JSON.stringify(textMappings)
  );
};

Translate();

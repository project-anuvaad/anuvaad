var elementIndex = 0;
var texts = [];
var textMappings = {};

function markAndExtractTextElements(element) {
    let childNodes = Array.from(element.childNodes);
    for (let i = 0; i < childNodes.length; i++) {
        if (!["SCRIPT", "STYLE", "IFRAME", "NOSCRIPT"].includes(childNodes[i].tagName)) {
            markAndExtractTextElements(childNodes[i]);
        }
    }

    if (element.nodeType == document.TEXT_NODE && element.textContent && element.textContent.trim()) {
        let anuvaadElement = document.createElement("FONT");
        let anuvaadId = "anvd-" + elementIndex;
        let text = element.textContent;
        anuvaadElement.setAttribute("id", anuvaadId);
        anuvaadElement.setAttribute("class", "anuvaad-block");
        anuvaadElement.appendChild(document.createTextNode(text));
        element.parentNode.replaceChild(anuvaadElement, element);
        let sid = uuidv4();
        texts.push({
            "src": text,
            "s_id": sid
        });
        textMappings[sid] = {
            "element_id": anuvaadId,
            "text": text
        };
        elementIndex++;
    }

}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
async function getObjectFromLocalStorage(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, function(value) {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

async function makeSyncInitiateCall() {
    var requestBody = {
        sentences: texts.slice(0, 25),
        workflowCode: 'WF_S_STR'
    }
    authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InJvc2hhbi5zaGFoQHRhcmVudG8uY29tIiwicGFzc3dvcmQiOiJiJyQyYiQxMiQ3VE9HZVdmMzZNRVJGYk5mN3YwSmkudEFScWdTYzZaVTJuNW5vSk0wZUsvS3N0c3dQZnNhTyciLCJleHAiOjE2MjYxNTY1OTF9.obIzQuR8-v6Cgb1KXeza7lEpe85SBEDXMMQok9qTEn8"
    requestBody.source_language_code = await getObjectFromLocalStorage('s0_src')
    requestBody.target_language_code = await getObjectFromLocalStorage('s0_tgt')
    requestBody.model_id = await fetchModelAPICall(requestBody.source_language_code, requestBody.target_language_code, authToken)
    fetch("https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/sync/initiate", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8",
            "auth-token": `${authToken}`,
            "content-type": "application/json",
            "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://developers.anuvaad.org/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `${JSON.stringify(requestBody)}`,
        "method": "POST",
        "mode": "cors"
    }).then(async response => {
        let data = await response.json()
        data && data.hasOwnProperty('output') && Array.isArray(data['output']['translations']) && data.output.translations.forEach(te => {
            let sid = te.s_id;
            let elementId = textMappings[sid].element_id;
            let element = document.getElementById(elementId);
            let transText = te.tgt;
            let textNode = document.createTextNode(transText);
            let originalTextNode = element.childNodes[0];
            element.replaceChild(textNode, originalTextNode);
        });
    });
}

async function fetchModelAPICall(source, target, authToken) {
    let fetchCall = fetch('https://auth.anuvaad.org/nmt-inference/v2/fetch-models', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': `${authToken}`
        }
    })
    let response = await fetchCall.then()
    let rsp_data = await response.json()
    let modelInfo = rsp_data.data.filter(model => {
        return model.target_language_code === target && model.source_language_code === source && model.is_primary
    })
    if (modelInfo.length) {
        return modelInfo[0].model_id
    }
}

function Translate() {
    markAndExtractTextElements(document.body);
    makeSyncInitiateCall()
    localStorage.setItem("anuvaad-dev-text-mappings", JSON.stringify(textMappings));
}

Translate();
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


document.body.childNodes.forEach(n => markAndExtractTextElements(n));

fetch("https://auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/sync/initiate", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,hi;q=0.8",
        "auth-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InJvc2hhbi5zaGFoQHRhcmVudG8uY29tIiwicGFzc3dvcmQiOiJiJyQyYiQxMiQ1Zzk5eVlmcTVOTjR4aHBQV0hHMGplZW5mSjBsU3ZkTEdPMzh0aGdmSWhaclBwQkhaSTdaaSciLCJleHAiOjE2MjU4OTcyMjN9.WMKwjLSz6sMY7btEQXi83gmuKJgcFM81E7O-xLkD4Mw",
        "content-type": "application/json",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    },
    "referrer": "https://developers.anuvaad.org/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"model_id\":103,\"source_language_code\":\"en\",\"target_language_code\":\"hi\",\"sentences\":" + JSON.stringify(texts.slice(0, 25)) +",\"workflowCode\":\"WF_S_STR\"}",
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

localStorage.setItem("anuvaad-dev-text-mappings", JSON.stringify(textMappings));
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
//     let storageKey = "anuvaad-dev"+tabs[0].id+tabs[0].url
//     chrome.storage.local.set({ storageKey: textMappings });
// });



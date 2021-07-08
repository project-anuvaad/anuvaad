var elementIndex = 0;
var texts = [];
var textMappings = {};

function markAndExtractTextElements(element) {
    let childNodes = Array.from(element.childNodes);
    for (let i=0; i<childNodes.length; i++) {
        if (!["SCRIPT", "STYLE", "IFRAME","NOSCRIPT"].includes(childNodes[i].tagName)) {
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
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

  
document.body.childNodes.forEach(n => markAndExtractTextElements(n));
    
fetch("https://auth.anuvaad.org/nmt-inference/v4/translate", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8",
    "auth-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6Im5pdGluLnB1cmlAdGFyZW50by5jb20iLCJwYXNzd29yZCI6ImInJDJiJDEyJHN2eWlaM1l0VWpXTjg2SlRpL2I3MU94VDc0b0ZPYmNBbG1IcFZ3eXdrMkY2ZWJQeENNQy8yJyIsImV4cCI6MTYyNTcyNDk1Nn0.UiwBvi8mu_MU1zBqGRmfT7kgrKzPxiDV9WiZc5e6KRM",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  },
  "referrer": "https://developers.anuvaad.org/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"model_id\":70,\"source_language_code\":\"en\",\"target_language_code\":\"hi\",\"src_list\":"+JSON.stringify(texts.slice(0,100))+"}",
  "method": "POST",
  "mode": "cors"
}).then(response => response.json()).then(data => {
    data.data.forEach(te => {
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



// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
// let storageKey = "anuvaad-dev"+tabs[0].id+tabs[0].url
var originalTextMappings = JSON.parse(localStorage.getItem("anuvaad-dev-text-mappings"));
// let textMappings = localStorage.getItem();
// chrome.storage.local.get(storageKey, data => {
//     let textMappings = data[storageKey];
for (const key in originalTextMappings) {
    let elementId = originalTextMappings[key].element_id;
    let originalText = originalTextMappings[key].text;

    let transElement = document.getElementById(elementId);
    if (transElement) {
        let parentNode = transElement.parentNode;
        let originalTextNode = document.createTextNode(originalText);
        parentNode.replaceChild(originalTextNode, transElement);
    }
}
// });

localStorage.removeItem("anuvaad-dev-text-mappings");
    // chrome.storage.local.remove(storageKey);
// });


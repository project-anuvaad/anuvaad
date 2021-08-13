require('regenerator-runtime')
const {saveObjectInSyncStorage} = require('../utils/chromeStorage');

let translate = document.getElementById("translate");
let untranslate = document.getElementById("untranslate");
let source = document.getElementById('source');
let target = document.getElementById('target');

translate.addEventListener("click", async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/utils/load.js']
    });
});

untranslate.addEventListener("click", async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/utils/unload.js']
    });
});

source && source.addEventListener('change', async() => {
    await saveObjectInSyncStorage({ s0_src: source.value })
})

target && target.addEventListener('change', async() => {
    await saveObjectInSyncStorage({ s0_tgt: target.value })
})
require('regenerator-runtime')

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
    await chrome.storage.local.set({ s0_src: source.value })
})

target && target.addEventListener('change', async() => {
    await chrome.storage.local.set({ s0_tgt: target.value })
})
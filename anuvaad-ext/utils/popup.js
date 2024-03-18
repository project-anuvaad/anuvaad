require("regenerator-runtime");
const {
  saveObjectInSyncStorage,
  getObjectFromSyncStorage,
} = require("../utils/chromeStorage");

let translate = document.getElementById("translate");
let untranslate = document.getElementById("untranslate");
let source = document.getElementById("source");
let target = document.getElementById("target");
saveObjectInSyncStorage({ translate: "Translate" });

saveObjectInSyncStorage({ s0_src: "en" });
saveObjectInSyncStorage({ s0_tgt: "hi" });

window.addEventListener("load", async () => {
  translate.textContent = await getObjectFromSyncStorage("translate");
});

translate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await saveObjectInSyncStorage({ translate: "Translating..." });
  translate.textContent = await getObjectFromSyncStorage("translate");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["/utils/load.js"],
  });
});

untranslate.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["/utils/unload.js"],
  });
});

source &&
  source.addEventListener("change", async () => {
    await saveObjectInSyncStorage({ s0_src: source.value });
  });

target &&
  target.addEventListener("change", async () => {
    await saveObjectInSyncStorage({ s0_tgt: target.value });
  });

if (translate.textContent !== "Translate") {
  setInterval(async () => {
    translate.textContent = await getObjectFromSyncStorage("translate");
  }, 1000);
} else {
  clearInterval();
}

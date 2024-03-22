export const saveObjectInSyncStorage = async (obj) => {
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
  
  export const getObjectFromSyncStorage = async (obj) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.get(obj, function (value) {
          resolve(value[obj]);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  };
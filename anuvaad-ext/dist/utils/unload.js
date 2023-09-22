/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./utils/unload.js ***!
  \*************************/
// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
// let storageKey = "anuvaad-dev"+tabs[0].id+tabs[0].url
var originalTextMappings = JSON.parse(localStorage.getItem("anuvaad-dev-text-mappings")); // let textMappings = localStorage.getItem();
// chrome.storage.local.get(storageKey, data => {
//     let textMappings = data[storageKey];

for (var key in originalTextMappings) {
  var elementId = originalTextMappings[key].element_id;
  var originalText = originalTextMappings[key].text;
  var transElement = document.getElementById(elementId);

  if (transElement) {
    var parentNode = transElement.parentNode;
    var originalTextNode = document.createTextNode(originalText);
    parentNode.replaceChild(originalTextNode, transElement);
  }
} // });


localStorage.removeItem("anuvaad-dev-text-mappings"); // chrome.storage.local.remove(storageKey);
// });
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbnV2YWFkLWV4dC8uL3V0aWxzL3VubG9hZC5qcyJdLCJuYW1lcyI6WyJvcmlnaW5hbFRleHRNYXBwaW5ncyIsIkpTT04iLCJwYXJzZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJrZXkiLCJlbGVtZW50SWQiLCJlbGVtZW50X2lkIiwib3JpZ2luYWxUZXh0IiwidGV4dCIsInRyYW5zRWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwYXJlbnROb2RlIiwib3JpZ2luYWxUZXh0Tm9kZSIsImNyZWF0ZVRleHROb2RlIiwicmVwbGFjZUNoaWxkIiwicmVtb3ZlSXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0EsSUFBSUEsb0JBQW9CLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXQyxZQUFZLENBQUNDLE9BQWIsQ0FBcUIsMkJBQXJCLENBQVgsQ0FBM0IsQyxDQUNBO0FBQ0E7QUFDQTs7QUFDQSxLQUFLLElBQU1DLEdBQVgsSUFBa0JMLG9CQUFsQixFQUF3QztBQUNwQyxNQUFJTSxTQUFTLEdBQUdOLG9CQUFvQixDQUFDSyxHQUFELENBQXBCLENBQTBCRSxVQUExQztBQUNBLE1BQUlDLFlBQVksR0FBR1Isb0JBQW9CLENBQUNLLEdBQUQsQ0FBcEIsQ0FBMEJJLElBQTdDO0FBRUEsTUFBSUMsWUFBWSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0JOLFNBQXhCLENBQW5COztBQUNBLE1BQUlJLFlBQUosRUFBa0I7QUFDZCxRQUFJRyxVQUFVLEdBQUdILFlBQVksQ0FBQ0csVUFBOUI7QUFDQSxRQUFJQyxnQkFBZ0IsR0FBR0gsUUFBUSxDQUFDSSxjQUFULENBQXdCUCxZQUF4QixDQUF2QjtBQUNBSyxjQUFVLENBQUNHLFlBQVgsQ0FBd0JGLGdCQUF4QixFQUEwQ0osWUFBMUM7QUFDSDtBQUNKLEMsQ0FDRDs7O0FBRUFQLFlBQVksQ0FBQ2MsVUFBYixDQUF3QiwyQkFBeEIsRSxDQUNJO0FBQ0osTSIsImZpbGUiOiIuL3V0aWxzL3VubG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNocm9tZS50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0sIGZ1bmN0aW9uKHRhYnMpe1xyXG4vLyBsZXQgc3RvcmFnZUtleSA9IFwiYW51dmFhZC1kZXZcIit0YWJzWzBdLmlkK3RhYnNbMF0udXJsXHJcbnZhciBvcmlnaW5hbFRleHRNYXBwaW5ncyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhbnV2YWFkLWRldi10ZXh0LW1hcHBpbmdzXCIpKTtcclxuLy8gbGV0IHRleHRNYXBwaW5ncyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCk7XHJcbi8vIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChzdG9yYWdlS2V5LCBkYXRhID0+IHtcclxuLy8gICAgIGxldCB0ZXh0TWFwcGluZ3MgPSBkYXRhW3N0b3JhZ2VLZXldO1xyXG5mb3IgKGNvbnN0IGtleSBpbiBvcmlnaW5hbFRleHRNYXBwaW5ncykge1xyXG4gICAgbGV0IGVsZW1lbnRJZCA9IG9yaWdpbmFsVGV4dE1hcHBpbmdzW2tleV0uZWxlbWVudF9pZDtcclxuICAgIGxldCBvcmlnaW5hbFRleHQgPSBvcmlnaW5hbFRleHRNYXBwaW5nc1trZXldLnRleHQ7XHJcblxyXG4gICAgbGV0IHRyYW5zRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICBpZiAodHJhbnNFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHBhcmVudE5vZGUgPSB0cmFuc0VsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICBsZXQgb3JpZ2luYWxUZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG9yaWdpbmFsVGV4dCk7XHJcbiAgICAgICAgcGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQob3JpZ2luYWxUZXh0Tm9kZSwgdHJhbnNFbGVtZW50KTtcclxuICAgIH1cclxufVxyXG4vLyB9KTtcclxuXHJcbmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYW51dmFhZC1kZXYtdGV4dC1tYXBwaW5nc1wiKTtcclxuICAgIC8vIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShzdG9yYWdlS2V5KTtcclxuLy8gfSk7XHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9
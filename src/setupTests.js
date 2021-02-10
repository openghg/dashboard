// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
require("jest-canvas-mock");
window.URL.createObjectURL = jest.fn();
// This is a workaround for rendering SVGs during tests
// taken from https://stackoverflow.com/a/54384719/1303032
let createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function (namespaceURI, qualifiedName) {
  if (
    namespaceURI === "http://www.w3.org/2000/svg" &&
    qualifiedName === "svg"
  ) {
    let element = createElementNSOrig.apply(this, arguments);
    element.createSVGRect = function () {};
    return element;
  }

  return createElementNSOrig.apply(this, arguments);
};

const EOF = Symbol("EOF"); // 利用 Symbol 的唯一性; EOF: End of File
let currentToken = null;

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    return;
  } else {
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    return tagName(c);
  } else if (c === ">") {
    // 报错
  } else if (c === EOF) {
    // 报错
  } else {
  }
}

function tagName(c) {
  // tagName 以空白符结束，HTML 中有效的空白符：tab、换行、禁止符、空格
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    return tagName;
  } else if (c === ">") {
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">") {
    return data;
  } else if (c === "=") {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    return data
  } else if (c === EOF) {

  } else {}
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;

  for (let c of html) {
    state = state(c);
  }

  state = state(EOF);
};

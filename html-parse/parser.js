let currentToken = null;
let currentAttribute = null;

function emit(token) {
  console.log(token);
}

const EOF = Symbol("EOF"); // 利用 Symbol 的唯一性; EOF: End of File

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
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
    currentToken.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === '"' || c === "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
      return afterAttributeName(c);
  } else if (c === "/") {
      return selfClosingStartTag;
  } else if (c === "=") {
      return beforeAttributeValue;
  } else if (c === ">") {
      currentToken[currentAttribute.name] = currentAttribute.value;
      emit(currentToken);
      return data;
  } else if (c === EOF) {

  } else {
      currentToken[currentAttribute.name] = currentAttribute.value;
      currentAttribute = {
          name: "",
          value: "",
      }
      return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {
    // return data
  } else {
    return UnquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === '"' || c === "<" || c === "=" || c === "`") {
  } else if (c === "EOF") {
  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
      return beforeAttributeName
  } else if (c == "/") {
      return selfClosingStartTag;
  } else if (c == ">") {
      currentToken[currentAttribute.name] = currentAttribute.value;
      emit(currentToken);
      return data;
  } else if (c == EOF) {
  } else {
      currentAttribute.value += c;
      return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
      currentToken[currentAttribute.name] = currentAttribute.value;
      return beforeAttributeName;
  } else if (c == "/") {
      currentToken[currentAttribute.name] = currentAttribute.value;
      return selfClosingStartTag;
  } else if (c == ">") {
      currentToken[currentAttribute.name] = currentAttribute.value;
      emit(currentToken)
      return data;
  } else if (c == "\u0000") {
  } else if (c == "\"" || c == "\'" || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {

  } else {
      currentAttribute.value += c;
      return UnquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;

  for (let c of html) {
    state = state(c);
  }

  state = state(EOF);
};

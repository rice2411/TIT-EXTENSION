const parseDOM = (text) => {
  const parser = new DOMParser();

  return parser.parseFromString(text, "text/html");
};

const getPageDOM = async (url) => {
  if (!url) return "";
  const response = await fetch(url);
  const htmlRaw = await response.text()
  const parser = new DOMParser();

  return parser.parseFromString(htmlRaw, "text/html");
};


const addClassToNode = (styleClass, node) => {
  styleClass = styleClass.split(" ");
  for (let i = 0; i < styleClass.length; i++) {
    node.classList.add(styleClass[i]);
  }
};

const addAttributeToNode = (attributes, node) => {
  for (let i = 0; i < attributes.length; i++) {
    node.setAttribute(attributes[i].data, attributes[i].value);
  }
};

const createDOMElement = (option) => {
  const elementDOM = document.createElement(option.type);

  if (option.classList) addClassToNode(option.classList, elementDOM);
  if (option.attributes) {
    addAttributeToNode(option.attributes, elementDOM);
  }
  if (option.textContent) elementDOM.textContent = option.textContent;
  if (option.innerHTML) elementDOM.innerHTML = option.innerHTML;
  if (option.onClick) elementDOM.addEventListener("click", option.onClick);

  return elementDOM;
};

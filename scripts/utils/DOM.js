function parseDOM(text) {
  const parser = new DOMParser();

  return parser.parseFromString(text, "text/html");
}

const addClassToNode = (styleClass, node) => {
  styleClass = styleClass.split(" ");
  for (let i = 0; i < styleClass.length; i++) {
    node.classList.add(styleClass[i]);
  }
};

const getHtmlRawOfPage = async (url) => {
  if (!url) return "";
  const response = await fetch(url);

  return response.text();
};

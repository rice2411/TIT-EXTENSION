function convertPascalCase(str) {
  const map = {
    Đ: "D",
    đ: "d",
  };
  let normalizedString = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let result = normalizedString
    .split("")
    .map((char) => map[char] || char)
    .join("");

  return result.replace(/\s+/g, "");
}

//Hàm lấy thời khóa biểu môn học
const getTimeOfCourse = (str) => {
  let mainPart = str.split('[')[0].trim();
  let bracketContent = str.match(/\[(.*?)\]/);

  if (bracketContent) {
    let items = bracketContent[1].split(',').map(item => item.trim());
    items.pop();
    let newBracketContent = items.join(', ');
    return `${mainPart} / ${newBracketContent}`.trim();
  }

  return mainPart;
}

const getStaticResource = (ext, name) => {
  switch (ext) {
    case 'svg':
      return `images/svg/${name}.svg`
    case 'modal':
      return `page/modal/${name}.html`
  }
}

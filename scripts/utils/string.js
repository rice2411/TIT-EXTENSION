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

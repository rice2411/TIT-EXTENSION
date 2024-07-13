const getHtmlRawOfPage = async (url) => {
    if (!url) return ''
    const response = await fetch(url);
    return response.text();

}
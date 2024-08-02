//#region Export Excel
const exportStudyResult = async () => {
    const studyResultResponse = await fetch(
        getFullUrl(location.origin, SITE_URL.studyResult)
    );
    const studyResultDOM = parseDOM(await studyResultResponse.text());

    const studentName = studyResultDOM.querySelector(
        ".hitec-information h5"
    ).textContent;
    const studyResultTable = studyResultDOM.querySelector("table");

    if (studyResultTable) {
        const workbook = XLSX.utils.table_to_book(studyResultTable, {
            sheet: "QTHT",
        });
        //send to chrome
        // const s2ab = (s) => {
        //     var buf = new ArrayBuffer(s.length);
        //     var view = new Uint8Array(buf);
        //     for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        //     return buf;
        // }
        // var wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        // // save file
        // var blob = new Blob([s2ab(wbout)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        // var url = URL.createObjectURL(blob);
        // chrome.runtime.sendMessage({ type: "exportMark", url: url });
        XLSX.writeFile(workbook, `BangDiem-${convertPascalCase(studentName)}.xlsx`);
    }
};
//#endregion
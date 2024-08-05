class ExportData {
    async excelExport() {
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
            XLSX.writeFile(workbook, `BangDiem-${convertPascalCase(studentName)}.xlsx`);
        }
    };
}

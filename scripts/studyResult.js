async function exportStudyResult() {
  const studyResultResponse = await fetch(
    `https://${location.host}/Statistics/StudyResult`
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
}

function renderModalCourseDetail() {
  const btnGroups = document.getElementsByClassName("btn-group")[0];
  btnGroups.innerHTML += `<button class="btn btn-default" id="btnExportStudyResult">Xuất bảng điểm</button>`;
}

window.addEventListener("load", () => {
  const isValid =
    location.href === getFullUrl(SITE_URL.base.husc, SITE_URL.studyResult);

  if (isValid) {
    renderModalCourseDetail();
    document
      .querySelector("#btnExportStudyResult")
      .addEventListener("click", exportStudyResult);
  }
});

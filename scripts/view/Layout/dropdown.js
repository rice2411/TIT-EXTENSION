const initTITDropDown = () => {
    const mainMenu = document
        .getElementById(`menuMain`)
        .getElementsByClassName("navbar-nav")[0];
    const titDropdown = `<li class="dropdown">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">TIT EXTENSION <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-header ">Tính năng hỗ trợ</li>
                                <li class="tit-button"><a href="#"  data-toggle="modal" data-target="#dialogMain">Thống kê điểm</a></li>
                                <li class="tit-button"><a href="#" >Xuất bảng điểm</a></li>
                            </ul>
                        </li>`;
    mainMenu.innerHTML += titDropdown;
};

//#region Statistics
const getInfoStudent = () => {
    const studentName = document.querySelectorAll(".hitec-information h5")[0]
        .textContent;
    const anotherInfo = [...document.getElementsByTagName("a")]
        .filter((item) => item.href.includes("Setting/Change"))[0]
        .textContent.split(`\n`);
    document.getElementById("student-name").innerHTML = studentName;
    document.getElementById("student-major").innerHTML = anotherInfo[1];
    document.getElementById("student-time-study").innerHTML = anotherInfo[2];
    document.getElementById("student-semester").innerHTML = anotherInfo[3];
};

const statisticsScore = async () => {
    const url = getFullUrl(SITE_URL.base.husc, SITE_URL.studyResult)
    const doc = await getPageDOM(url)
    const studyInfo = doc.querySelectorAll(".form-control-static");
    const totalCreditsEarned = studyInfo[3].textContent;
    const grade4AVG = studyInfo[4].textContent;
    const tableRows = [
        ...doc.querySelectorAll("tbody")[0].querySelectorAll("tr"),
    ];
    let totalScoreGrade10 = 0;
    const countGrade4AVG = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        F: 0,
    };
    tableRows
        .filter((row) => row.children.length === 8)
        .map((row) => {
            totalScoreGrade10 +=
                parseFloat(row.children[5].textContent) *
                parseInt(row.children[2].textContent);
            countGrade4AVG[`${row.children[6].textContent}`]++;
        });
    const grade10AVG =
        Math.round((totalScoreGrade10 / parseInt(totalCreditsEarned)) * 100) / 100;
    const getRankType = (mark) => {
        if (mark >= 3.6) {
            return "Xuất sắc";
        }
        if (mark < 3.6 && mark >= 3.2) {
            return "Giỏi";
        }
        if (mark < 3.2 && mark >= 2.5) {
            return "Khá";
        }
        if (mark < 2.5) {
            return "Trung bình";
        }
    };

    document.getElementById("total-credits").innerHTML = totalCreditsEarned;
    document.getElementById("grade4AVG").innerHTML = grade4AVG;
    document.getElementById("grade10AVG").innerHTML = grade10AVG;
    document.getElementById("quantity-a").innerHTML = countGrade4AVG.A;
    document.getElementById("quantity-b").innerHTML = countGrade4AVG.B;
    document.getElementById("quantity-c").innerHTML = countGrade4AVG.C;
    document.getElementById("quantity-d").innerHTML = countGrade4AVG.D;
    document.getElementById("quantity-f").innerHTML = countGrade4AVG.F;
    document.getElementById("academic-ability").innerHTML = getRankType(
        parseFloat(grade4AVG)
    );
    document.getElementById("training-assessment").innerHTML =
        await traningAssessment();
    initChart(countGrade4AVG);
};

const traningAssessment = async () => {
    const url = getFullUrl(SITE_URL.base.husc, SITE_URL.conduct)
    const doc = await getPageDOM(url)
    const rows = [...doc.querySelector("tbody").children];
    const total = Math.round(
        rows.reduce((sum, row) => sum + parseInt(row.children[3].textContent || 0), 0) /
        rows.filter((row) => row.children[3].textContent).length
    );

    if (total >= 90) return "Xuất Sắc";
    if (total < 90 && total >= 80) return "Giỏi";
    if (total < 80 && total >= 70) return "Khá";
    if (total < 70 && total >= 60) return "Trung Bình Khá";
    if (total < 60 && total >= 50) return "Trung Bình";
    if (total < 50 && total >= 30) return "Yếu";
    if (total < 30) return "Kém";
};

const initChart = (dataInput) => {
    const ctx = document.getElementById("statistics-chart");
    const data = {
        datasets: [
            {
                label: "THỐNG KÊ XẾP LOẠI",
                data: [dataInput.A, dataInput.B, dataInput.C, dataInput.D, dataInput.F],
                backgroundColor: [
                    "#62B58A",
                    "#ffc534",
                    "#29c3be",
                    "#5d62b5",
                    "#f2726f",
                ],
            },
        ],
        labels: ["Điểm A", "Điểm B", "Điểm C", "Điểm D", "Điểm F"],
    };
    const config = {
        type: "pie",
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    };
    new Chart(ctx, config);
};

const renderModalStatistics = async () => {
    try {
        const response = await fetch(
            chrome.runtime.getURL("/page/modal/statistics.html")
        );
        const modalHtmlRaw = await response.text();
        document.getElementById('dialogMain').innerHTML += modalHtmlRaw;
        getInfoStudent();
        statisticsScore();
    } catch (e) {
        console.log(e);
    }
};
//#endregion

//#region Export Excel
const exportStudyResult = async () => {
    const studyResultResponse = await fetch(
        getFullUrl(SITE_URL.base.husc, SITE_URL.studyResult)
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



window.addEventListener("load", async () => {
    await initTITDropDown();
    document.querySelectorAll('.tit-button')[0].addEventListener('click', () => {
        renderModalStatistics()

    })
    document.querySelectorAll('.tit-button')[1].addEventListener('click', () => {
        exportStudyResult()

    })
});




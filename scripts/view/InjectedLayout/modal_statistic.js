

const getStudentId = async () => {
    const studentId = localStorage.getItem('studentId')
    document.getElementById('student-id').innerHTML = studentId
}

const getInfoStudent = () => {
    getStudentId()
    const studentName = document.querySelectorAll(".hitec-information h5")[0]
        .textContent;
    const anotherInfo = [...document.getElementsByTagName("a")]
        .filter((item) => item.href.includes("Setting/Change"))[0]
        .textContent.split(`\n`);
    document.getElementById("student-name").innerHTML = studentName;
    document.getElementById("student-time-study").innerHTML = anotherInfo[1];
    document.getElementById("student-major").innerHTML = anotherInfo[2];
    document.getElementById("student-semester").innerHTML = anotherInfo[3];
};

const getCreditsInfo = async (studyResultData) => {
    //variable
    const url = getFullUrl(location.origin, SITE_URL.trainningProgram);
    const doc = await getPageDOM(url);
    const trannignProgramInfo = doc.querySelectorAll(
        ".container-fluid .form-horizontal"
    )[0];
    const totalCredits =
        trannignProgramInfo.children[1].querySelectorAll(".col-xs-2")[0]
            .textContent;
    const minEarnCredits = trannignProgramInfo.children[2].querySelectorAll(
        ".form-control-static"
    )[0].textContent;
    const earnedCredits = document.getElementById("earned-creadits").textContent;
    const tableRows = [
        ...doc.querySelectorAll("tbody")[0].querySelectorAll("tr"),
    ];
    const trainingProgramData = [];
    const { completed, failed } = studyResultData;
    const limitFailed = Math.floor((5 * totalCredits) / 100);
    const creditsFailed = failed.reduce(
        (total, item) => total + item.credits * item.count,
        0
    );
    const beautifulData = [];
    let index = -1;
    let object = {};
    let result = "";
    // inside function
    const template = (item) => {
        return `<div class="item">
                    <div class="text">
                        ${item.title}
                    </div>
                    <p class="value"><b>${item.completedRequiredCredits +
            item.completedOptionCredits
            }/${item.total
            }</b> <span class="glyphicon glyphicon-question-sign"></span>
                    </p>
                </div>`;
    };
    //logic
    tableRows.forEach((row) => {
        if (row.children.length === 1) {
            object = {
                title: row.querySelectorAll("strong")[0].textContent,
                data: [],
                required: parseInt(
                    row.querySelectorAll("span")[1].textContent.split(":")[1].trim()
                ),
                option: 0,
                total: parseInt(
                    row
                        .querySelectorAll("span")[0]
                        .textContent.split(":")[1]
                        .trim()
                        .slice(0, -1)
                ),
            };
            object.option = object.total - object.required;
            trainingProgramData.push(object);
            index++;
        } else {
            const object = trainingProgramData[index];
            const item = {
                id: row.children[1].textContent.trim(),
                name: row.children[2].textContent.trim(),
                credits: parseInt(row.children[3].textContent.trim()),
                required: !!row.children[4].textContent.trim(),
            };
            object.data.push(item);
        }
    });
    trainingProgramData.forEach((item) => {
        const itemStatistic = {
            ...item,
            completedRequiredCredits: 0,
            completedOptionCredits: 0,
            uncompletedCourse: [],
        };
        item.data.forEach((course) => {
            if (course.required && completed.includes(course.id))
                itemStatistic.completedRequiredCredits += course.credits;
            else if (!course.required && completed.includes(course.id))
                itemStatistic.completedOptionCredits += course.credits;
            else itemStatistic.uncompletedCourse.push(course);
        });
        beautifulData.push(itemStatistic);
    });
    beautifulData.forEach((item) => {
        result += template(item);
    });

    //render
    document.getElementById("credits-detail").innerHTML = result;
    document.getElementById("limit-failed").innerHTML = limitFailed;
    document.getElementById('special').classList.add(creditsFailed > limitFailed ? 'special' : '')
    document.getElementById("is-decrease").innerHTML = creditsFailed > limitFailed ? 'Bị hạ bậc' : 'Không bị hạ bậc';
    document
        .getElementById("is-decrease")
        .classList.add(
            creditsFailed > limitFailed ? "text-danger" : ""
        );
    document.getElementById("failed-credits").innerHTML = creditsFailed;
    document
        .getElementById("failed-credits")
        .classList.add(
            creditsFailed > limitFailed ? "text-danger" : "text-success"
        );
    document.getElementById("total-credits").innerHTML = "/" + minEarnCredits;
    document.getElementById("need-credits").innerHTML =
        parseInt(minEarnCredits) - parseInt(earnedCredits);
    document.getElementById(
        "total-warning"
    ).innerHTML = `${totalCredits} tín chỉ`;
    document.getElementById(
        "limit-warning"
    ).innerHTML = `5% (${limitFailed} tín chỉ)`;
};

const statisticsScore = async () => {
    const url = getFullUrl(location.origin, SITE_URL.studyResult);
    const doc = await getPageDOM(url);
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
    const studyResultData = {
        completed: [],
        failed: [],
    };
    tableRows
        .filter((row) => row.children.length === 8)
        .forEach((row) => {
            if (
                row.children[6].textContent.trim() !== "F" &&
                parseInt(row.children[3].textContent.trim() === 1)
            ) {
                studyResultData.completed.push(row.children[0].textContent.trim());
            }
            if (parseInt(row.children[3].textContent.trim()) > 1) {
                const faildedCourse = {
                    id: row.children[0].textContent.trim(),
                    credits: parseInt(row.children[2].textContent.trim()),
                    count: parseInt(row.children[3].textContent.trim()),
                };
                studyResultData.failed.push(faildedCourse);
            }
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

    document.getElementById("earned-creadits").innerHTML = totalCreditsEarned;
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
    // initChart(countGrade4AVG);
    return studyResultData;
};

const traningAssessment = async () => {
    const url = getFullUrl(location.origin, SITE_URL.conduct);
    const doc = await getPageDOM(url);
    const rows = [...doc.querySelector("tbody").children];
    const total = Math.round(
        rows.reduce(
            (sum, row) => sum + parseInt(row.children[3].textContent || 0),
            0
        ) / rows.filter((row) => row.children[3].textContent).length
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

const initIcon = () => {
    document.getElementById('icon-student-id').src = chrome.runtime.getURL(getStaticResource('svg', 'id'));
    document.getElementById('icon-student-name').src = chrome.runtime.getURL(getStaticResource('svg', 'student'));
    document.getElementById('icon-time-study').src = chrome.runtime.getURL(getStaticResource('svg', 'time-study'));
    document.getElementById('icon-major').src = chrome.runtime.getURL(getStaticResource('svg', 'major'));
    document.getElementById('icon-semester').src = chrome.runtime.getURL(getStaticResource('svg', 'semester'));
    document.getElementById('icon-certificate').src = chrome.runtime.getURL(getStaticResource('svg', 'certificate'));
}

const renderModalStatistics = async () => {
    try {
        const response = await fetch(
            chrome.runtime.getURL(getStaticResource("modal", "new_modal")
            ))
        const modalHtmlRaw = await response.text();
        document.getElementById("dialogMain").innerHTML += modalHtmlRaw;
        initIcon()
        getInfoStudent();
        const studyResultData = await statisticsScore();
        getCreditsInfo(studyResultData);
    } catch (e) {
        console.log(e);
    }
};
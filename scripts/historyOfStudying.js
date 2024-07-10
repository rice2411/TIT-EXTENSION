const scoreAnalysis = () => {
    let totalMark = 0;
    let totalPercent = 0;

    const percentageElements = document.querySelectorAll(
        "#modalCourseDetail table th"
    );
    const scoreElements = document.querySelectorAll(
        "#modalCourseDetail table td"
    );

    for (let i = 0; i < 6; i++) {
        const percentageText = percentageElements[i]?.textContent;
        const score = parseFloat(scoreElements[i]?.textContent) || 0;
        const percentage = parseInt(percentageText?.split("(")[1]) || 0;
        totalPercent += percentage;
        totalMark += percentage * score;
    }

    const neededScore = (target) => {
        let needed = (target - totalMark) / (100 - totalPercent);
        needed = Math.max(0, Math.round(needed * 100) / 100);
        needed = needed % 0.25 === 0 ? needed : needed - (needed % 0.25) + 0.25;
        return needed;
    };

    if (totalMark > 0) {
        const needForA = neededScore(850); // 8.5
        const needForB = neededScore(700); // 7
        const needForC = neededScore(550); // 5
        const needForD = neededScore(400); // 4

        return `Bạn cần đạt ${needForA} điểm thi HK để đạt điểm A / ${needForB} điểm thi HK để đạt điểm B / ${needForC} điểm thi HK để đạt điểm C / ${needForD} điểm thi HK để đạt điểm D`;
    }

    return null;
};

const initIconOpenModal = () => {
    const table = document.getElementsByClassName("table")[0];
    const links = table.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const url = link.href;
        if (url.includes("/Course/Detail")) {
            const span = document.createElement("span");
            span.setAttribute("data-target", "#modalCourseDetail");
            span.setAttribute("data-toggle", "modal");
            const icon = document.createElement("a");
            const iconClass =
                "glyphicon glyphicon-exclamation-sign tit-mr-7px cursor-pointer course-detail-btn";
            icon.setAttribute("data-toggle", "tooltip");
            icon.setAttribute("title", "Chi tiết học phần");
            addClassToNode(iconClass, icon);
            span.appendChild(icon);
            link.after(span);
            icon.onclick = async () => {
                const body = document.getElementById("course-detail");
                body.innerHTML = "<div id='result'></div>";
                const response = await fetch(url);
                const htmlRaw = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlRaw, "text/html");
                const content = doc.getElementById("courseInformation");
                body.appendChild(content);
                const isHaveProcessStudyScore = [...content.getElementsByTagName('fieldset')].length === 5
                const resultDiv = document.getElementById("result");
                if (isHaveProcessStudyScore) {
                    const result = scoreAnalysis();
                    if (result !== null) {
                        const alert = `<p class="alert alert-warning"> ${result} </p>`;
                        resultDiv.innerHTML += alert;
                    }
                } else {
                    const alert = `<p class="alert alert-info"> Chưa có dữ liệu về điểm của môn học này hoặc môn học này không có điểm QTHT </p>`;
                    resultDiv.innerHTML += alert;
                }

            };
        }
    }
};

const renderModalCourse = async () => {
    const response = await fetch(chrome.runtime.getURL("/modal_course.html"));
    const modalHtmlRaw = await response.text();
    document.body.innerHTML += modalHtmlRaw;
};

window.addEventListener("load", async () => {
    const isValid =
        location.href === getFullUrl(SITE_URL.base.husc, SITE_URL.historyStudying);
    if (isValid) {
        await renderModalCourse();
        await initIconOpenModal();
    }
});

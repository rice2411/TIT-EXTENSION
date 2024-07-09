const scoreAnalysis = () => {
    let totalMark = 0;
    let totalPercent = 0;

    const thElements = document.querySelectorAll("#modalCourseDetail table th");
    const tdElements = document.querySelectorAll("#modalCourseDetail table td");

    for (let i = 0; i < 6; i++) {
        const thText = thElements[i].textContent;
        const mark = parseFloat(tdElements[i].textContent) || 0;
        let weight = parseInt(thText.split("(")[1]) || 0;
        totalPercent += weight;
        totalMark += weight * mark;
    }

    const calculateNeededMark = (target) => {
        let needed = (target - totalMark) / (100 - totalPercent);
        needed = Math.max(0, Math.round(needed * 100) / 100);
        needed = needed % 0.25 === 0 ? needed : needed - (needed % 0.25) + 0.25;
        return needed;
    };

    if (totalMark > 0) {
        const needForA = calculateNeededMark(850);
        const needForB = calculateNeededMark(700);
        const needForC = calculateNeededMark(550);
        const needForD = calculateNeededMark(400);

        return `Bạn cần đạt ${needForA} điểm thi HK để đạt loại A / ${needForB} điểm thi HK để đạt loại B / ${needForC} điểm thi HK để đạt loại C / ${needForD} điểm thi HK để đạt loại D`;
    }

    return null;
};

const initIconOpenModal = () => {
    const table = document.getElementsByClassName('table')[0]
    const links = table.getElementsByTagName('a')
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const url = link.href
        if (url.includes("/Course/Detail")) {
            const span = document.createElement('span')
            span.setAttribute('data-target', '#modalCourseDetail')
            span.setAttribute('data-toggle', 'modal')
            const icon = document.createElement('a');
            const iconClass = 'glyphicon glyphicon-exclamation-sign tit-mr-7px cursor-pointer course-detail-btn'
            icon.setAttribute('data-toggle', 'tooltip')
            icon.setAttribute('title', 'Chi tiết học phần')
            addClassToNode(iconClass, icon)
            span.appendChild(icon)
            link.after(span)
            icon.onclick = async () => {
                const body = document.getElementById('course-detail')
                body.innerHTML = ""
                const response = await fetch(url)
                const htmlRaw = await response.text()
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlRaw, 'text/html');
                const content = doc.getElementById('courseInformation')
                body.appendChild(content)
                const result = scoreAnalysis();
                console.log(result);
            }

        }
    }
}

const renderModalCourse = async () => {
    const response = await fetch(chrome.runtime.getURL('/modal_course.html'))
    const modalHtmlRaw = await response.text()
    document.body.innerHTML += modalHtmlRaw
}

window.addEventListener('load', async () => {
    const isValid = location.href === getFullUrl(SITE_URL.base.husc, SITE_URL.historyStudying)
    if (isValid) {
        await renderModalCourse()
        await initIconOpenModal()
    }
})
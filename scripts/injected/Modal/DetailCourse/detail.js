class DetailCourse {
    getScoreDetail() {
        let totalMark = 0;
        let totalPercent = 0;

        const percentageElements = document.querySelectorAll(
            "#detail-course-modal table th"
        );
        const scoreElements = document.querySelectorAll(
            "#detail-course-modal table td"
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
        console.log(totalMark);
        return null;
    };
    drawIconOpenModal() {
        const table = document.getElementsByClassName("table")[0];
        const links = table.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const url = link.href;
            if (url.includes("/Course/Detail")) {
                const spanOption = {
                    type: 'span',
                    classList: '',
                    textContent: '',
                    attributes: [
                        {
                            data: `data-target`,
                            value: `#dialogMain`
                        },
                        {
                            data: `data-toggle`,
                            value: `modal`
                        }
                    ]
                }
                const iconOption = {
                    type: 'a',
                    classList: 'glyphicon glyphicon-exclamation-sign tit-ml-2 tit-cursor-pointer course-detail-btn',
                    textContent: '',
                    attributes: [
                        {
                            data: `ddata-toggle`,
                            value: `tooltip`
                        },
                        {
                            data: `title`,
                            value: `Chi tiết học phần`
                        }
                    ]
                }
                const span = createDOMElement(spanOption)
                const icon = createDOMElement(iconOption)

                span.appendChild(icon);
                link.after(span);
                icon.onclick = async () => {
                    await this.onRenderModalDetailCourse();
                    span.click()
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
                        const result = this.getScoreDetail();
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
    async onRenderModalDetailCourse() {
        const response = await fetch(chrome.runtime.getURL("view/Modal/DetailCourse/index.html"));
        const modalHtmlRaw = await response.text();
        document.getElementById("dialogMain").innerHTML += modalHtmlRaw;
    };
    static async onLoad() {
        const instance = new DetailCourse();
        await instance.getScoreDetail();
        await instance.drawIconOpenModal();
    }
}





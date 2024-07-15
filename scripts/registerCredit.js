const analysisCourse = (listTime) => {
    const rows = [...document.querySelectorAll("tbody")[0].children];
    rows
        .filter((row) => row.children.length !== 1)
        .map((row) => {
            if (row.children[6].children.length) {
                const timeOfCourse = getTimeOfCourse(row.children[2].textContent);
                const isDuplicate = checkDuplicateTime(listTime, timeOfCourse, row);
                if (isDuplicate) {
                    row.children[6].addEventListener("click", () => {
                        const modal = document.querySelectorAll(".modal-content")[0];
                        const alert = `<div class="alert alert-danger" data-toggle="tooltip" title="Hooray!"> <b> Cảnh báo !</b> Học phần này đang bị trùng lịch với học phần bạn đã đăng kí hãy xác nhận nếu bạn vẫn muốn đăng kí </div>
                          <label class="tit-flex tit-items-center tit-justify-end" for="agree">
                         <input type="checkbox" class=" tit-mt-0" id="agree" name="option1" value="something" > 
                        <p class="tit-pl-2 tit-mx-0 tit-my-0  "> Xác nhận vẫn đăng kí học phần này </p>
                        </label>
                    `;
                        modal.querySelectorAll(".modal-body .form-horizontal")[0].innerHTML +=
                            alert;
                        const buttonRegistration = document.getElementById('buttonCourseRegistration')
                        buttonRegistration.disabled = true
                        document.getElementById('agree').onchange = (e) => {
                            buttonRegistration.disabled = !e.target.checked;
                        }
                    });
                }
            }
        });
};

const checkDuplicateTime = (listTime, time, node) => {
    const timeSplit = time.split(`/`);
    const day = timeSplit[0];
    const hours = timeSplit[1].split("-");
    for (let i = 0; i < listTime.length; i++) {
        const item = listTime[i].time.split("/");
        const dayItem = item[0];
        const hoursItem = item[1].split(`-`);
        if (dayItem === day) {
            if (
                parseInt(hoursItem[0]) >= parseInt(hours[0]) &&
                parseInt(hoursItem[0]) <= parseInt(hours[1])
            ) {
                node.classList.add("tit-text-danger");
                node.classList.add("cursor-pointer");
                node.setAttribute("data-target", "#modalCourseDetail");
                node.setAttribute("title", "Học phần này đang bị trùng lịch");
                node.children[0].querySelectorAll(
                    "small"
                )[0].innerHTML += ` - Nhóm học phần này đang bị trùng lịch với <b>${listTime[i].name}</b>`;
                return true;
            }
        }
    }
    return false;
};

const getDataRegisterdCourses = async () => {
    const url = getFullUrl(SITE_URL.base.husc, SITE_URL.registeredCourse);
    const htmlRaw = await getHtmlRawOfPage(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlRaw, "text/html");
    const courses = [...doc.querySelectorAll("tbody")[0].children];
    return courses
        .filter((course) => course.children.length !== 1)
        .map((course) => {
            return {
                name: getTimeOfCourse(course.children[1].textContent),
                time: getTimeOfCourse(
                    course.children[5].querySelectorAll("span")[0].textContent
                ),
            };
        });
};

window.addEventListener("load", async () => {
    if (
        location.href.includes(getFullUrl(SITE_URL.base.husc, SITE_URL.courses))
    ) {
        const listTime = await getDataRegisterdCourses();
        await analysisCourse(listTime);
    }
});

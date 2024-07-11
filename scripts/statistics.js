const initInfoStudent = () => {
    const studentName = document.querySelectorAll('.hitec-information h5')[0].textContent
    const anotherInfo = [...document.getElementsByTagName('a')].filter((item) => item.href.includes('Setting/Change'))[0].textContent.split(`\n`)
    document.getElementById('student-name').innerHTML = studentName
    document.getElementById('student-major').innerHTML = anotherInfo[1]
    document.getElementById('student-time-study').innerHTML = anotherInfo[2]
    document.getElementById('student-semester').innerHTML = anotherInfo[3]
}

const renderModalStatistics = async () => {
    const response = await fetch(chrome.runtime.getURL("/modal_statistics.html"));
    const modalHtmlRaw = await response.text();
    document.body.innerHTML += modalHtmlRaw;
};

window.addEventListener('load', async () => {
    await renderModalStatistics()
    initInfoStudent()
})
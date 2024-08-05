const content = document.getElementById("tit-content");
const notiSwicth = document.getElementById("tit-isCanNoti");



notiSwicth.onchange = (e) => {
    chrome.storage.sync.set({ newPermission: e.target.checked });
    const alertDiv = document.getElementById("tit-alert");
    alertDiv.innerHTML = "Vui lòng tải lại trang để áp dụng cài đặt";
};

const getPermissionNotification = async () => {
    const { isCanNoti } = await chrome.storage.sync.get("isCanNoti");
    notiSwicth.checked = isCanNoti;
};

const checkValidPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const VALID_URL = [location.origin, SITE_URL.base.huflis]
        const isValid = VALID_URL.filter((link) =>
            tabs[0].url.includes(link)
        ).length;
        if (!isValid) {
            content.innerHTML = "TIT EXTENSION không hỗ trợ trang web này :(";
        }
    });
};

window.addEventListener("load", async () => {
    getPermissionNotification();
    checkValidPage();
});

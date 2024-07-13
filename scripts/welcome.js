
const displayCourseWarningComponent = () => {
    var newNode = document.createElement('div');
    newNode.innerHTML = '<p class="alert alert-success" data-toggle="tooltip" title="Hooray!"> Bọn mình là <b>TIT EXTENSION</b>, tiện ích này sẽ giúp 4-5 năm học Đại học của bạn dễ dàng hơn </p>'
    const location = document.getElementById('ajax-loader')
    location.parentNode.insertBefore(newNode, location)
}

const gettPermissionNotification = async () => {
    const clientPermission = localStorage.getItem('isCanNoti')
    const { newPermission } = await chrome.storage.sync.get('newPermission')
    if (!clientPermission) {
        chrome.storage.sync.set({ 'isCanNoti': 1 });
        localStorage.setItem('isCanNoti', 1)
    } else {
        chrome.storage.sync.set({ 'isCanNoti': newPermission ?? +clientPermission });
    }
}

window.addEventListener('load', () => {
    displayCourseWarningComponent()
    gettPermissionNotification()
});



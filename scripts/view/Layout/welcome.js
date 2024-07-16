
const displayCourseWarningComponent = () => {
    const welcomeOption = {
        type: 'p',
        classList: `alert alert-success`,
        innerHTML: `Bọn mình là <b>TIT EXTENSION</b>, hãy để tụi mình đồng hành tại trang tín chỉ cùng bạn nhé`,
        attributes: [
            {
                data: `data-toggle`,
                value: `tooltip`
            },
            {
                data: `title`,
                value: `Hooray!`
            },
        ]
    }
    var welcomeDOM = createDOMElement(welcomeOption)
    const location = document.getElementById('ajax-loader')
    location.parentNode.insertBefore(welcomeDOM, location)
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



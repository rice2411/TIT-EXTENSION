const NOTIFICAITON_TYPE = `notification`

const generateTemplateNotification = (message, icon = '/images/TIT-LOGO.png') => {
    return {
        title: `Thông báo mới từ TIT EXTENSION `,
        message: message,
        iconUrl: icon,
        type: 'basic'
    }
}

const handleCheckSameListMess = async (isNew = false) => {
    const url = `https://${location.host}/message/inbox`;
    const payload = {
        page: 1,
        search: ''
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/javascript'
        },
        body: JSON.stringify(payload)
    })
    const htmlResponse = await response.text()
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlResponse, 'text/html');
    const oldListMess = JSON.parse(sessionStorage.getItem('listMess'))
    const listMessages = [...doc.querySelectorAll('tr')]
    const unReadSignature = `font-weight`
    const listUnReadMessages = listMessages.filter((item) => item.style[`${0}`] === unReadSignature)
    const listIdMess = []
    listUnReadMessages.map((item) => {
        const idMessage = item.childNodes[5].querySelector('a').href.split('/')[6]
        listIdMess.push(idMessage)
    })
    sessionStorage.setItem('listMess', JSON.stringify(listIdMess))
    if (isNew) {
        const removed = oldListMess.filter(item => !listIdMess.includes(item));
        const added = listIdMess.filter(item => !oldListMess.includes(item));
        return { removed, added }
    }


}

const handleAlertNewMessage = async () => {
    setTimeout(async () => {
        const noti = document.getElementsByClassName('notification-message')[0]
        const isFirstTimeCache = sessionStorage.getItem('isFirstTime')
        const isFirstTime = isFirstTimeCache === null ? 1 : +isFirstTimeCache
        const oldListMess = JSON.parse(sessionStorage.getItem('listMess')) || []
        if (noti.textContent) {
            const count = noti.textContent.match(/\d+/)[0];
            let canNoti = isFirstTime
            if (!isFirstTime && count !== oldListMess.length) {
                const listMess = await handleCheckSameListMess(true);
                canNoti = listMess.added.length ? true : false;
            }
            const { isCanNoti } = await chrome.storage.sync.get("isCanNoti");
            if (canNoti && isCanNoti) {
                const message = `Bạn có ${count} tin nhắn từ trang tín chỉ`
                chrome.runtime.sendMessage('', {
                    type: NOTIFICAITON_TYPE,
                    options: generateTemplateNotification(message)
                });
                sessionStorage.setItem('isFirstTime', '0')
                sessionStorage.setItem('count', count.toString())
            }

        }
    }, 1000)
}

const getPermissionNotification = async () => {
    const clientPermission = localStorage.getItem('isCanNoti')
    const { newPermission } = await chrome.storage.sync.get('newPermission')
    if (!clientPermission) {
        chrome.storage.sync.set({ 'isCanNoti': 1 });
        localStorage.setItem('isCanNoti', 1)
    } else {
        chrome.storage.sync.set({ 'isCanNoti': newPermission ?? +clientPermission });
    }
}

window.addEventListener('load', async () => {
    await getPermissionNotification()
    const isFirstTimeCache = sessionStorage.getItem('isFirstTime')
    const isFirstTime = isFirstTimeCache === null ? 1 : +isFirstTimeCache
    if (isFirstTime) {
        await handleCheckSameListMess()
    }
    handleAlertNewMessage();
});




chrome.runtime.onMessage.addListener(data => {
    switch (data.type) {
        case 'notification':
            chrome.notifications.create('', data.options);
            break
        case "exportMark":
            // make a new task to download the excel file
            chrome.tabs.create({ url: data.url });
            break;
    }

});

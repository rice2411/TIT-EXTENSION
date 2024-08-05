const onRenderModalStatistics = async () => {
    try {
        const htmlResponse = await fetch(
            chrome.runtime.getURL('view/Modal/Statistics/index.html')
        );
        const htmlRaw = await htmlResponse.text();
        document.getElementById("dialogMain").innerHTML += htmlRaw;
        await onRenderCredtisStatisticsTab()
    } catch (e) {
        console.log(e);
    }
};

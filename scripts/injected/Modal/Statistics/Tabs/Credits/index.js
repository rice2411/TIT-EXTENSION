const onRenderCredtisStatisticsTab = async () => {
    try {
        const htmlResponse = await fetch(
            chrome.runtime.getURL('view/Modal/Statistics/Tabs/credits.html')
        );
        const htmlRaw = await htmlResponse.text();
        document.querySelectorAll("#statistics-modal .tab-content")[0].innerHTML += htmlRaw;
        await CreditsStatistics.onLoad();
    } catch (e) {
        console.log(e);
    }
};

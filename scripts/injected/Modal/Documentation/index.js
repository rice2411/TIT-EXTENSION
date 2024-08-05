const onRenderDocumentationModal = async () => {
    try {
        const htmlResponse = await fetch(
            chrome.runtime.getURL('view/Modal/Documentation/index.html')
        );
        const htmlRaw = await htmlResponse.text();
        document.getElementById("dialogMain").innerHTML += htmlRaw;
        new Documentation()
    } catch (e) {
        console.log(e);
    }
};

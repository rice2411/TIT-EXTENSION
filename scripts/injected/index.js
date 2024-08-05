const onRenderInjectedLayout = () => {
    const stringLayout = `<div class="hitec-general-function">
    <h5>TIT EXTENSION</h5>
    <p class="tit-flex">
        <img src="${chrome.runtime.getURL(getStaticResource("png", "statistics"))}"  alt="">
        <a href="#" class="tit-button" data-toggle="modal" data-target="#dialogMain">Thống kê tín chỉ</a>
    </p>
    <p class="tit-flex">
        <img src="${chrome.runtime.getURL(getStaticResource("png", "export"))}"  alt="">
        <a href="#" class="tit-button">Xuát bản điểm</a>
    </p>
    <p class="tit-flex">
        <img src="${chrome.runtime.getURL(getStaticResource("png", "maintanace"))}"  alt="">
        <a href="#" class="tit-button">Đang phát triển ...</a>
    </p>

</div>`
    var newElement = document.createElement('div');
    newElement.innerHTML = stringLayout;
    const hotNews = document.getElementById('hotNews')
    var parentDiv = hotNews.parentNode;
    parentDiv.insertBefore(newElement, hotNews);
};

window.addEventListener("load", async () => {
    await onRenderInjectedLayout();
    document.querySelectorAll(".tit-button")[0].addEventListener("click", async () => {
        await onRenderModalStatistics();
    });
    document.querySelectorAll(".tit-button")[1].addEventListener("click", () => {
        new ExportData().excelExport()
    });

});

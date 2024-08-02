const initInjectedLayout = () => {
    const mainMenu = document
        .getElementById(`menuMain`)
        .getElementsByClassName("navbar-nav")[0];
    const injected = `<li class="dropdown">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">TIT EXTENSION <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-header ">Tính năng hỗ trợ</li>
                                <li class="tit-button"><a href="#"  data-toggle="modal" data-target="#dialogMain">Thống kê điểm</a></li>
                                <li class="tit-button"><a href="#" >Xuất bảng điểm</a></li>
                            </ul>
                        </li>`;
    mainMenu.innerHTML += injected;
};

window.addEventListener("load", async () => {
    await initInjectedLayout();
    document.querySelectorAll(".tit-button")[0].addEventListener("click", async () => {
        await renderModalStatistics();
    });
    document.querySelectorAll(".tit-button")[1].addEventListener("click", () => {
        exportStudyResult();
    });

});

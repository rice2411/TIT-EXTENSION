const initTITDropDown = () => {
    const mainMenu = document.getElementById(`menuMain`).getElementsByClassName('navbar-nav')[0]
    const titDropdown = `<li class="dropdown bg-linear">
                            <a href="javascript:;" class="dropdown-toggle " data-toggle="dropdown">TIT EXTENSION <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li class="dropdown-header">Tính năng hỗ trợ</li>
                                <li><a href="#"  data-toggle="modal" data-target="#modalStatisics">Thống kê điểm</a></li>
                                <li><a href="/Studying/RegisteredCourses">Lớp học phần đã đăng ký</a></li>
                                <li><a href="/TimeTable">Lịch trình học tập</a></li>
                                <!-- <li><a href="~/Support/Scheduling">Xử lý đăng ký học tập</a></li> -->
                                <li><a href="/Studying/ScheduleOfExam">Lịch thi kết thúc học phần</a></li>
                            </ul>
                        </li>`
    mainMenu.innerHTML += titDropdown
}


window.addEventListener("load", async () => {
    initTITDropDown()
});

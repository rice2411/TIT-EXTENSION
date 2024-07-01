
function displayCourseWarningComponent() {
    var newNode = document.createElement('div');
    newNode.innerHTML = '<p class="alert alert-success"> Bọn mình là <b>TIT EXTENSION</b>, tiện ích này sẽ giúp 4-5 năm học Đại học của bạn dễ dàng hơn </p>'
    const location = document.getElementById('ajax-loader')
    location.parentNode.insertBefore(newNode, location)
}



window.addEventListener('load', function () {
    displayCourseWarningComponent()

});

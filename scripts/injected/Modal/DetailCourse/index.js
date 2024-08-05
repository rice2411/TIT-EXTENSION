

window.addEventListener("load", async () => {
    if (location.href === getFullUrl(location.origin, SITE_URL.historyStudying)) {
        DetailCourse.onLoad();
    }
});

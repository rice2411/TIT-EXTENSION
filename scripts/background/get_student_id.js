window.addEventListener('load', async () => {
    if (!location.href.includes('Login')) {
        const studentId = localStorage.getItem('studentId')
        if (studentId === null) {
            const url = getFullUrl(location.origin, SITE_URL.logout)
            await fetch(url)
        }
    } else {
        document.querySelectorAll('button')[0]
            .addEventListener('click', () => {
                const studentId = document.getElementById('loginID').value
                localStorage.setItem('studentId', studentId)
            })
    }

})
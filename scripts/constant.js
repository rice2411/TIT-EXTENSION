const NOTIFICAITON_TYPE = `notification`
const SITE_URL = {
    base: {
        husc: `https://student.husc.edu.vn`,
        huflis: `https://student.huflis.edu.vn`
    },
    historyStudying: `/Statistics/HistoryOfStudying`
}

const getFullUrl = (base, extension) => {
    return base + extension
}

const addClassToNode = (styleClass, node) => {
    styleClass = styleClass.split(' ')
    for (let i = 0; i < styleClass.length; i++) {
        node.classList.add(styleClass[i])
    }
}
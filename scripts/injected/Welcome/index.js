
const onRenderWelcomeMessage = () => {
    const welcomeOption = {
        type: 'p',
        classList: `alert alert-success`,
        innerHTML: `Bọn mình là <b>TIT EXTENSION</b>, hãy để tụi mình đồng hành tại trang tín chỉ cùng bạn nhé`,
        attributes: [
            {
                data: `data-toggle`,
                value: `tooltip`
            },
            {
                data: `title`,
                value: `Hooray!`
            },
        ]
    }
    var welcomeDOM = createDOMElement(welcomeOption)
    const location = document.getElementById('ajax-loader')
    location.parentNode.insertBefore(welcomeDOM, location)
}


window.addEventListener('load', () => {
    onRenderWelcomeMessage()
});

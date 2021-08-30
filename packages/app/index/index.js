import entry from '../entry'
import App from 'view-touch'
import '@style/index.less'

document.body.classList.add('ud-override')

entry((Vue) => {
    new Vue({
        el: '#app',
        render: h => h(App)
    })
})

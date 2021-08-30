import Vue from 'vue'
import { uuid } from '@digibird/common'
import { IS_DEV } from './env'
import Draggable from '@plugin/draggable'

Vue.prototype.$uuid = uuid
Vue.use(Draggable)

Vue.config.productionTip = false
Vue.config.devtools = IS_DEV

// listeners 使用与 methods 相同的合并策略
const strategies = Vue.config.optionMergeStrategies
strategies.listeners = strategies.methods

export default run => {
    run(Vue)
}

window.addEventListener('unload', () => {
    document.documentElement.innerHTML = ''
})

import PropertyService from '@service/darwin-property'

export default {
    install(Vue) {
        const model = Vue.observable({
            disabled: {}
        })

        PropertyService.disabledFeatures().then(data => {
            model.disabled = data
        })

        function has(scope) {
            return !scope || !model.disabled[`darwin.feature.${scope}.disabled`]
        }

        Vue.prototype.$has = has
    }
}

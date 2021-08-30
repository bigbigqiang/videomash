import { i18n } from '@digibird/common'
import toggleScript from '@util/toggleScript'

const language = window.localStorage.getItem('language') || 'zh-CN'

export default {
    async install(Vue) {
        Vue.prototype.$lang = language === 'zh-TW' ? 'zh-CN' : language
        if (process.env.NODE_ENV === 'development') {
            require(`../lang/${language}/index`)
            Vue.use(i18n, window._APP_LANGUAGE_PACK)
            return 'SUCCESS'
        }
        const result = await toggleScript('lang', language)
        Vue.use(i18n, window._APP_LANGUAGE_PACK)
        return result
    }
}

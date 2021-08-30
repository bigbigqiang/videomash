import Vue from 'vue'
import toggleLinkStyle from '@util/toggleLinkStyle'

export const ScriptThemeStore = Vue.observable({ theme: 'default' })

const Theme = {
    async install(theme) {
        if (process.env.NODE_ENV === 'development') {
            ScriptThemeStore.theme = theme
            return 'SUCCESS'
        }
        const result = toggleLinkStyle('theme', theme)
        ScriptThemeStore.theme = theme
        return result
    }
}

export const changeTheme = (theme) => {
    Theme.install(theme)
}

export default Theme

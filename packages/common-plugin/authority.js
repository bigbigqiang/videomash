import AuthorityService from '@service/authority'

const Authority = {
    menu: null,

    fetchMenus() {
        return AuthorityService.menu().then(menu => {
            Authority.menu = menu
            return menu
        })
    },

    isExist(key) {
        let isExist = false
        for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].id === key) {
                isExist = true
                break
            }
            if (this.menu[i].funcs && Array.isArray(this.menu[i].funcs)) {
                const fn = this.menu[i].funcs.some(item => item.id === key)
                if (fn) {
                    isExist = true
                    break
                }
            }
        }
        return isExist
    },

    getVWList() {
        const menus = this.menu.find(item => item.id === 'menu_vwc_control')
        if (!menus) return []
        if (!menus.parameters || !Array.isArray(menus.parameters)) return []
        return menus.parameters.map(item => ({
            id: item.paramterId.replace('menu_vwc_control', ''),
            name: item.title
        }))
    }
}

export default {
    install(Vue) {
        Vue.prototype.$Authority = Authority
    },
    fetchMenus: Authority.fetchMenus
}

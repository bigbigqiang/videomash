import LicenseLimit from '@runtime/support/license-limit'

export default {
    install(Vue, { register, router, loader }) {
        const authSate$ = Vue.observable({
            permission: {},
            unlicense: false, // 无许可
            trialAble: false, // 不能申请试用许可
            // authLimits: null,
            authType: null
        })

        Vue.prototype.$eventBus.on('licenseExpire', (data) => {
            if (data !== undefined) {
                authSate$.trialAble = data
            }
            authSate$.unlicense = true
        })

        const allowed = key => {
            if (!key) return true
            const { authType, permission } = authSate$
            const result = permission[key]
            // authSate$.authLimits = !authType ? null : LicenseLimit[authType]
            const isLicenseLimit = !authType
                || !LicenseLimit.menu[authType]
                || !LicenseLimit.menu[authType].some(element => key === element)
            return result && !!result.value && isLicenseLimit
        }

        const updatePermission = permission => {
            authSate$.permission = permission
        }

        Vue.prototype.$able = allowed

        if (register) {
            Vue.mixin({
                computed: {
                    unlicense$() {
                        return authSate$.unlicense
                    },
                    trialAble$() {
                        return authSate$.trialAble
                    },
                    authType$() {
                        return authSate$.authType
                    }
                }
            })
        }

        const mapRoute = item => ({
            name: item.key,
            path: item.path,
            meta: {
                auth: !item.hidden ? item.key : (item.parent || ''),
                parent: item.parent
            },
            component: require(`../view-backstage/${item.key}/index`).default
        })

        const processRegister = array => {
            const routes = []
            array.forEach(item => {
                if (item.path) {
                    routes.push(mapRoute(item))
                }
            })
            return routes
        }

        loader().then(([permission, config]) => {
            const authType = config['common.authDeviceType']
            // authSate$.authLimits = !authType ? null : LicenseLimit[authType]
            authSate$.authType = authType
            updatePermission(permission)
            if (!register) return
            register().then(regedit => {
                const routes = processRegister(regedit)
                let redirect = ''

                if (routes.length) {
                    redirect = routes.find(route => allowed(route.meta.auth))
                }
                routes.push({
                    path: '/',
                    redirect: redirect ? {
                        name: redirect.name
                    } : '/401'
                })

                router.beforeEach((to, from, next) => {
                    if (authSate$.unlicense && to.name !== 'license-manage') { // 无许可时所有路由跳转许可
                        next({ name: 'license-manage' })
                        return
                    }
                    if (!allowed(to.meta.auth)) {
                        next('/401')
                        return
                    }
                    next()
                })

                router.addRoutes(routes)
            })
        })

        Vue.$auth = {
            update: updatePermission
        }
    }
}

import Vue from 'vue'
import { Request } from '@digibird/common'

const client = Request.createClient({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
}, {
    response: [
        ({ data }) => {
            if (data && data.error) {
                Vue.prototype.$message.warn(data.error.message)
                return Promise.reject(data.error)
            }
            return data
        }, (error) => {
            Vue.prototype.$message.warn(Vue.prototype.$i18n('ui.unknown_error'))
            return Promise.reject(error)
        }
    ]
})

const {
    API, GET, POST, PUT, DELETE, CACHE, CANCEL
} = Request.buildDecorator(client)

export {
    API, GET, POST, PUT, DELETE, CACHE, CANCEL
}

export default client

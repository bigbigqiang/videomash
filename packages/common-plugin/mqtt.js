import SysService from '@service/sys'
import { MQTT } from '@digibird/common'
import { IS_DEV, CLIENT_ID } from '@app/env'
import Vue from 'vue'

const host = localStorage.getItem('MQTT_TEST_HOST') || window.location.hostname

SysService.config.then(config => {
    if (!config) {
        console.log('系统配置获取失败！')
        return
    }

    const mqttConfig = config['mqtt.config'] || {}
    const client = MQTT.create({
        topics: mqttConfig.mqttTopics,
        mqtt: {
            uris: [`ws://${host}:61623/`],
            userName: mqttConfig.mqttUserName,
            password: mqttConfig.mqttPwd
        },
        resourceMap: payload => ({
            ...payload,
            type: payload.key,
            clientId: payload.triggerId
        }),
        clientId: CLIENT_ID,
        debug: IS_DEV
    })
    Vue.prototype.$mqttClient = client
})

export default MQTT

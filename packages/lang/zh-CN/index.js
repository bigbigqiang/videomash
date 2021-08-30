import ui from './ui'
import biz from './biz'
import sys from '@runtime/i18n/zh-CN'

window._APP_LANGUAGE_PACK = {
    sys: window.APP_I18N ? window.APP_I18N['zh-CN'] : sys,
    ui,
    biz
}

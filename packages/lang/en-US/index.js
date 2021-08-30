import ui from './ui'
import biz from './biz'
import sys from '@runtime/i18n/en-US'

window._APP_LANGUAGE_PACK = {
    sys: window.APP_I18N ? window.APP_I18N['en-US'] : sys,
    ui,
    biz
}

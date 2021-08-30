const fs = require('fs')
const path = require('path')

const THEME_PATH = './packages/style/themes'

const types = fs.readdirSync(path.join(__dirname, '..', THEME_PATH))

function parser(config, tagType = 'link') {
    const themeChunks = []
    const themeEntrys = {}
    const pluginOption = []

    const keys = Object.keys(config)
    keys.forEach(key => {
        types.forEach(type => {
            const item = `${key}-theme-${type}`
            themeChunks.push(item)
            themeEntrys[item] = `${THEME_PATH}/${type}/${key}.less`
        })
        pluginOption.push({
            name: `html-tags-theme-${tagType}-${key}`,
            path: tagType === 'link' ? types.map(item => `${key}-theme-${item}`) : types.map(item => `theme.${item}`),
            theme: types,
            files: config[key]
        })
    })

    return {
        themeChunks,
        themeEntrys,
        themePluginOptions: pluginOption
    }
}

module.exports = parser

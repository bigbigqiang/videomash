const fs = require('fs-extra')
const path = require('path')
const regedit = require('./regedit')

/**
 * Brand log
 */
console.log(`                                        ##
                                       #####
                                      ######
                                        #####
                                        ######
                                        #######
                                        ########
                                        #########
                                         #########
                                         ##########
                                          ##########
                                            #########
######  ##  #####  ## ######  ## ######  #######  ####
####### ## ####### ## ####### ## ####### #######     ##
##   ## ## ##  ### ## ##  ### ## ##  ### ##  ###      ##
##   ## ## ##   ## ## ##   ## ## ##   ## ##   ##       ##
##   ## ## ##      ## ##  ### ## ##  ### ##   ##         #
##   ## ## ## #### ## ####### ## ####### ##   ##          #
##   ## ## ## #### ## ####### ## ####### ##   ##
##   ## ## ##   ## ## ##   ## ## ##   ## ##   ##
##   ## ## ##   ## ## ##   ## ## ##   ## ##   ##
####### ## ####### ## ####### ## ##   ## #######
######  ##  ###### ## ####### ## ##   ## ######
#####   ##   ###   ## #####   ## ##   ## #####
`)

const RUNTIME = path.resolve(__dirname, '../packages/_runtime')
const FILE_NAME = `${RUNTIME}/regedit.js`

function obj2String(obj) {
    return JSON.stringify(obj)
        .replace(/"/g, '\'')
        .replace(/{/g, '\n{')
}

function setRuntime(tasks) {
    fs.pathExists(RUNTIME).then(exists => {
        if (!exists) {
            fs.mkdirpSync(RUNTIME)
        }
        Object.keys(tasks).forEach(key => {
            tasks[key]()
        })
    })
}

function writeRegedit(worktable, backstage, backstageMenus) {
    const content = `
    export const worktable = ${obj2String(worktable)}

    export const backstage = ${obj2String(backstage)}

    export const backstageMenus = ${obj2String(backstageMenus)}`

    fs.outputFileSync(FILE_NAME, content)
}

function processor(product, oem) {
    const { pages, fileMap, feature } = require(`./${product}/index`)

    // 读写队列
    const tasks = {
        rumtime() {
            const runtimePath = path.resolve(__dirname, `./${product}/_runtime`)
            fs.pathExists(runtimePath).then(exists => {
                if (!exists) return
                // 复制产品差异目录
                fs.copySync(runtimePath, RUNTIME)
            })
        }
    }

    if (feature) {
        const worktable = feature.worktable ? regedit.worktable.filter(item => feature.worktable.includes(item.key)) : []
        const backstage = feature.backstage ? regedit.backstage.filter(item => feature.backstage.includes(item.key)) : []
        const backstageMenus = !feature.backstageMenus ? backstage : regedit.backstage.filter(item => feature.backstageMenus.includes(item.key))

        tasks.regedit = () => writeRegedit(worktable, backstage, backstageMenus)
    }

    let oemI18n = null
    if (oem && fs.pathExistsSync(oem)) {
        const assetPath = path.resolve(__dirname, '../public/assets')
        fs.copySync(oem, assetPath)
        oemI18n = require(`${oem}/i18n.json`)
    }

    setRuntime(tasks)

    return {
        entrys: pages || [],
        fileMap: fileMap || {},
        oemI18n: oemI18n ? JSON.stringify(oemI18n) : null
    }
}

module.exports = processor

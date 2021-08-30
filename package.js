const path = require('path')
const shell = require('shelljs')

const resolve = pathname => path.resolve(__dirname, pathname)

const src = resolve('./dist')
const { argv } = require('yargs')

const dest = resolve(`../${argv.warParentDirectory}`)

shell.cd(dest)
shell.rm('-rf', `${dest}/assets/*`)
shell.cp('-rf', [`${src}/assets`, `${src}/pages`], dest)

console.info('Package completed.\n')

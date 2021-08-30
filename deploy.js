const path = require('path')
const shell = require('shelljs')

const resolve = pathname => path.resolve(__dirname, pathname)

const src = resolve('./dist')
const dest = resolve('../code/war/src/main/webapp')

// const commitHash = shell.exec('git show -s --format=%h', { silent: true }).stdout

// shell.cd(dest)
// shell.exec(`git pull origin ${branch}`)
// shell.rm('-rf', `${dest}/assets/*`)
// shell.cp('-rf', [`${src}/assets`, `${src}/pages`], dest)

// shell.exec('git add assets')
// shell.exec('git add pages')

// shell.exec(`git commit -m "*[FE] Last commit ${commitHash}"`)
// shell.exec(`git push origin ${branch}`)

shell.exec('git pull')
shell.exec('npm i')
shell.exec('npm run build')

shell.rm('-rf', `${dest}/assets/*`)
shell.cp('-rf', src, dest)

console.info('\nDeploy completed.\n')

const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const webpack = require('webpack')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries')
const { argv } = require('yargs')
const processor = require('./build/processor')

const localConfig = fs.existsSync('./local.config.js') ? require('./local.config') : {}

const {
    PRODUCT, TITLE, OEM, NO_BRAND
} = argv
const { entrys, fileMap, oemI18n } = processor(PRODUCT, OEM)
const resolve = dir => path.join(__dirname, '', dir)

const isDevMode = process.env.NODE_ENV === 'development'

const publicPath = isDevMode ? '/' : '././'
const PAGES_PATH = './packages/app'
const I18N_PATH = './packages/lang'

const getChunks = (set, pathName) => set.map(name => `${pathName}.${name}`)
const getEntrys = (chunks, set, dirPath) => chunks.reduce((result, name, index) => {
    result[name] = `${dirPath}/${set[index]}/index.js`
    return result
}, {})

const i18nSet = fs.readdirSync(I18N_PATH)
const i18nChunks = getChunks(i18nSet, 'lang')
const i18nEntrys = getEntrys(i18nChunks, i18nSet, I18N_PATH)

const pages = entrys.reduce((acc, name) => {
    acc[name] = {
        entry: `${PAGES_PATH}/${name}/index.js`,
        title: TITLE ? TITLE.replace('%', name) : `${PRODUCT}-${name}`,
        filename: `${name}.html`,
        i18n: oemI18n,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeScriptTypeAttributes: true,
            preserveLineBreaks: true,
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        },
    }
    return acc
}, {
    ...i18nEntrys,
})

module.exports = {
    publicPath,
    outputDir: 'dist',
    assetsDir: 'assets',
    pages,
    devServer: {
        overlay: false,
        port: 8208,
        open: true,
        index: pages.index.filename,
        // historyApiFallback: {
        //     disableDotRule: true,
        //     rewrites
        // },
        proxy: localConfig.proxy || {
            '/api': {
                target: 'http://localhost:8082',
                changeOrigin: true
            }
        }
    },
    css: {
        requireModuleExtension: true,
        loaderOptions: {
            css: {
                modules: {
                    localIdentName: isDevMode ? '[folder]-[name]-[local]' : '[hash:5]'
                }
            },
            less: {
                javascriptEnabled: true
            }
        }
    },
    transpileDependencies: [/vue-components/],
    runtimeCompiler: true,
    chainWebpack: config => {
        config.resolve.modules.add(resolve('packages'))
        config.resolve.alias
            .set('@runtime', resolve('packages/_runtime'))
            .set('@app', resolve('packages/app'))
            .set('@lang', resolve('packages/lang'))
            .set('@style', resolve('packages/style'))
            .set('@mixin', resolve('packages/common-mixin'))
            .set('@plugin', resolve('packages/common-plugin'))
            .set('@service', resolve('packages/common-service'))
            .set('@util', resolve('packages/common-util'))
            .set('@designer', resolve('packages/view-designer'))
            .set('@business', resolve('packages/components/business'))
            .set('@components', resolve('packages/components'))
            .set('@assets', resolve('packages/assets'))

        if (!isDevMode) {
            const lastCommit = shell.exec('git show -s --format=%h', { silent: true }).stdout.replace(/\r|\n/g, '')

            const cssPath = name => `assets/css/${name}.${lastCommit}.css`
            const jsPath = name => `assets/js/${name}.${lastCommit}.js`

            config.output.filename(jsPath('[name]')).chunkFilename(jsPath('[name]'))

            config.plugin('extract-css').tap(() => [{
                filename: cssPath('[name]'),
                chunkFilename: cssPath('[name]')
            }])

            config.plugin('fix-style-only-entries').use(new FixStyleOnlyEntriesPlugin({ silent: true }))
            i18nChunks.forEach((name) => {
                config.plugins.delete(`html-${name}`)
            })
            config.plugin('html-tags-common').use(new HtmlWebpackTagsPlugin({
                scripts: {
                    path: jsPath('lang.zh-CN'),
                    attributes: {
                        lang: 'zh-CN',
                    },
                    publicPath: true,
                    append: false
                },
                metas: [{
                    path: new Date().toLocaleString(),
                    attributes: {
                        name: 'pkg_time'
                    },
                    publicPath: ''
                }, {
                    path: lastCommit,
                    attributes: {
                        name: 'last_commit'
                    },
                    publicPath: ''
                }]
            }))

            config.optimization.splitChunks({
                cacheGroups: {
                    vendors: {
                        name: 'chunk-common',
                        test(module) {
                            return /[\\/]node_modules[\\/]/.test(module.resource)
                                && !/developer-toolkit-web|lang/.test(module.resource)
                        },
                        priority: -10,
                        chunks: 'initial',
                        reuseExistingChunk: true,
                        enforce: true
                    },
                }
            })

            if (NO_BRAND) {
                // 无品牌模式，忽略 logo 等资源文件
                config.plugin('copy').init((Plugin, [args]) => {
                    const option = [{
                        ...args[0],
                        ignore: args[0].ignore.concat([
                            'logo.svg',
                            'favicon.ico'
                        ])
                    }]
                    return new Plugin(option)
                })
            }
        }

        config.plugin('product-difference-replace')
            .use(new webpack.NormalModuleReplacementPlugin(/(.*)@@(\.*)/, result => {
                const dir = result.request.replace('@@', '')
                const filename = fileMap[dir] || 'index'
                result.request = `${dir}/${filename}`
            }))
    },
}

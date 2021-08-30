# QA

## 如何为一个产品添加一个物理页面？

1. 在 `packages/app` 目录中建立新的页面文件夹，文件夹中必须有 `index.js` 作为主入口文件
2. 在 `build/[product]/index.js` 文件中修改 `pages` 配置
3. 重启开发服务

## 如果为一个产品添加一个后台路由页面？

1. 在 `packages/view-backstage` 中建立一个你需要的文件夹，文件夹中必须有 `index.vue` 作为入口组件
2. 在 `build/regedit.js` 中的 `backstage` 数组中参考注释添加新的子项
3. 重启开发服务

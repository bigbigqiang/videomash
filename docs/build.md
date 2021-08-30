## 产品差异

产品差异部分需要在 `build` 目录中建立产品名称标识对应的目录，以 AVCNET 为例，完整的目录结构如下：

```bash
- avcnet
    - index.js  # 差异配置文件
    - _runtime  # 差异运行时文件目录
```

### 配置文件

完全配置如下：

```js
module.exports = {
    pages: [],   // 产品包含哪些页面（名称参考 packages/app 目录）
    feature: {  // 页面或功能标识的集合（全量参考 build/regedit.js 文件）
        worktable: [],   // 操作界面功能标识
        backstage: [],   // 后台界面功能标识
    },
    fileMap: {  // 模块加载差异映射
        path: 'to'
    }
}
```

执行打包或开发时，命令后面需跟上产品标识，供打包配置中识别当前要打包的产品。

```bash
npm run dev:dmis
npm run build:dmis
```

对于存在模块差异时，要做特殊引用，以 `@@` 作为差异匹配符，供资源匹配插件识别该模块可能存在引用差异。

```js
import Worktable from 'view-worktable@@'
```

此时如果当前产品标识为 `dmis`，模块加载时会先去 dmis 模块加载差异中查找是否存在针对该引用的差异配置。

```js
// build/dmis/index.js
module.exports = {
    fileMap: {
        'view-worktable': 'worktable-dmis'    // => views/worktable/worktable-dmis
    }
}
```

如果有则替换，如果没有，则指向 `views/worktable/index`。

### 运行时文件

`build/[product]/_runtime -> packages/_runtime`

每个产品目录下的 `_runtime` 目录中具体存放哪些内容，原则上需一致，因为执行的是简单的拷贝策略，需要保证切换产品开发时引用不至于丢失。

代码中引用运行时文件：

```js
import module from '@runtime/path-to-file'
```

> 注意：由于差异相关配置和文件是在开发环境启动前加载的，所以开发过程中如果有修改需重启开发服务。

## QA

**为什么不取消配置文件，使用检查差异模块是否存在来替换引用？**

> 在开发环境时，所有模块都加载在内存中，此时如果匹配模块引用进行同步 IO 操作（查找文件是否存在）会造成开发环境运行缓慢，降低开发体验。

**那岂不是要写很多的差异配置？**

> 实际上，差异配置可能只需要在产品形态决定的那一阶段去做，后续应该不需要持续关注。而且差异配置中的每一项一般是个页面的入口或容器组件，所以数量不会太多。可能一个路由模块的差异配置项就搞定整个后台页面了。

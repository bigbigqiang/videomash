# 功能开关

## 菜单控制

在 `build/regedit.js` 中相关菜单项中增加 `feature` 字段，值为功能项标识。

```js
{
    key: 'station-config',
    path: '/us-manage/station',
    parent: 'us-manage',
    feature: 'unis'
}
```

## 页面功能控制

在任意组件中可使用 `this.$has('xxx')` 方法对某个功能标识判定。

数据渲染型，如 `tabs`，通过数据过滤没有的功能项。
具体功能区显示，如按钮，通过 `v-if="$has('xxx')"` 控制。

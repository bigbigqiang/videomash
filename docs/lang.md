# 国际化

## 分类

* `ui`：存放业务无关的内容，如无业务标识的按钮名称、无业务归属的提示信息等
* `biz`: 业务相关的内容

## 原则

* 国际化 `key` 尽量使用直接的英译单词，不要添加额外的前缀或业务标记。为了尽可能的复用已定义的翻译。
* 常见的或用户已知的英文缩写且在本软件中不存在歧义的，不需要国际化。如 IP、MAC 等。

```js
// 好的
export default {
    groupList: '分组列表',
    originalResolution: '原始分辨率',
    startIp: '起始IP'
}

// 不好的
export default {
    vwGroupList: '分组列表',
    signalOriginalResolution: '原始分辨率',
    nodeConfig_statrIp: '起始IP',
    ip: 'IP地址'
}
```


# OEM

## 支持范围

- Logo（登录、操作界面、后台等）
- 产品名称（登录、操作界面、后台等）
- favicon（浏览器标签页图标）
- copyright（版权商）

## 资源包结构要求

```bash
- logo.svg   ## LOGO
- favicon.ico  ## favicon
- i18n.json  ## 文本资源
```

### 文本资源

内容格式：

```json
{
    "zh-CN": {
        "title": "可视化分布式管控系统",
        "company": "北京小鸟科技股份有限公司"
    },
    "en-US": {
        "title": "VMCS",
        "company": "DigiBird Technology Co.,Ltd."
    }
}
```

## 命令行参数

```bash
--OEM=/pathToDir

## 示例
npm run build:qingluan -- --OEM=/pathToDir
```

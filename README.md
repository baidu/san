<p align="center">
    <a href="https://baidu.github.io/san/">
        <img src="https://baidu.github.io/san/img/logo-colorful.svg" alt="Logo" height="220">
    </a>
</p>

<h1 align="center">SAN</h1>

<p align="center">
一个快速、轻量、灵活的 JavaScript 组件框架
<br>
A fast, portable, flexible JavaScript component framework.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/san"><img src="http://img.shields.io/npm/v/san.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/san"><img src="https://img.shields.io/github/license/baidu/san.svg?style=flat-square" alt="License"></a>
  <a href="https://github.com/baidu/san/actions"><img src="https://github.com/baidu/san/workflows/CI/badge.svg" alt="Build Status"></a>
  <a href="https://coveralls.io/github/baidu/san?branch=master"><img src="https://img.shields.io/coveralls/github/baidu/san.svg?style=flat-square" alt="Coverage Status"></a>
  <a href="https://github.com/baidu/san/issues"><img src="https://img.shields.io/github/issues/baidu/san.svg?style=flat-square" alt="Issues"></a>
</p>

<p align="center">
  <a href="https://baidu.github.io/san/en/index.html" target="_blank">HomePage</a>
  <a href="https://baidu.github.io/san/" target="_blank">网站</a>
</p>




## 安装(Install)

NPM:

```
$ npm i san
```

CDN:

```html
<script src="https://unpkg.com/san@latest"></script>
```

[发布文件说明(Dist Files Information)](https://github.com/baidu/san/tree/master/dist)


## 快速开始(Quick Start)

```html
<!DOCTYPE html>
<html>

<head>
    <title>Quick Start</title>
    <script src="https://unpkg.com/san@latest"></script>
</head>

<body>
    <script>
        const MyApp = san.defineComponent({
            template: `
                <div>
                    <input type="text" value="{=name=}">
                    <p>Hello {{name}}!</p>
                </div>
            `
        });

        let myApp = new MyApp({
            data: {
                name: 'San'
            }
        });
        myApp.attach(document.body);
    </script>
</body>

</html>
```

## 示例(Examples)

- [Online Examples](https://baidu.github.io/san/example/)
- [Todos(AMD)](https://github.com/baidu/san/tree/master/example/todos-amd)
- [Todos(ESNext)](https://github.com/baidu/san/tree/master/example/todos-esnext)
- [RealWorld App(with store)](https://github.com/ecomfe/san-realworld-app)

## 文档(Document)

- [开始(Start)](https://baidu.github.io/san/tutorial/start/)
- [教程(Tutorial)](https://baidu.github.io/san/tutorial/setup/)
- [API](https://baidu.github.io/san/doc/api/)
- [ANode](https://github.com/baidu/san/blob/master/doc/anode.md)
- [APack](https://github.com/baidu/san/blob/master/doc/anode-pack.md)


## 周边(Companions)

|                | 说明(Description)                          |
| --------------------- | ------------------------------- |
| [san-devtools](https://github.com/baidu/san-devtools) | 调试应用的工具和扩展<br>Development tools for debugging applications |
| [san-router](https://github.com/baidu/san-router) | 支持 hash 和 html5 模式的 Router<br>SPA/MPA Router |
| [san-store](https://github.com/baidu/san-store) | 应用状态管理套件<br>Application States Management |
| [san-update](https://github.com/baidu/san-update) | Immutable的对象更新库<br>Immutable Data Update |
| [san-composition](https://github.com/baidu/san-composition) | 组合式 API<br>Composition API |
| [san-ssr](https://baidu.github.io/san-ssr/) | 服务端渲染框架与工具库<br>SSR framework and utils |
| [santd](https://ecomfe.github.io/santd/) | [Ant Design](https://ant.design/) 风格的组件库<br>Components Library following the [Ant Design](https://ant.design/) specification |
| [san-mui](https://ecomfe.github.io/san-mui/) | [Material Design](https://www.material.io/) 风格的组件库<br>[Material Design](https://www.material.io/) Components Library |
| [san-xui](https://ecomfe.github.io/san-xui/) | 百度云控制台风格的组件库<br>A Set of UI Components that widely used on Baidu Cloud Console |
| [sanny](https://github.com/searchfe/sanny) | VSCode 插件<br>VSCode extension for SAN |
| [san-cli](https://github.com/ecomfe/san-cli) | 帮助快速搭建应用的命令行工具<br>A CLI tooling for rapid development |
| [san-loader](https://github.com/ecomfe/san-cli/tree/master/packages/san-loader) | 支持 sfc 的 Webpack loader<br>Webpack loader for single-file components |
| [san-factory](https://github.com/baidu/san-factory) | 组件工厂能帮助你在不同环境下更灵活的装配组件<br>Component register and instantiation |
| [san-anode-utils](https://github.com/ecomfe/san-anode-utils) | [ANode](https://github.com/baidu/san/blob/master/doc/anode.md) 处理工具库<br>Util Functions for [ANode](https://github.com/baidu/san/blob/master/doc/anode.md) |
| [san-test-utils](https://github.com/ecomfe/san-test-utils) | 单元测试工具库<br>The unit testing utility library |

## 变更历史(ChangeLog)

Please visit document [ChangeLog](https://github.com/baidu/san/blob/master/CHANGELOG.md)


## License

San is [MIT licensed](./LICENSE).

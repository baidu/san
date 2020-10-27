<p align="center">
    <a href="https://baidu.github.io/san/">
        <img src="https://baidu.github.io/san/img/logo-colorful.svg" alt="Logo" height="220">
    </a>
</p>

<h1 align="center">SAN</h1>

<p align="center">
A fast, portable, flexible JavaScript component framework.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/san"><img src="http://img.shields.io/npm/v/san.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/san"><img src="https://img.shields.io/github/license/baidu/san.svg?style=flat-square" alt="License"></a>
  <a href="https://travis-ci.org/baidu/san"><img src="https://img.shields.io/travis/baidu/san/master.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://coveralls.io/github/baidu/san?branch=master"><img src="https://img.shields.io/coveralls/github/baidu/san.svg?style=flat-square" alt="Coverage Status"></a>
  <a href="https://github.com/baidu/san/issues"><img src="https://img.shields.io/github/issues/baidu/san.svg?style=flat-square" alt="Issues"></a>
</p>

<p align="center">
  <a href="https://baidu.github.io/san/en/index.html" target="_blank">HomePage</a>
  <a href="https://baidu.github.io/san/" target="_blank">网站</a>
</p>




## Download

NPM:

```
$ npm i san
```

CDN:

```html
<script src="https://unpkg.com/san@latest"></script>
```

[Dist Files Information](https://github.com/baidu/san/tree/master/dist)


## Quick Start

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

## Examples

- [Online Examples](https://baidu.github.io/san/example/)
- [Todos(AMD)](https://github.com/baidu/san/tree/master/example/todos-amd)
- [Todos(ESNext)](https://github.com/baidu/san/tree/master/example/todos-esnext)
- [RealWorld App(with store)](https://github.com/ecomfe/san-realworld-app)

## Document

- [Start](https://baidu.github.io/san/tutorial/start/)
- [Tutorial](https://baidu.github.io/san/tutorial/setup/)
- [API](https://baidu.github.io/san/doc/api/)
- [ANode](https://github.com/baidu/san/blob/master/doc/anode.md)
- [APack](https://github.com/baidu/san/blob/master/doc/anode-pack.md)


## Companions

- [san-devtools](https://github.com/baidu/san-devtools) - Development tools for debugging applications
- [san-router](https://github.com/baidu/san-router) - SPA Router
- [san-store](https://github.com/baidu/san-store) - Application States Management
- [san-update](https://github.com/baidu/san-update) - Immutable Data Update
- [san-ssr](https://baidu.github.io/san-ssr/) - SSR framework and utils
- [santd](https://ecomfe.github.io/santd/) - Components Library following the [Ant Design](https://ant.design/) specification
- [san-mui](https://ecomfe.github.io/san-mui/) - [Material Design](https://www.material.io/) Components Library
- [san-xui](https://ecomfe.github.io/san-xui/) - A Set of UI Components that widely used on Baidu Cloud Console
- [drei](https://github.com/ssddi456/drei/) - VSCode extension for SAN
- [san-cli](https://github.com/ecomfe/san-cli) - A CLI tooling for rapid development
- [san-loader](https://github.com/ecomfe/san-cli/tree/master/packages/san-loader) - Webpack loader for single-file components
- [san-factory](https://github.com/baidu/san-factory) - Component register and instantiation
- [san-anode-utils](https://github.com/ecomfe/san-anode-utils) - Util Functions for [ANode](https://github.com/baidu/san/blob/master/doc/anode.md)
- [san-test-utils](https://github.com/ecomfe/san-test-utils) - The unit testing utility library

## ChangeLog

Please visit document [ChangeLog](https://github.com/baidu/san/blob/master/CHANGELOG.md)


## License

San is [MIT licensed](./LICENSE).

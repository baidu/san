<p align="center">
    <a href="https://ecomfe.github.io/san/">
        <img src="https://ecomfe.github.io/san/img/logo-colorful.svg" alt="Logo" height="220">
    </a>
</p>

<h2 align="center">SAN</h2>

<p align="center">
An MVVM Component Framework for Web. <a href="https://ecomfe.github.io/san/" target="_blank">HomePage</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/san"><img src="http://img.shields.io/npm/v/san.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://travis-ci.org/ecomfe/san"><img src="https://img.shields.io/travis/ecomfe/san/master.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/san"><img src="https://img.shields.io/npm/dm/san.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/san"><img src="https://img.shields.io/github/license/ecomfe/san.svg?style=flat-square" alt="License"></a>
  <a href="https://github.com/ecomfe/san/issues"><img src="https://img.shields.io/github/issues/ecomfe/san.svg?style=flat-square" alt="Issues"></a>
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

[Dist Files](https://github.com/ecomfe/san/tree/master/dist)


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


## Document

- [Start](https://ecomfe.github.io/san/tutorial/start/)
- [Tutorial](https://ecomfe.github.io/san/tutorial/setup/)
- [Example](https://ecomfe.github.io/san/example/)
- [API](https://ecomfe.github.io/san/doc/api/)
- [ANode](https://github.com/ecomfe/san/blob/master/doc/anode.md)

## DevTool

[DevTool](https://github.com/ecomfe/san-devtool)

## ChangeLog

[ChangeLog](https://github.com/ecomfe/san/blob/master/CHANGELOG.md)

## See Also

- [san-router](https://github.com/ecomfe/san-router) - Official Router for San
- [san-store](https://github.com/ecomfe/san-store) - Official Application States Management for San
- [san-update](https://github.com/ecomfe/san-update) - Immutable Data Update Library
- [san-mui](https://ecomfe.github.io/san-mui/) - Material Design Components Library

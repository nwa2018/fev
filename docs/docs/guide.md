# 指南
项目根目录下需要有`fev.config.js`文件，`fev`所有功能都是围绕该文件的配置项展开，`fev.config.js`需要导出一个对象或返回对象的函数，示例如下

导出对象
``` js
module.exports = {
  ...
}
```

导出返回对象的函数，更利于扩展(`推荐`)
``` js
module.exports = api => {
  return {
    ...
  }
}
```

!> 以下所有功能示例配置均围绕项目下的`fev.config.js`文件进行设置

## 模板生成
运行`fev i`快速生成模板，此外

- `fev i vue`: 快速生成`vue`模板
- `fev i react`: 快速生成`react`模板
- `fev i lib`: 快速生成`js/vue npm`组件模板

## 开发vue/react项目
默认是`vue`项目体系
``` js
module.exports = {
}
```
开发`react`项目
``` js
module.exports = {
  jsx: 'react'
}
```
## 移动端开发模式

``` js
module.exports = {
  px2rem: {
    rootValue: 75,  // 代表750的设计稿宽度
    propWhiteList: [],
    minPixelValue: 2
  }
}
```
> 默认设计稿宽度`750`，如需更改成`600`

``` js
module.exports = {
  px2rem: {
    rootValue: 60,  // 设计稿宽度
    propWhiteList: [],
    minPixelValue: 2
  }
}
```

## 使用自定义模板文件
假如的你的模板文件存放在`src/assets/html`目录

支持模板的后缀`.art`, `.pug`, `.html`，如需增加，请自行扩展[webpack配置](docs/guide?id=扩展webpack配置)

``` js
module.exports = {
  templateFolder: './src/assets/html'
}
```

## 多页应用
假设你的文件目录组织如下：
```
src/
  assets/
    html/
      index.art
      share.html
      test.pug
  index.js
  share.js
  test.js
```
可以这么配
``` js
module.exports = {
  entry: './src',
  templateFolder: './src/assets/html'
}
```
或者
``` js
module.exports = {
  entry: {
    index: './src/index.js',
    share: './src/share.js',
    test: './src/test.js'
  },
  templateFolder: './src/assets/html'
}
```
## 本地开发的server
``` js
module.exports = {
  devServer: {
    https: true,    // 设置为true可以开启https
    proxy: {},      // 代理设置
    open: false,    // 默认不开浏览器
    ...
  }
}
```
更多配置项可以查看[webpack-dev-server](https://webpack.js.org/configuration/dev-server/)配置
## 静态文件
``` js
module.exports = {
  copyFolder: './src/public'
}
```
可以拷贝`copyFolder`目录下的所有文件到输出目录下`public`文件夹，示例，在`index.html`模板中可以如下使用
``` html
<script src='./public/xxx.xx'></script>
```

## eslint配置
关闭`eslint`
``` js
module.exports = {
  eslintConfig: false
}
```
默认的`vue eslint`:
``` js
{
  extends: ['standard', 'plugin:vue/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: 2017
  }
}
```
默认的`react eslint`，[eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app):
``` js
{
  extends: 'react-app'
}
```
覆盖`eslint`以及扩展，更多配置项请查看[Configuring ESLint](https://eslint.org/docs/user-guide/configuring)
``` js
// fev.config.js

module.exports = {
  eslintConfig: {
    rules: {
      // 允许使用new
      'no-new': 0,
      // 未经定义的变量弹出警告而不是报错
      'no-unused-vars': 1
    },
    // 注入一些全局变量，避免eslint报错
    globals: {
      "Vue": true
    },
    ...
    }
}
```
**如何忽略某些代码，某些文件的eslint检查**

方法很多，下面举几个例子：

- 忽略某个文件，顶部添加`/* eslint-disable */`

- 忽略某一行，该行后面添加`// eslint-disable-line`

- 忽略某些文件，项目根目录添加`.eslintignore`

- 忽略某些文件，项目根目录的`package.json`添加`eslintIgnore`字段，例如

```
  "eslintIgnore": [
    "/data",
    "index.js"
  ],
```
...
## 性能分析
内置使用[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
``` js
module.exports = {
  bundleAnalyzer: {
    analyzerPort: 9888,
    openAnalyzer: true
  }
}
```
## 开发npm组件
```
module.exports = {
  format: 'umd'
}
```
## 本地开发环境调试线上代码
使用以下命令

> fev d --env production

## 使用flow
``` js
module.exports = {
  flow: true
}
```
## 使用typescript
项目根目录新建文件`tsconfig.json`，配置项可以参考[tsconfig.json
](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)，举个例子：
``` json
{
    "compilerOptions": {
        "sourceMap": true
    }
}

```

另外需要修改`fev.config.js`配置
``` js
module.exports = {
  typescript: true
}
```
如需对`typescript`进行语法检查，请在项目根目录新建`tslint.json`，`tslint.json`的配置可以参考[Configuring TSLint](https://palantir.github.io/tslint/usage/configuration/)，举个例子：
``` json
{
  "extends": "tslint:recommended"
}
```

## webpack配置扩展
`webpack`字段为标准的`webpack`的配置，在最后编译阶段可以自行智能合并
``` js
module.exports = {
  webpack: {

  }
}
```

## babel配置扩展

``` js
module.exports = {
  babel: {}
}
```
`babel`字段为标准的配置，可以参考[babel options](https://babeljs.io/docs/en/options)

**注意:** 传入的`babel`中的`presets`与`plugins`会合并到默认的`presets`与`plugins`中，其他字段可以覆盖默认值，详情请看[默认配置](https://github.com/nwa2018/fev/blob/master/lib/config/babel.config.js)
## postcss配置扩展
``` js
module.exports = {
  postcss: []
}
```

## 注入外部扩展
可以参考[外部扩展(externals)](https://webpack.docschina.org/configuration/externals/)
``` js
module.exports = {
  webpack: {
    externals: {
      vue: 'Vue'
    }
  }
}
```
为了防止`eslint`报错，还需要增加
``` js
module.exports = {
  webpack: {
    externals: {
      vue: 'Vue'
    }
  },
  eslintConfig: {
    globals: {
      Vue: true
    }
  }
}
```
## 扩展html插件
使用的[html-webpack-plugins@4.0.0-beta.5](https://github.com/jantimon/html-webpack-plugin)，请注意版本，`html-webpack-plugin@3.x`跟`html-webpack-plugin@4.x`的用法是不一样的，下面举一个例子

``` js
module.exports = api => {
  return {
    webpack: {
      plugins: [{
        apply (compiler) {
          compiler.hooks.compilation.tap('yourPlugin', compilation => {
            const hooks = api.resolve('html-webpack-plugin').getHooks(compilation)

            // 从这里开始就可以拿到html-webpack-plugin所提供的hook了
            hooks.alterAssetTagGroups.tap('yourPlugin', () => {})
          }
        }
      }]
    }
    }
}
```






































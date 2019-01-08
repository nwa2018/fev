# 配置
在项目的根目录放置配置文件`fev.config.js`，`fev.config.js`需要导出一个对象或返回对象的函数，示例如下：
``` js
// fev.config.js
module.exports = {
  ...
}
// 或者
module.exports = api => {
  return {
    ...
  }
}
```
## entry
- 类型: `string` `object`
- 默认值: `./src`

`entry`可以指定入口文件的位置，示例如下：
``` js
module.exports = {
  entry: './src/index.js'
}
// 或者
module.exports = {
  entry: {
    index: './src/index.js',
    plugin1: './plugin/plugin1.js',
    plugin2: './plugin/plugin2.js'
  }
}
```
`entry`可以还传路径，`fev`会扫描指定路径下的所有`js`或`jsx`文件作为`webpack`编译入口，当开发多页应用的时候可以这么配
``` js
module.exports = {
  entry: './src'
}
```
------
## outputPath
- 类型: `string`
- 默认值: `dist`

打包构建的输出目录

------
## publicPath
- 类型: `string`
- 默认值: 无

------

## alias
- 类型：`object`
- 默认值

``` js
{
  '@@': './',
  '@': './src'   // 如果存在src目录
}
```
别名配置

------
## extensions
- 类型：`array`
- 默认值：`['.js', '.vue', '.styl', '.jsx', '.ts', '.css', '.scss', '.sass', '.art', '.pug', '.html']`
------
## resolveLoaderModules
- 类型：`array`

`webpack loader`的寻找路径，默认是在脚手架安装目录内寻找，找不到的话再在当前的`node_modules`目录找

------

## transpileModules
- 类型：`string` `array`
- 默认值：`[]`

`babel`转码的过程是很耗时的，`fev`内部不会编译`node_modules`下的模块，如果需要编译`node_modules`下的模块可以这么配

``` js
module.exports = {
  transpileModules: 'lodash'
}
// 或者
module.exports = {
  transpileModules: ['lodash', 'vue', '@fev']
  // fev可以编译node_modules/@fev下的所有文件
}
```
------

## babelExclude
- 类型：`reg` `string` `array`

`fev`内，`babel`默认是不编译`node_modules`里面的模块，可以指定`babelExclude`增加不编译的模块

------

## jsx
- 类型：`string`
- 默认值：`vue`
- 可选值：`vue` | `react`

`vue`为`vue`项目开发环境，`react`为`react`项目开发环境

------

## flow
- 类型：`boolean`
- 默认值：false

是否支持`flow`语法检查

------

## typescript
- 类型：`boolean`
- 默认值：false

是否支持`typescript`

------

## babel
- 类型：`object`
- 默认值：`{}`

传入`babel`中的`presets`与`plugins`会合并到默认的`presets`与`plugins`中，其他字段可以覆盖默认值，详情请看[默认配置](https://github.com/nwa2018/fev/blob/master/lib/config/babel.config.js)

------

## extractCSS
- 类型：`boolean`
- 默认值：true

生产环境中，是否将`css`从`js`文件中抽取成单独的文件

------

## autoprefixer
- 类型：`boolean` `object`
- 默认值：true

内置默认配置如下：
``` js
{
  browsers: [
    'ie > 8',
    'Android >= 2.3',
    'iOS >= 7'
  ],
  cascade: true
}
```
设置为`false`则不使用`autoprefixer`

[autoprefixer配置](https://github.com/postcss/autoprefixer#options)

------

## postcss
- 类型：`array`
- 默认值：[]

`postcss`的插件

------

## px2rem
- 类型：`boolean` `object`
- 默认值：false

> 设置该配置为`true`可以进行移动端适配

`px`转`rem`的`postcss`插件，移动端开发可以设置该配置，内置默认配置如下：
``` js
{
  rootValue: 75,  // 设计稿宽度
  propWhiteList: [],
  minPixelValue: 2
}
```

设置该选项的时候`html`会自动插入[lib-flexible](https://github.com/amfe/lib-flexible)脚本，从而使用`flexible`布局方案

!> 设计稿宽度如不是`750`，可以如下修改配置：
``` js
module.exports = {
  px2rem: {
    rootValue: 75,    // 使用720宽的设计稿
    propWhiteList: [],
    minPixelValue: 2
  }
}
```

------

## loaderOptions
- 类型：`object`
- 默认值：{}

可以覆盖默认的样式`loader`的`options`，示例如下：

``` js
module.exports = {
  loader: {
    css: {},
    postcss: {},
    sass: {},
    less: {},
    stylus: {}
  }
}
```
如需更改，请自行查看`github`上对应`loader`的配置项

------

## markdown
- 类型：`boolean`
- 默认值：`false`

是否使用`markdown-loader`处理`.md`后缀的文件

------

## imagemin
- 类型：`boolean` `object`
- 默认值：`true`

生产环境是否自动压缩图片，[imagemin的配置项](https://github.com/tcoopman/image-webpack-loader#options)

默认配置如下：
``` js
{
  pngquant: {
    speed: 4,
    quality: '75-90'
  },
  optipng: {
    optimizationLevel: 7
  },
  mozjpeg: {
    quality: 70,
    progressive: true
  },
  gifsicle: {
    interlaced: false
  }
}
```

------

## inlineImageMaxSize
- 类型：`number`
- 默认值：8192

图片转`base64`内联进`js`文件的阈值

------

## define
- 类型：`object`
- 默认值：

``` js
{
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}
```

[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)的参数，可以合并到默认参数中

------

## copyFolder
- 类型：`string`
- 默认值：无

拷贝目录，可以拷贝`copyFolder`目录下的所有文件到输出目录下`public`文件夹

``` js
// fev.config.js
module.exports = {
  copyFolder: './src/public'
}

// 在index.html模板中使用
<script src='./public/xxx.xx'></script>
```

------

## bundleAnalyzer
- 类型：`boolean` `object`
- 默认值：无

生成环境是否使用[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)分析打包后代码的体积大小以及依赖等信息，如需打开，`fev.config.js`配置示例如下，运行`fev`命令即可打开
``` js
// fev.config.js
module.exports = {
  bundleAnalyzer: {
    analyzerPort: 9888,
    openAnalyzer: true
  }
}
```
运行示例如下：
![](assets/img/bundlerAnalyze.jpg)

------

## minimize
- 类型：`object`
- 默认值：生成环境为`true`，开发环境为`false`

是否压缩`js`，`css`文件

------

## templateFolder
- 类型：`string`
- 默认值：内置默认模板

`templateFolder`为模板的存放路径，`fev`可以扫描`templateFolder`下所有文件作为[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)的入口文件，支持`.html`,`.pug`,`.art`，以多页应用示例如下
``` js
// fev.config.js
module.exports = {
  entry: './src'
  templateFolder: './src/html'
}
```
目录如下：
``` js
src/
  html/
    index.html
    share.html
  index.js
  share.js
fev.config.js
```

-----

## html
- 类型：`object`
- 默认值：`{}`

可以将`htmlWebpackPlugin.options.xx`注入到模板的变量中，`fev.config.js`示例配置如下：

``` js
// fev.config.js
module.exports = {
  html: {
    title: 'from html data'
  }
}
```
如果使用的是`art`模板，如`index.art`，可以这么写:
``` html
<title>{{htmlWebpackPlugin.options.title}}</title>
```

------

## sourceMap
- 类型：`boolean` `string`
- 默认值：生产环境为`source-map`，开发环境为`cheap-module-eval-source-ma`

通过通过设置`false`关掉生产`sourceMap`的功能

------

## webpack
- 类型：`object` `function`
- 默认值：`{}`

在生成最终`webpack`配置的阶段，合并传进来的`webpack`配置项

------

## devServer
- 类型：`object`
- 默认值：`{}`

配置项请参考[webpack-dev-server](https://webpack.js.org/configuration/dev-server/)

-------















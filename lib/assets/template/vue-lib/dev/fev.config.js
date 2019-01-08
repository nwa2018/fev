module.exports = {
  entry: './index.js',

  // 最终打包到dist文件夹，不加这个引用打包后的代码会报错
  babelExclude: /dist/
}

const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const log = require('../utils/log')

exports.apply = api => {
  let {
    isProd,
    isDev,
    isLib,
    isLocalTest,
    outputPath,
    sourceMap,
    config: {
      minimize,
      define = {},
      copyFolder = '',
      bundleAnalyzer,
      px2rem
    }
  } = api
  minimize = api.normalizeMinimize(minimize)

  const isShowBundleAnalyzer = bundleAnalyzer && typeof bundleAnalyzer === 'object' && isProd && !isLocalTest
  api.merge({
    plugins: [
      // TODO not work
      // new webpack.optimize.AggressiveSplittingPlugin({
      //   minSize: 10000,
      //   maxSize: 20000,
      // }),
      // 生产环境先清空原目录
      require('../plugins/clear-output-path-plugin')(api),
      require('../plugins/process-plugin')(),
      require('../plugins/inline-chunk-plugin')(api, {
        tests: [/runtime.+[.]js/]
      }),
      isShowBundleAnalyzer && new BundleAnalyzerPlugin(bundleAnalyzer),
      !isLib && new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin(Object.assign({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }, define)),

      copyFolder && new CopyWebpackPlugin([{
        from: {
          glob: '**/*',
          dot: true
        },
        context: api.cwdPath(copyFolder),
        to: path.join(api.outputPath, 'public')
      }]),

      minimize && new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: !!sourceMap,
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        }
      }),
      isDev && new FriendlyErrorsPlugin(),
      // 此处抄poi
      isDev && new CaseSensitivePathsPlugin()
    ].filter(Boolean)
  })
}

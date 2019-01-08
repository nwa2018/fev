exports.apply = api => {
  let {
    isProd,
    config: {
      imagemin,
      markdown = false,
      inlineImageMaxSize = 8192
    }
  } = api
  imagemin = isProd
    ? imagemin === undefined
    ? {
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
    : imagemin
    : false
  const rules = [
    {
      test: /\.(woff|woff2|eot|ttf|otf|svga?)$/,
      use: 'file-loader'
    },
    {
      test: /\.json$/,
      use: 'json-loader'
    },
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.webp$/],
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: inlineImageMaxSize,
            fallback: 'file-loader'
          }
        },
        imagemin && {
          loader: 'image-webpack-loader',
          options: imagemin
        }
      ].filter(Boolean)
    }
  ]
  if (markdown) {
    rules.push({
      test: /\.md$/,
      loader: 'md-loader'
    })
  }
  api.merge({
    module: {
      rules
    }
  })
}

exports.arrayMerge = (source, target) => {
  target.forEach(item => {
    if (!source.includes(item)) {
      source.push(item)
    }
  })
  return source
}

module.exports = app => {
  const mongoose = require("mongoose")
  mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true
  })
  // a模型使用b模式时，b模型没有引用过来，没有使用过时可能会报错
  // 一般我们会把所有的模型引用一遍  使用一个插件 require-all 这个插件用于把一个目录下的文件引入进来
  require('require-all')(__dirname + '/../modules')
} 
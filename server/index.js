const express = require('express')

const app = express()

// 设置全局变量
app.set('secret', 'aasdfqwe123')

// 添加中间件
app.use(express.json())
app.use(require('cors')())
app.use('/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/king', express.static(__dirname + '/web'))

require('./routes/admin')(app)
require('./plugins/db')(app)
require('./routes/web')(app)

app.listen(3000, () => {
  console.log('a')
})
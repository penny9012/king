module.exports = app => {
  // 编辑接口
  const express = require('express')
  const assert = require('http-assert')
  const router = express.Router({
    mergeParams: true
    // 合并URL参数
  })

  // 新建分类接口
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 更新数据的接口
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删除分类的接口
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })
  // 查询分页列表  插入中间件   到了哪个页面都会验证
  router.get('/', async (req, res) => {
    const queryOptions = {}
    console.log(req)
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions)
    res.send(items)
  })
  // 查询id  
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })
  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth')
  // 大小写转换
  const resourceMiddleware = require('../../middleware/resource')
  // 设置中间件 请求数据的入口
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    // upload.single 表示接收单个文件的上传
    const file = await req.file
    file.url = `http://127.0.0.1:3000/uploads/${file.filename}`
    res.send(file)
  })

  //  登录接口
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    // 1.根据用户名查找用户
    // 引入查询的模型
    const AdminUser = require('../../modules/AdminUser')
    // 查找
    const user = await AdminUser.findOne({
      username
      // 我们在数据模型里给密码设置了不展示密码 这样设置完后默认是取不到的 所有我们需要加上.select('+password') 表示查询时加上这个字段
    }).select('+password')
    // 返回查询结果 状态码
    // if (!user) {
    //   return res.status(422).send({
    //     message: '用户不存在 '
    //   })
    // }
    assert(user, 422, '用户不存在')
    // 2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }
    // 3.返回token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    res.send({ token })
  })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    console.log('90' + err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}






// 通用CRUD接口配置
// module.exports = app => {
//   // 编辑接口
//   const express = require('express')
//   const router = express.Router({
//     mergeParams: true
//     // 合并URL参数
//   })

//   // 新建分类接口
//   router.post('/', async (req, res) => {
//     const model = await req.Model.create(req.body)
//     res.send(model)
//   })
//   // 更新数据的接口
//   router.put('/:id', async (req, res) => {
//     const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
//     res.send(model)
//   })
//   // 删除分类的接口
//   router.delete('/:id', async (req, res) => {
//     await req.Model.findByIdAndDelete(req.params.id, req.body)
//     res.send({
//       success: true
//     })
//   })
//   // 查询分页列表
//   router.get('/', async (req, res) => {
//     const queryOptions = {}
//     if (req.Model.modelName === 'Category') {
//       queryOptions.populate = 'parent'
//     }
//     const items = await req.Model.find().setOptions(queryOptions).limit(10)
//     res.send(items)
//   })
//   // 查询id
//   router.get('/:id', async (req, res) => {
//     const model = await req.Model.findById(req.params.id)
//     res.send(model)
//   })
//   app.use('/admin/api/rest/:resource', async (req, res, next) => {
//     const modelName = require('inflection').classify(req.params.resource)
//     req.Model = require(`../../modules/${modelName}`)
//     next()
//   }, router)
// }


// 普通的接口
// module.exports = app => {
//   // 编辑接口
//   const express = require('express')
//   const router = express.Router(

//   )
//   const Category = require('../../modules/Category')

//   // 新建分类接口
//   router.post('/categories', async (req, res) => {
//     const model = await Category.create(req.body)
//     res.send(model)
//   })
//   // 更新数据的接口
//   router.put('/categories/:id', async (req, res) => {
//     const model = await Category.findByIdAndUpdate(req.params.id, req.body)
//     res.send(model)
//   })
//   // 删除分类的接口
//   router.delete('/categories/:id', async (req, res) => {
//     await Category.findByIdAndDelete(req.params.id, req.body)
//     res.send({
//       success: true
//     })
//   })
//   // 查询分页列表
//   router.get('/categories', async (req, res) => {
//     const items = await Category.find().populate('parent').limit(10)
//     res.send(items)
//   })
//   // 查询id
//   router.get('/categories/:id', async (req, res) => {
//     const model = await Category.findById(req.params.id)
//     res.send(model)
//   })
//   app.use('/admin/api', router)
// }
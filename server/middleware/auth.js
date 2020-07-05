module.exports = options => {
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../modules/AdminUser')

  return async (req, res, next) => {
    // 校验用户是否登录
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '无效的jwt token')
    // 校验token
    const { id } = jwt.verify(token, req.app.get('secret')) //decode 解密 不会验证对错
    assert(id, 401, '无效的id')
    // 去查询用户   挂载到req上去 每个请求都能请求到这个数据
    req.user = await AdminUser.findById(id)
    assert(req.user, '401', '请先登录')
    await next()
  }
}
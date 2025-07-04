// const 
const domain = 'https://product.chuncongcong.top',
  URL = {
    login: domain +'/api/user/login', /* 用户登录 */
    salStatis: domain + '/api/sell/log/nums', /* 售货统计 */
    stoStatis: domain + '/api/sku/nums', /* 库存商品统计 */
    pucStatis: domain + '/api/purchase/log/nums', /* 进货统计 */
    bacStatis: domain + '/api/return/log/nums', /* 退货统计 */
    purcList: domain + '/api/purchase/log/list', /* 进货列表 */
    saleList: domain + '/api/sell/log/list', /* 售货列表 */
    backList: domain + '/api/return/log/list', /* 退货列表 */
    despList: domain + '/api/product/list', /* 库存列表 */
    skuList: domain + '/api/product/get/info/', /* 货品详情 */
    saleSku: domain + '/api/sku/sell', /* 售出商品 */
    category: domain + '/api/category/list', /* 分类列表 */
    attrValue: domain + '/api/attribute/value/get/', /* 规格及属性列表 */
    addValue: domain + '/api/value/save', /* 增加属性值 */
    addProduct: domain + '/api/product/add', /* 添加货品&商品 */
    getProduct: domain + '/api/product/get/info/', /* 获取货品详细信息 */
    modProduct: domain + '/api/product/update/sku', /* 修改货品信息 */
    returnProd: domain + '/api/sell/log/returns/', /* 客户退货 */
    returnFact: domain + '/api/sku/return', /* 退回厂家 */
  }

function Request (obj) {
  const token = wx.getStorageSync('token')
  if (token) {
    obj.header = { token }
  }
  wx.request({
    ...obj,
    fail: function() {
      wx.showToast({
        title: '请求失败，请检查网络连接',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

function SuccRequest (result) {
  const res = result.data
  if (res.code === 1) {
    return res.data || true
  } else if (res.code === 500) {
    wx.showToast({
      title: res.msg,
      icon: 'none',
      duration: 1000
    })
  } else if (res.code === 401) {
    wx.redirectTo({
      url: '/pages/login/login',
    })
  } else {
    wx.showToast({
      title: '系统异常，请联系管理员',
      icon: 'none',
      duration: 1000
    })
    return false
  }
}

module.exports = {
  URL,
  Request,
  SuccRequest
}

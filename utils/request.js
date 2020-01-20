// const 
const domain = 'http://www.chuncongcong.com:8040',
  URL = {
    login: domain +'/api/user/login', /* 用户登录 */
    salStatis: domain + '/api/sell/log/nums', /* 售货统计 */
    stoStatis: domain + '/api/sku/nums', /* 库存商品统计 */
    pucStatis: domain + '/api/purchase/log/nums', /* 进货统计 */
    purcList: domain + '/api/purchase/log/list', /* 进货列表 */
    saleList: domain + '/api/sell/log/list', /* 售货列表 */
    despList: domain + '/api/product/list', /* 库存列表 */
    skuList: domain + '/api/product/get/info/', /* 货品详情 */
    saleSku: domain + '/api/sku/sell', /* 售出商品 */
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

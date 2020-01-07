// const 
const domain = 'http://www.chuncongcong.com:8040',
  token = wx.getStorageSync('user') || '32533a9e-7e01-49ef-9946-14757d18cced',
  URL = {
    despList: domain + '/api/product/list',
    skuList: domain + '/api/product/get/info/'
  }

function Request (obj) {
  wx.request({
    header: {
      token
    },
    ...obj,
    fail: function() {
      wx.showToast({
        title: '请求失败，请检查网络连接',
        icon: 'none',
        duration: 1000
      })
    }
  })
}

function SuccRequest (result) {
  const res = result.data
  if (res.code === 1) {
    return res.data
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

import { URL, Request, SuccRequest } from '../../utils/request.js'

Page({
  /* Init data of page */
  data: {
    username: null,
    password: null
  },
  // Input value listener
  username: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // Login
  login: function (e) {
    const { username, password } = this.data
    if (!username || !password) {
      let remain = '请输入用户名'
      if (username) {
        remain = "请输入密码"
      }
      wx.showToast({
        title: remain,
        icon: 'none',
        duration: 1000
      })
      return
    }
    Request({
      url: URL.login,
      method: 'post',
      data: {
        mobile: username,
        password,
      },
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          wx.showToast({
            title: '登录成功！',
            duration: 2000,
            complete: function () {
              wx.setStorageSync('token', data.token)
              wx.switchTab({ url: '/pages/index/index' })
            }
          })
        }
      }
    })
  },
  /* LifeCycle--监听页面加载 */
  onLoad: function (options) {
    const token = wx.getStorageSync('token') || null
    if (token) {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
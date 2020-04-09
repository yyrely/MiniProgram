let admin = false

App({
  globalData: {
    admin: false
  },
  onLaunch: function () {
    // Get user informations.
    const token = wx.getStorageSync('token') || null
    const roles = wx.getStorageSync('roles') || null
    if (!token || !roles) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
    } else {
      if (roles.indexOf('ROLE_ADMIN') !== -1) {
        this.globalData.admin = true
      }
    }
  }
})
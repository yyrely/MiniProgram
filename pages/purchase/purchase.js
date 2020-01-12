const { URL, Request, SuccRequest } = require('../../utils/request.js')

Page({
  data: {
    pageNum: 1,
    pageSize: 20,
    purcList: []
  },
  /* LifeCycle--监听页面加载 */
  onLoad: function (options) {
    const that = this,
      { pageNum, pageSize } = that.data
    Request({
      url: `${URL.purcList}?pageNum=${pageNum}&pageSize=${pageSize}`,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          console.log(data.content)
          that.setData({
            purcList: data.content
          })
        }
      }
    })
  }
})

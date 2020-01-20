const { URL, Request, SuccRequest } = require('../../utils/request.js')
const app = getApp()

Page({
  /* Init data of Page */
  data: {
    saleInfo: {},
    purcInfo: {},
    stokeInfo: {}
  },
  /* Event Listeners */
  toggleCalendar: function (e) {
    console.log(1);
  },
  /* LifeCycle-监听页面显示 */
  onShow: function () {
    let that = this
    Request({
      url: URL.salStatis,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            saleInfo: data
          })
        }
      }
    })
    Request({
      url: URL.pucStatis,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            purcInfo: data
          })
        }
      }
    })
    Request({
      url: URL.stoStatis,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            stokeInfo: data
          })
        }
      }
    })
  }
})

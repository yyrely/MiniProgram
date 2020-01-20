const { URL, Request, SuccRequest } = require('../../utils/request.js')
const app = getApp()

Page({
  /* Init data of Page */
  data: {
    saleInfo: {},
    purcInfo: {},
    stokeInfo: {}
  },
  pageRequest: function (date) {
    let that = this,
      { salStatis, pucStatis, stoStatis } = URL
    if (date) {
      const dates = date.split(' ~ ')
      salStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
      pucStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
      stoStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
    }
    Request({
      url: salStatis,
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
      url: pucStatis,
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
      url: stoStatis,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            stokeInfo: data
          })
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let {date} = e.detail
    this.pageRequest(date)
  },
  /* LifeCycle-监听页面显示 */
  onShow: function () {
    this.pageRequest()
  }
})

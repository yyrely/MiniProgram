import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'

Page({
  /* Init data of Page */
  data: {
    saleInfo: {},
    purcInfo: {},
    stokeInfo: {},
    salLoad: true,
    pucLoad: true,
    stoLoad: true,
    date: handleDate()
  },
  pageLoad: function () {
    let that = this,
      { date } = this.data,
      { salStatis, pucStatis, stoStatis } = URL
    that.setData({
      salLoad: true,
      pucLoad: true,
      stoLoad: true
    })
    const dates = date.split(' ~ ')
    salStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
    pucStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
    stoStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url: salStatis,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            saleInfo: data,
            salLoad: false
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
            purcInfo: data,
            pucLoad: false
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
            stokeInfo: data,
            stoLoad: false
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let { date } = e.detail
    this.setData({ date })
    this.pageLoad()
  },
  /* LifeCycle-监听页面显示 */
  onShow: function () {
    this.pageLoad()
  },
  /* 下拉刷新 */
  onPullDownRefresh: function() {
    const { salLoad, pucLoad, stoLoad } = this.data
    if (salLoad || pucLoad || stoLoad) return
    this.pageLoad()
  }
})

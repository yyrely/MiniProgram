import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'

const today = handleDate()

Page({
  /* Init data of Page */
  data: {
    saleInfo: {},
    purcInfo: {},
    stokeInfo: {},
    backInfo: {},
    salLoad: true,
    pucLoad: true,
    stoLoad: true,
    bacLoad: true,
    dates: [today, today]
  },
  pageLoad: function () {
    let that = this,
      { dates } = this.data,
      { salStatis, pucStatis, stoStatis, bacStatis } = URL
    that.setData({
      salLoad: true,
      pucLoad: true,
      stoLoad: true,
      bacLoad: true
    })
    salStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
    pucStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
    bacStatis += `?startDate=${dates[0]}&endDate=${dates[1]}`
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
    Request({
      url: bacStatis,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            backInfo: data,
            bacLoad: false
          })
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let { dates } = e.detail
    this.setData({ dates })
    this.pageLoad()
  },
  /* LifeCycle-监听页面显示 */
  onShow: function () {
    this.pageLoad()
  },
  /* 下拉刷新 */
  onPullDownRefresh: function() {
    const { salLoad, pucLoad, stoLoad, bacLoad } = this.data
    if (salLoad || pucLoad || stoLoad || bacLoad) return
    this.pageLoad()
  }
})

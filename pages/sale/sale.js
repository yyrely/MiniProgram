// pages/sale/sale.js
const { URL, Request, SuccRequest } = require('../../utils/request.js')

function handleDate() {
  let date = new Date()
  date = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
  if (typeof date.month == 'number' && date.month < 10) {
    date.month = `0${date.month}`
  }
  if (typeof date.day == 'number' && date.day < 10) {
    (date.day = `0${date.day}`)
  }
  let dateStr = `${date.year}-${date.month}-${date.day}`
  return dateStr + ' ~ ' + dateStr
}

Page({
  /* Init data of page */
  data: {
    pageNum: 1,
    pageSize: 20,
    saleList: []
  },
  pageRequest: function ({date, num=1, size=20} = {}) {
    let that = this
    if (!date) date = handleDate()
    const dates = date.split(' ~ '),
      url = `${URL.saleList}?pageNum=${num}&pageSize=${size}`
        + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            saleList: data.content
          })
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let { date } = e.detail
    this.pageRequest({ date })
  },
  /* LifeCycle--监听页面加载 */
  onLoad: function (options) {
    this.pageRequest()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /* LifeCycle--监听页面显示 */
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
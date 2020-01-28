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
  data: {
    pageNum: 1,
    pageSize: 20,
    purcList: [],
    date: null
  },
  pageRequest: function ({num=1, size=20} = {}) {
    let that = this,
        { date } = that.data
    if (!date) date = handleDate()
    const dates = date.split(' ~ '),
      url = `${URL.purcList}?pageNum=${num}&pageSize=${size}` 
            + `&startDate=${dates[0]}&endDate=${dates[1]}`
    Request({
      url,
      success: function (res) {
        const data = SuccRequest(res)
        if (data) {
          that.setData({
            purcList: data.content
          })
        }
      }
    })
  },
  /* Event Listeners */
  dateFresh: function (e) {
    let { date } = e.detail
    this.setData({ date })
    this.pageRequest()
  },
  /* LifeCycle--监听页面加载 */
  onShow: function () {
    this.pageRequest()
  }
})

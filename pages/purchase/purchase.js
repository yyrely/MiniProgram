import { handleDate } from '../../utils/util.js'
import { URL, Request, SuccRequest } from '../../utils/request.js'


Page({
  data: {
    pageNum: 1,
    pageSize: 20,
    purcList: [],
    date: handleDate()
  },
  pageRequest: function ({num=1, size=20} = {}) {
    let that = this,
        { date } = that.data
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
